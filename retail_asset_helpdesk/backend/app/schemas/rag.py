from typing import Optional, List
from pydantic import BaseModel


class FileStatus(BaseModel):
    filename: str
    ingested: bool
    asset_category: Optional[str] = None


class IngestStatus(BaseModel):
    total_files: int
    ingested_files: int
    pending_files: int
    files: List[FileStatus]


class IngestResponse(BaseModel):
    message: str
    files_processed: int
    chunks_ingested: int
    new_files: List[str]
    skipped_files: List[str]


class Source(BaseModel):
    filename: str
    doc_type: str
    asset_category: str


class QueryRequest(BaseModel):
    question: str
    asset_category: Optional[str] = None
    filename: Optional[str] = None


class QueryResponse(BaseModel):
    answer: str
    sources: List[Source]


class SearchRequest(BaseModel):
    query: str
    limit: int = 5
    asset_category: Optional[str] = None
    filename: Optional[str] = None


class SearchResult(BaseModel):
    text: str
    filename: str
    asset_category: str
    score: float


class StatsResponse(BaseModel):
    total_chunks: int
    total_files: int
    collection_name: str