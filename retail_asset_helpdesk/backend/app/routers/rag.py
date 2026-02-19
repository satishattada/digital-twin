from typing import List
from fastapi import APIRouter, HTTPException

from app.schemas.rag import (
    IngestStatus,
    IngestResponse,
    QueryRequest,
    QueryResponse,
    SearchRequest,
    SearchResult,
    StatsResponse,
    FileStatus
)
from app.schemas.chat import SummarizeRequest, SummarizeResponse
from app.services.document_processor import DocumentProcessor
from app.services.qdrant_service import QdrantRAGService
from app.utils.helpers import extract_category_from_filename

router = APIRouter(tags=["RAG"])

# Initialize services
doc_processor = DocumentProcessor()
rag_service = QdrantRAGService()


@router.post("/ingest", response_model=IngestResponse)
async def ingest_documents():
    """Ingest new documents from the docs folder."""
    documents = doc_processor.get_all_documents()
    
    new_files = []
    skipped_files = []
    total_chunks = 0
    
    for doc_path in documents:
        # Use filename+hash to allow same content with different filenames
        file_hash = doc_processor.get_file_hash(doc_path)
        file_key = f"{doc_path.name}:{file_hash}"
        
        if rag_service.is_file_ingested(file_key):
            skipped_files.append(doc_path.name)
            continue
        
        chunks = doc_processor.process_document(doc_path)
        
        if chunks:
            # Update chunks to use the file_key
            for chunk in chunks:
                chunk['file_hash'] = file_key
            ingested = rag_service.ingest_chunks(chunks)
            total_chunks += ingested
            new_files.append(doc_path.name)
        else:
            skipped_files.append(f"{doc_path.name} (no text extracted)")
    
    return IngestResponse(
        message="Ingestion complete",
        files_processed=len(new_files),
        chunks_ingested=total_chunks,
        new_files=new_files,
        skipped_files=skipped_files
    )


@router.get("/ingest/status", response_model=IngestStatus)
async def get_ingest_status():
    """Get current ingestion status."""
    documents = doc_processor.get_all_documents()
    ingested_hashes = rag_service.get_ingested_files()
    
    files_status = []
    for doc_path in documents:
        file_hash = doc_processor.get_file_hash(doc_path)
        file_key = f"{doc_path.name}:{file_hash}"
        asset_category = extract_category_from_filename(doc_path.name)
        
        files_status.append(FileStatus(
            filename=doc_path.name,
            ingested=file_key in ingested_hashes,
            asset_category=asset_category
        ))
    
    ingested_count = sum(1 for f in files_status if f.ingested)
    
    return IngestStatus(
        total_files=len(files_status),
        ingested_files=ingested_count,
        pending_files=len(files_status) - ingested_count,
        files=files_status
    )


@router.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """Query the RAG system with a question."""
    try:
        result = rag_service.query_with_llm(
            question=request.question,
            asset_category=request.asset_category,
            filename=request.filename
        )
        return QueryResponse(
            answer=result["answer"],
            sources=result["sources"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/search", response_model=List[SearchResult])
async def search_documents(request: SearchRequest):
    """Search for relevant document chunks."""
    try:
        results = rag_service.search(
            query=request.query,
            limit=request.limit,
            asset_category=request.asset_category,
            filename=request.filename
        )
        return [SearchResult(**r) for r in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats", response_model=StatsResponse)
async def get_stats():
    """Get RAG system statistics."""
    stats = rag_service.get_stats()
    if "error" in stats:
        raise HTTPException(status_code=500, detail=stats["error"])
    return StatsResponse(**stats)


@router.delete("/collection")
async def delete_collection():
    """Delete all ingested documents (reset the system)."""
    try:
        rag_service.delete_collection()
        return {"message": "Collection deleted and recreated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_chat(request: SummarizeRequest):
    """Summarize a chat conversation."""
    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")
    
    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    summary = rag_service.summarize_chat(messages)
    
    return SummarizeResponse(summary=summary)