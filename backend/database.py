"""
Hermes Cowork - Database Models
SQLite database for tasks, files, and agent state
"""
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import enum
import os

# Database path
DB_PATH = os.path.expanduser("~/.hermes/cowork/data/cowork.db")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class TaskStatus(enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    PAUSED = "paused"


class TaskPriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class Task(Base):
    """Main task table for tracking all operations"""
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    progress = Column(Float, default=0.0)  # 0-100
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    estimated_duration = Column(Integer)  # seconds
    actual_duration = Column(Integer)  # seconds
    
    # Parent task (for sub-tasks)
    parent_id = Column(Integer, ForeignKey("tasks.id"))
    subtasks = relationship("Task", backref="parent", remote_side=[id])
    
    # Result
    result = Column(Text)
    error_message = Column(Text)
    
    # Files involved
    input_files = Column(Text)  # JSON list
    output_files = Column(Text)  # JSON list
    
    # Agent info
    agent_id = Column(String(100))


class FileOperation(Base):
    """Track file operations for history and undo"""
    __tablename__ = "file_operations"
    
    id = Column(Integer, primary_key=True, index=True)
    operation = Column(String(50))  # create, modify, delete, move, copy
    file_path = Column(String(1000), nullable=False)
    file_type = Column(String(50))
    file_size = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    success = Column(Boolean, default=True)
    error_message = Column(Text)
    # For undo capability
    backup_path = Column(String(1000))


class Agent(Base):
    """Sub-agent tracking"""
    __tablename__ = "agents"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String(100), unique=True, nullable=False)
    name = Column(String(100))
    status = Column(String(50), default="idle")  # idle, active, waiting, completed
    current_task = Column(String(500))
    memory_usage = Column(Integer)  # MB
    started_at = Column(DateTime, default=datetime.utcnow)
    last_heartbeat = Column(DateTime, default=datetime.utcnow)
    tasks_completed = Column(Integer, default=0)


class Setting(Base):
    """Application settings"""
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)
    value = Column(Text)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ChatMessage(Base):
    """Chat history"""
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    extra_data = Column(Text)


# Create tables
Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency for FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
