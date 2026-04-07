"""
Hermes Cowork - Pydantic Models for API
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class TaskStatusEnum(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    PAUSED = "paused"


class TaskPriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


# ============ TASK MODELS ============

class TaskCreate(BaseModel):
    title: str = Field(..., max_length=500)
    description: Optional[str] = None
    priority: TaskPriorityEnum = TaskPriorityEnum.MEDIUM
    input_files: Optional[List[str]] = []
    parent_id: Optional[int] = None
    estimated_duration: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatusEnum] = None
    progress: Optional[float] = None
    result: Optional[str] = None
    error_message: Optional[str] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: TaskStatusEnum
    priority: TaskPriorityEnum
    progress: float
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    estimated_duration: Optional[int]
    actual_duration: Optional[int]
    parent_id: Optional[int]
    result: Optional[str]
    error_message: Optional[str]
    input_files: Optional[List[str]]
    output_files: Optional[List[str]]
    agent_id: Optional[str]
    subtasks: List["TaskResponse"] = []

    class Config:
        from_attributes = True


# ============ FILE MODELS ============

class FileInfo(BaseModel):
    path: str
    name: str
    extension: str
    size: int
    size_human: str
    modified: datetime
    created: datetime
    is_directory: bool
    is_file: bool
    permissions: Optional[str] = None
    mime_type: Optional[str] = None


class DirectoryListing(BaseModel):
    path: str
    parent: Optional[str]
    files: List[FileInfo]
    directories: List[FileInfo]
    total_files: int
    total_directories: int
    total_size: int
    total_size_human: str


class FileOperationRequest(BaseModel):
    operation: str  # read, write, delete, move, copy
    source: str
    destination: Optional[str] = None
    content: Optional[str] = None
    confirm: bool = False


class FileOperationResponse(BaseModel):
    success: bool
    operation: str
    source: str
    destination: Optional[str] = None
    message: Optional[str] = None
    backup_path: Optional[str] = None


class DeleteConfirmation(BaseModel):
    paths: List[str]
    total_size: int
    total_size_human: str
    file_count: int
    directory_count: int


# ============ AGENT MODELS ============

class AgentInfo(BaseModel):
    agent_id: str
    name: Optional[str]
    status: str
    current_task: Optional[str]
    memory_usage: Optional[int]
    started_at: datetime
    last_heartbeat: datetime
    tasks_completed: int
    progress: Optional[float] = None

    class Config:
        from_attributes = True


class SubAgentSpawn(BaseModel):
    task_id: int
    agent_count: int = Field(1, ge=1, le=8)
    agent_prefix: str = "subagent"
    task_split: str = "auto"  # auto, manual


# ============ CHAT MODELS ============

class ChatMessageCreate(BaseModel):
    content: str
    role: str = "user"
    task_id: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None


class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    timestamp: datetime
    task_id: Optional[int]
    metadata: Optional[Dict[str, Any]]

    class Config:
        from_attributes = True


# ============ SETTINGS MODELS ============

class SettingUpdate(BaseModel):
    key: str
    value: str


class SettingResponse(BaseModel):
    key: str
    value: str
    updated_at: datetime


# ============ DOCUMENT MODELS ============

class DocumentCreate(BaseModel):
    document_type: str  # excel, powerpoint, pdf, word
    title: str
    data: Dict[str, Any]
    template: Optional[str] = None
    output_path: Optional[str] = None


class DocumentResponse(BaseModel):
    success: bool
    file_path: str
    file_name: str
    file_size: int
    download_url: str


# ============ TELEGRAM MODELS ============

class TelegramNotification(BaseModel):
    message: str
    parse_mode: str = "HTML"
    buttons: Optional[List[Dict[str, str]]] = None
    task_id: Optional[int] = None


class TelegramCallback(BaseModel):
    callback_id: str
    data: str
    message_id: int
    chat_id: int
    user_id: int


# ============ WEBSOCKET MODELS ============

class WSMessage(BaseModel):
    type: str  # task_update, agent_update, file_update, chat, notification
    data: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ============ STATS MODELS ============

class DashboardStats(BaseModel):
    tasks_total: int
    tasks_pending: int
    tasks_in_progress: int
    tasks_completed: int
    tasks_failed: int
    agents_active: int
    files_processed_today: int
    storage_used: str
    uptime: str


# Update forward references
TaskResponse.model_rebuild()
