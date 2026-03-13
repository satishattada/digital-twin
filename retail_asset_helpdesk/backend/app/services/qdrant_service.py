import uuid
from typing import List, Dict, Any, Optional, Set

from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
from openai import OpenAI

from app.core.config import settings


class QdrantRAGService:
    """RAG service using Qdrant vector database."""
    
    def __init__(self):
        try:
            self.qdrant = QdrantClient(
                host=settings.QDRANT_HOST,
                port=settings.QDRANT_PORT,
                timeout=5.0  # 5 second timeout
            )
            self.COLLECTION_NAME = settings.QDRANT_COLLECTION
            
            # Initialize embedding model
            print(f"Loading embedding model: {settings.EMBEDDING_MODEL}")
            self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
            
            # Initialize OpenAI client
            self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
            
            # Track ingested files
            self._ingested_hashes: Set[str] = set()
            
            # Ensure collection exists
            self._ensure_collection()
            self._load_ingested_hashes()
            
            self._available = True
            print("✅ Qdrant service initialized successfully")
        except Exception as e:
            print(f"⚠️  Qdrant service not available: {e}")
            print("   RAG features will be disabled, but asset management will work")
            self._available = False
            self.qdrant = None
            self.embedding_model = None
            self.openai_client = None
            self._ingested_hashes = set()
    
    def is_available(self) -> bool:
        """Check if Qdrant service is available."""
        return self._available
    
    def _ensure_collection(self):
        """Create collection if it doesn't exist."""
        collections = self.qdrant.get_collections().collections
        collection_names = [c.name for c in collections]
        
        if self.COLLECTION_NAME not in collection_names:
            self.qdrant.create_collection(
                collection_name=self.COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=settings.EMBEDDING_DIMENSION,
                    distance=Distance.COSINE
                )
            )
            print(f"Created collection: {self.COLLECTION_NAME}")
    
    def _load_ingested_hashes(self):
        """Load existing file hashes from collection."""
        try:
            # Scroll through all points to get unique file hashes
            offset = None
            while True:
                results = self.qdrant.scroll(
                    collection_name=self.COLLECTION_NAME,
                    limit=100,
                    offset=offset,
                    with_payload=True,
                    with_vectors=False
                )
                
                points, offset = results
                
                for point in points:
                    if point.payload and 'file_hash' in point.payload:
                        self._ingested_hashes.add(point.payload['file_hash'])
                
                if offset is None:
                    break
            
            print(f"Loaded {len(self._ingested_hashes)} ingested file hashes")
        except Exception as e:
            print(f"Error loading ingested hashes: {e}")
    
    def is_file_ingested(self, file_hash: str) -> bool:
        """Check if a file has already been ingested."""
        if not self._available:
            return False
        return file_hash in self._ingested_hashes
    
    def get_ingested_files(self) -> Set[str]:
        """Get set of ingested file hashes."""
        return self._ingested_hashes.copy()
    
    def _embed_text(self, text: str) -> List[float]:
        """Generate embedding for text."""
        if not self._available:
            return []
        return self.embedding_model.encode(text).tolist()
    
    def _embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts."""
        return self.embedding_model.encode(texts).tolist()
    
    def ingest_chunks(self, chunks: List[Dict[str, Any]]) -> int:
        """Ingest document chunks into Qdrant."""
        if not self._available:
            raise Exception("Qdrant service not available")
        if not chunks:
            return 0
        
        # Extract texts and generate embeddings
        texts = [chunk['text'] for chunk in chunks]
        embeddings = self._embed_batch(texts)
        
        # Create points
        points = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            point_id = str(uuid.uuid4())
            payload = {
                "text": chunk['text'],
                "filename": chunk['filename'],
                "file_hash": chunk['file_hash'],
                "chunk_id": chunk['chunk_id'],
                "asset_category": chunk.get('asset_category', 'general'),
                "doc_type": chunk.get('doc_type', 'manual'),
            }
            points.append(PointStruct(
                id=point_id,
                vector=embedding,
                payload=payload
            ))
        
        # Upsert in batches
        batch_size = 100
        for i in range(0, len(points), batch_size):
            batch = points[i:i + batch_size]
            self.qdrant.upsert(
                collection_name=self.COLLECTION_NAME,
                points=batch
            )
        
        # Track file hash
        if chunks:
            self._ingested_hashes.add(chunks[0]['file_hash'])
        
        print(f"Ingested {len(points)} chunks")
        return len(points)
    
    def search(
        self,
        query: str,
        limit: int = 5,
        asset_category: Optional[str] = None,
        filename: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Search for relevant chunks."""
        query_embedding = self._embed_text(query)
        
        # Build filter
        filter_conditions = []
        
        # if asset_category:
        #     filter_conditions.append(
        #         models.FieldCondition(
        #             key="asset_category",
        #             match=models.MatchValue(value=asset_category)
        #         )
        #     )
        
        if filename:
            filter_conditions.append(
                models.FieldCondition(
                    key="filename",
                    match=models.MatchValue(value=filename)
                )
            )
        
        search_filter = None
        if filter_conditions:
            search_filter = models.Filter(must=filter_conditions)
        
        # Use query_points instead of search (newer API)
        results = self.qdrant.query_points(
            collection_name=self.COLLECTION_NAME,
            query=query_embedding,
            limit=limit,
            query_filter=search_filter,
            with_payload=True
        )
        
        return [
            {
                "text": hit.payload.get("text", ""),
                "filename": hit.payload.get("filename", ""),
                "asset_category": hit.payload.get("asset_category", ""),
                "doc_type": hit.payload.get("doc_type", ""),
                "score": hit.score
            }
            for hit in results.points
        ]
    
    def query_with_llm(
        self,
        question: str,
        asset_category: Optional[str] = None,
        filename: Optional[str] = None
    ) -> Dict[str, Any]:
        """Query with RAG - search + LLM generation."""
        
        # Search for relevant context
        search_results = self.search(
            query=question,
            limit=5,
            asset_category=asset_category,
            filename=filename
        )
        
        if not search_results:
            return {
                "answer": "I don't have any relevant documentation to answer your question. Please make sure the relevant equipment manuals have been ingested.",
                "sources": []
            }
        
        # Build context
        context_parts = []
        sources = []
        seen_files = set()
        
        for result in search_results:
            context_parts.append(f"[From {result['filename']}]:\n{result['text']}")
            
            if result['filename'] not in seen_files:
                sources.append({
                    "filename": result['filename'],
                    "doc_type": result['doc_type'],
                    "asset_category": result['asset_category']
                })
                seen_files.add(result['filename'])
        
        context = "\n\n---\n\n".join(context_parts)
        
        # Build prompt
        system_prompt = """You are a helpful retail equipment support assistant. Your role is to help users troubleshoot equipment issues, find maintenance procedures, understand error codes, and provide guidance based on equipment documentation.

Guidelines:
- For greetings (hi, hello, hey, etc.) or casual conversation, respond briefly and friendly without diving into technical details. Simply greet back and ask how you can help.
- Only provide technical guidance when the user asks a specific question about equipment.
- Provide clear, step-by-step instructions when applicable
- If the documentation mentions safety warnings, always include them
- If you're not sure about something, say so rather than guessing
- Reference specific error codes or procedures when mentioned in the documentation
- Be concise and to the point, brief the answers to max of 5 pointed steps. Each step should be of 1 short sentence.
- Even if the documentation doesn't contain relevant information to answer the question, there is no need to let the user know that documentation. You can suggest from overall understanding of retail equipment.

Examples:
- User: "Hi" → Response: "Hello! How can I help you with your equipment today?"
- User: "Hey there" → Response: "Hi! What can I assist you with?"
- User: "Coffee machine not working" → Provide troubleshooting steps"""

        user_prompt = f"""Based on the following documentation excerpts, please answer the user's question.

DOCUMENTATION:
{context}

USER QUESTION: {question}

Please provide a helpful response based on the documentation above. If the documentation doesn't contain relevant information to answer the question, let the user know."""

        # Call OpenAI
        try:
            response = self.openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            answer = response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI API error: {e}")
            answer = f"I found relevant documentation but encountered an error generating a response. Here's a summary of what I found:\n\n{context_parts[0][:500]}..."
        
        return {
            "answer": answer,
            "sources": sources
        }
    
    def get_stats(self) -> Dict[str, Any]:
        """Get collection statistics."""
        try:
            collection_info = self.qdrant.get_collection(self.COLLECTION_NAME)
            
            # Get unique filenames
            unique_files = set()
            offset = None
            while True:
                results = self.qdrant.scroll(
                    collection_name=self.COLLECTION_NAME,
                    limit=100,
                    offset=offset,
                    with_payload=["filename"],
                    with_vectors=False
                )
                
                points, offset = results
                for point in points:
                    if point.payload and 'filename' in point.payload:
                        unique_files.add(point.payload['filename'])
                
                if offset is None:
                    break
            
            return {
                "total_chunks": collection_info.points_count,
                "total_files": len(unique_files),
                "collection_name": self.COLLECTION_NAME
            }
        except Exception as e:
            return {"error": str(e)}
    
    def delete_collection(self):
        """Delete the collection."""
        self.qdrant.delete_collection(self.COLLECTION_NAME)
        self._ingested_hashes.clear()
        self._ensure_collection()
    
    def summarize_chat(self, messages: List[Dict[str, str]]) -> str:
        """Summarize a chat conversation."""
        if not self._available or not self.openai_client:
            # Fallback: just concatenate last messages
            return "\n".join([f"{m['role']}: {m['content']}" for m in messages[-10:]])
        
        # Format chat history
        chat_history = "\n".join([
            f"{'User' if m['role'] == 'user' else 'Assistant'}: {m['content']}"
            for m in messages
        ])
        
        system_prompt = """You are a support conversation summarizer. Given a chat conversation, create a concise summary that includes:
1. The main issue or question
2. Key troubleshooting steps attempted
3. Current status/outcome
4. Any error codes or specific equipment mentioned

Keep the summary under 200 words and focus on actionable information."""

        user_prompt = f"""Please summarize this support conversation:

{chat_history}"""

        try:
            response = self.openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=300
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Summarization error: {e}")
            return "\n".join([f"{m['role']}: {m['content']}" for m in messages[-5:]])