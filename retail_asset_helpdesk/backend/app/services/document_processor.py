import os
import hashlib
import re
from pathlib import Path
from typing import List, Dict, Any, Optional
from html.parser import HTMLParser

from PyPDF2 import PdfReader

from app.core.config import settings
from app.utils.helpers import extract_category_from_filename, extract_doc_type_from_filename, clean_text


class HTMLTextExtractor(HTMLParser):
    """Extract text content from HTML, ignoring tags."""
    
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.skip_tags = {'script', 'style', 'head', 'meta', 'link', 'noscript'}
        self.current_skip = False
    
    def handle_starttag(self, tag, attrs):
        if tag.lower() in self.skip_tags:
            self.current_skip = True
    
    def handle_endtag(self, tag):
        if tag.lower() in self.skip_tags:
            self.current_skip = False
    
    def handle_data(self, data):
        if not self.current_skip:
            text = data.strip()
            if text:
                self.text_parts.append(text)
    
    def get_text(self) -> str:
        return ' '.join(self.text_parts)


class DocumentProcessor:
    """Process PDF and HTM documents and extract text with chunking."""
    
    def __init__(self, docs_folder: Optional[str] = None):
        self.docs_folder = Path(docs_folder or settings.DOCS_FOLDER)
        self.chunk_size = settings.CHUNK_SIZE
        self.chunk_overlap = settings.CHUNK_OVERLAP
        self.supported_extensions = ['.pdf', '.htm', '.html', '.txt']
    
    def get_all_documents(self) -> List[Path]:
        """Get all supported document files in the docs folder."""
        if not self.docs_folder.exists():
            self.docs_folder.mkdir(parents=True, exist_ok=True)
            return []
        
        documents = []
        for ext in self.supported_extensions:
            documents.extend(self.docs_folder.glob(f"*{ext}"))
            documents.extend(self.docs_folder.glob(f"**/*{ext}"))  # Include subdirs
        
        return sorted(set(documents), key=lambda p: p.name)
    
    def get_file_hash(self, filepath: Path) -> str:
        """Generate MD5 hash of file for tracking."""
        hasher = hashlib.md5()
        with open(filepath, 'rb') as f:
            buf = f.read(65536)
            while len(buf) > 0:
                hasher.update(buf)
                buf = f.read(65536)
        return hasher.hexdigest()
    
    def extract_text_from_pdf(self, filepath: Path) -> str:
        """Extract text from a PDF file."""
        try:
            reader = PdfReader(filepath)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text
        except Exception as e:
            print(f"Error extracting text from PDF {filepath}: {e}")
            return ""
    
    def extract_text_from_html(self, filepath: Path) -> str:
        """Extract text from an HTML/HTM file."""
        try:
            encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
            content = None
            
            for encoding in encodings:
                try:
                    with open(filepath, 'r', encoding=encoding) as f:
                        content = f.read()
                    break
                except UnicodeDecodeError:
                    continue
            
            if content is None:
                with open(filepath, 'rb') as f:
                    content = f.read().decode('utf-8', errors='ignore')
            
            parser = HTMLTextExtractor()
            parser.feed(content)
            return parser.get_text()
            
        except Exception as e:
            print(f"Error extracting text from HTML {filepath}: {e}")
            return ""
    
    def extract_text_from_txt(self, filepath: Path) -> str:
        """Extract text from a TXT file."""
        try:
            encodings = ['utf-8', 'latin-1', 'cp1252']
            for encoding in encodings:
                try:
                    with open(filepath, 'r', encoding=encoding) as f:
                        return f.read()
                except UnicodeDecodeError:
                    continue
            return ""
        except Exception as e:
            print(f"Error extracting text from TXT {filepath}: {e}")
            return ""
    
    def extract_text(self, filepath: Path) -> str:
        """Extract text from a document based on its extension."""
        extension = filepath.suffix.lower()
        
        if extension == '.pdf':
            return self.extract_text_from_pdf(filepath)
        elif extension in ['.htm', '.html']:
            return self.extract_text_from_html(filepath)
        elif extension == '.txt':
            return self.extract_text_from_txt(filepath)
        else:
            print(f"Unsupported file type: {extension}")
            return ""
    
    def chunk_text(self, text: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Split text into overlapping chunks with metadata."""
        text = clean_text(text)
        
        if not text:
            return []
        
        chunks = []
        start = 0
        chunk_id = 0
        
        while start < len(text):
            end = start + self.chunk_size
            
            # Try to break at sentence boundary
            if end < len(text):
                last_period = text.rfind('.', start + self.chunk_size - 100, end)
                if last_period > start:
                    end = last_period + 1
            
            chunk_text = text[start:end].strip()
            
            if chunk_text and len(chunk_text) > 50:  # Skip very small chunks
                chunks.append({
                    "text": chunk_text,
                    "chunk_id": chunk_id,
                    "start_char": start,
                    "end_char": end,
                    **metadata
                })
                chunk_id += 1
            
            start = end - self.chunk_overlap
            if start < 0:
                start = 0
            if start >= len(text):
                break
        
        return chunks
    
    def process_document(self, filepath: Path) -> List[Dict[str, Any]]:
        """Process a single document file and return chunks with metadata."""
        filename = filepath.name
        file_hash = self.get_file_hash(filepath)
        
        # Extract text
        text = self.extract_text(filepath)
        if not text:
            return []
        
        # Build metadata
        asset_category = extract_category_from_filename(filename)
        doc_type = extract_doc_type_from_filename(filename)
        
        metadata = {
            "filename": filename,
            "file_hash": file_hash,
            "filepath": str(filepath),
            "asset_category": asset_category or "general",
            "doc_type": doc_type,
        }
        
        # Chunk the text
        chunks = self.chunk_text(text, metadata)
        
        print(f"Processed {filename}: {len(chunks)} chunks")
        return chunks