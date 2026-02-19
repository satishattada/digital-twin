from pydantic import BaseModel
from typing import List


class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str


class SummarizeRequest(BaseModel):
    messages: List[ChatMessage]


class SummarizeResponse(BaseModel):
    summary: str