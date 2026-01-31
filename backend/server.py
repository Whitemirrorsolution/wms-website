from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'taskflow_db')]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'taskflow-super-secret-key-2025')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI(title="TaskFlow API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str = "member"
    organization_id: Optional[str] = None
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class OrganizationCreate(BaseModel):
    name: str

class OrganizationResponse(BaseModel):
    id: str
    name: str
    created_by: str
    created_at: datetime

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    organization_id: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: str
    organization_id: Optional[str] = None
    created_by: str
    members: List[str] = []
    statuses: List[str] = ["To Do", "In Progress", "Review", "Done"]
    created_at: datetime

class SubTask(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    completed: bool = False

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: str = "medium"  # low, medium, high, critical
    status: str = "To Do"
    due_date: Optional[datetime] = None
    start_date: Optional[datetime] = None
    assignee_id: Optional[str] = None
    project_id: Optional[str] = None
    tags: List[str] = []
    subtasks: List[SubTask] = []
    recurring: Optional[str] = None  # daily, weekly, monthly

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None
    start_date: Optional[datetime] = None
    assignee_id: Optional[str] = None
    project_id: Optional[str] = None
    tags: Optional[List[str]] = None
    subtasks: Optional[List[SubTask]] = None
    recurring: Optional[str] = None

class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    status: str
    due_date: Optional[datetime] = None
    start_date: Optional[datetime] = None
    assignee_id: Optional[str] = None
    assignee_name: Optional[str] = None
    project_id: Optional[str] = None
    project_name: Optional[str] = None
    tags: List[str] = []
    subtasks: List[SubTask] = []
    recurring: Optional[str] = None
    created_by: str
    created_at: datetime
    updated_at: datetime

class CommentCreate(BaseModel):
    content: str
    task_id: str

class CommentResponse(BaseModel):
    id: str
    content: str
    task_id: str
    user_id: str
    user_name: str
    created_at: datetime

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    type: str  # task_assigned, task_updated, due_soon, overdue
    message: str
    task_id: Optional[str] = None
    read: bool = False
    created_at: datetime

class ActivityResponse(BaseModel):
    id: str
    task_id: str
    user_id: str
    user_name: str
    action: str
    details: Optional[str] = None
    created_at: datetime

class DashboardStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    overdue_tasks: int
    in_progress_tasks: int
    tasks_by_status: Dict[str, int]
    tasks_by_priority: Dict[str, int]

class InviteRequest(BaseModel):
    email: EmailStr
    organization_id: Optional[str] = None

# ============== HELPER FUNCTIONS ==============

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "role": user.get("role", "member"),
            "organization_id": user.get("organization_id")
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def create_notification(user_id: str, type: str, message: str, task_id: str = None):
    notification = {
        "user_id": user_id,
        "type": type,
        "message": message,
        "task_id": task_id,
        "read": False,
        "created_at": datetime.utcnow()
    }
    await db.notifications.insert_one(notification)

async def create_activity(task_id: str, user_id: str, user_name: str, action: str, details: str = None):
    activity = {
        "task_id": task_id,
        "user_id": user_id,
        "user_name": user_name,
        "action": action,
        "details": details,
        "created_at": datetime.utcnow()
    }
    await db.activities.insert_one(activity)

# ============== AUTH ROUTES ==============

@api_router.post("/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_doc = {
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "name": user_data.name,
        "role": "member",
        "organization_id": None,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create token
    access_token = create_access_token({"sub": user_id})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_id,
            email=user_data.email,
            name=user_data.name,
            role="member",
            organization_id=None,
            created_at=user_doc["created_at"]
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token({"sub": user_id})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_id,
            email=user["email"],
            name=user["name"],
            role=user.get("role", "member"),
            organization_id=user.get("organization_id"),
            created_at=user["created_at"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user["name"],
        role=user.get("role", "member"),
        organization_id=user.get("organization_id"),
        created_at=user["created_at"]
    )

# ============== ORGANIZATION ROUTES ==============

@api_router.post("/organizations", response_model=OrganizationResponse)
async def create_organization(org_data: OrganizationCreate, current_user: dict = Depends(get_current_user)):
    org_doc = {
        "name": org_data.name,
        "created_by": current_user["id"],
        "created_at": datetime.utcnow()
    }
    
    result = await db.organizations.insert_one(org_doc)
    org_id = str(result.inserted_id)
    
    # Update user's organization
    await db.users.update_one(
        {"_id": ObjectId(current_user["id"])},
        {"$set": {"organization_id": org_id, "role": "admin"}}
    )
    
    return OrganizationResponse(
        id=org_id,
        name=org_data.name,
        created_by=current_user["id"],
        created_at=org_doc["created_at"]
    )

@api_router.get("/organizations", response_model=List[OrganizationResponse])
async def get_organizations(current_user: dict = Depends(get_current_user)):
    orgs = await db.organizations.find({"created_by": current_user["id"]}).to_list(100)
    return [
        OrganizationResponse(
            id=str(org["_id"]),
            name=org["name"],
            created_by=org["created_by"],
            created_at=org["created_at"]
        )
        for org in orgs
    ]

# ============== PROJECT ROUTES ==============

@api_router.post("/projects", response_model=ProjectResponse)
async def create_project(project_data: ProjectCreate, current_user: dict = Depends(get_current_user)):
    project_doc = {
        "name": project_data.name,
        "description": project_data.description or "",
        "organization_id": project_data.organization_id or current_user.get("organization_id"),
        "created_by": current_user["id"],
        "members": [current_user["id"]],
        "statuses": ["To Do", "In Progress", "Review", "Done"],
        "created_at": datetime.utcnow()
    }
    
    result = await db.projects.insert_one(project_doc)
    
    return ProjectResponse(
        id=str(result.inserted_id),
        name=project_doc["name"],
        description=project_doc["description"],
        organization_id=project_doc["organization_id"],
        created_by=project_doc["created_by"],
        members=project_doc["members"],
        statuses=project_doc["statuses"],
        created_at=project_doc["created_at"]
    )

@api_router.get("/projects", response_model=List[ProjectResponse])
async def get_projects(current_user: dict = Depends(get_current_user)):
    projects = await db.projects.find({
        "$or": [
            {"created_by": current_user["id"]},
            {"members": current_user["id"]}
        ]
    }).to_list(100)
    
    return [
        ProjectResponse(
            id=str(p["_id"]),
            name=p["name"],
            description=p.get("description", ""),
            organization_id=p.get("organization_id"),
            created_by=p["created_by"],
            members=p.get("members", []),
            statuses=p.get("statuses", ["To Do", "In Progress", "Review", "Done"]),
            created_at=p["created_at"]
        )
        for p in projects
    ]

@api_router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, current_user: dict = Depends(get_current_user)):
    project = await db.projects.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return ProjectResponse(
        id=str(project["_id"]),
        name=project["name"],
        description=project.get("description", ""),
        organization_id=project.get("organization_id"),
        created_by=project["created_by"],
        members=project.get("members", []),
        statuses=project.get("statuses", ["To Do", "In Progress", "Review", "Done"]),
        created_at=project["created_at"]
    )

@api_router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: str, project_data: ProjectUpdate, current_user: dict = Depends(get_current_user)):
    update_doc = {k: v for k, v in project_data.dict().items() if v is not None}
    
    if not update_doc:
        raise HTTPException(status_code=400, detail="No data to update")
    
    await db.projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": update_doc}
    )
    
    project = await db.projects.find_one({"_id": ObjectId(project_id)})
    
    return ProjectResponse(
        id=str(project["_id"]),
        name=project["name"],
        description=project.get("description", ""),
        organization_id=project.get("organization_id"),
        created_by=project["created_by"],
        members=project.get("members", []),
        statuses=project.get("statuses", ["To Do", "In Progress", "Review", "Done"]),
        created_at=project["created_at"]
    )

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.projects.delete_one({"_id": ObjectId(project_id), "created_by": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or unauthorized")
    
    # Delete all tasks in the project
    await db.tasks.delete_many({"project_id": project_id})
    
    return {"message": "Project deleted successfully"}

# ============== TASK ROUTES ==============

@api_router.post("/tasks", response_model=TaskResponse)
async def create_task(task_data: TaskCreate, current_user: dict = Depends(get_current_user)):
    # Get assignee name if assigned
    assignee_name = None
    if task_data.assignee_id:
        assignee = await db.users.find_one({"_id": ObjectId(task_data.assignee_id)})
        if assignee:
            assignee_name = assignee["name"]
    
    # Get project name if has project
    project_name = None
    if task_data.project_id:
        project = await db.projects.find_one({"_id": ObjectId(task_data.project_id)})
        if project:
            project_name = project["name"]
    
    now = datetime.utcnow()
    task_doc = {
        "title": task_data.title,
        "description": task_data.description or "",
        "priority": task_data.priority,
        "status": task_data.status,
        "due_date": task_data.due_date,
        "start_date": task_data.start_date,
        "assignee_id": task_data.assignee_id,
        "project_id": task_data.project_id,
        "tags": task_data.tags,
        "subtasks": [s.dict() for s in task_data.subtasks],
        "recurring": task_data.recurring,
        "created_by": current_user["id"],
        "created_at": now,
        "updated_at": now
    }
    
    result = await db.tasks.insert_one(task_doc)
    task_id = str(result.inserted_id)
    
    # Create activity
    await create_activity(task_id, current_user["id"], current_user["name"], "created", f"Task '{task_data.title}' created")
    
    # Create notification for assignee
    if task_data.assignee_id and task_data.assignee_id != current_user["id"]:
        await create_notification(
            task_data.assignee_id,
            "task_assigned",
            f"You've been assigned to task: {task_data.title}",
            task_id
        )
    
    return TaskResponse(
        id=task_id,
        title=task_doc["title"],
        description=task_doc["description"],
        priority=task_doc["priority"],
        status=task_doc["status"],
        due_date=task_doc["due_date"],
        start_date=task_doc["start_date"],
        assignee_id=task_doc["assignee_id"],
        assignee_name=assignee_name,
        project_id=task_doc["project_id"],
        project_name=project_name,
        tags=task_doc["tags"],
        subtasks=[SubTask(**s) for s in task_doc["subtasks"]],
        recurring=task_doc["recurring"],
        created_by=task_doc["created_by"],
        created_at=task_doc["created_at"],
        updated_at=task_doc["updated_at"]
    )

@api_router.get("/tasks", response_model=List[TaskResponse])
async def get_tasks(
    project_id: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assignee_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    query = {
        "$or": [
            {"created_by": current_user["id"]},
            {"assignee_id": current_user["id"]}
        ]
    }
    
    if project_id:
        query["project_id"] = project_id
    if status:
        query["status"] = status
    if priority:
        query["priority"] = priority
    if assignee_id:
        query["assignee_id"] = assignee_id
    
    tasks = await db.tasks.find(query).sort("created_at", -1).to_list(500)
    
    result = []
    for task in tasks:
        assignee_name = None
        if task.get("assignee_id"):
            try:
                assignee = await db.users.find_one({"_id": ObjectId(task["assignee_id"])})
                if assignee:
                    assignee_name = assignee["name"]
            except:
                pass
        
        project_name = None
        if task.get("project_id"):
            try:
                project = await db.projects.find_one({"_id": ObjectId(task["project_id"])})
                if project:
                    project_name = project["name"]
            except:
                pass
        
        result.append(TaskResponse(
            id=str(task["_id"]),
            title=task["title"],
            description=task.get("description", ""),
            priority=task["priority"],
            status=task["status"],
            due_date=task.get("due_date"),
            start_date=task.get("start_date"),
            assignee_id=task.get("assignee_id"),
            assignee_name=assignee_name,
            project_id=task.get("project_id"),
            project_name=project_name,
            tags=task.get("tags", []),
            subtasks=[SubTask(**s) for s in task.get("subtasks", [])],
            recurring=task.get("recurring"),
            created_by=task["created_by"],
            created_at=task["created_at"],
            updated_at=task.get("updated_at", task["created_at"])
        ))
    
    return result

@api_router.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str, current_user: dict = Depends(get_current_user)):
    task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    assignee_name = None
    if task.get("assignee_id"):
        try:
            assignee = await db.users.find_one({"_id": ObjectId(task["assignee_id"])})
            if assignee:
                assignee_name = assignee["name"]
        except:
            pass
    
    project_name = None
    if task.get("project_id"):
        try:
            project = await db.projects.find_one({"_id": ObjectId(task["project_id"])})
            if project:
                project_name = project["name"]
        except:
            pass
    
    return TaskResponse(
        id=str(task["_id"]),
        title=task["title"],
        description=task.get("description", ""),
        priority=task["priority"],
        status=task["status"],
        due_date=task.get("due_date"),
        start_date=task.get("start_date"),
        assignee_id=task.get("assignee_id"),
        assignee_name=assignee_name,
        project_id=task.get("project_id"),
        project_name=project_name,
        tags=task.get("tags", []),
        subtasks=[SubTask(**s) for s in task.get("subtasks", [])],
        recurring=task.get("recurring"),
        created_by=task["created_by"],
        created_at=task["created_at"],
        updated_at=task.get("updated_at", task["created_at"])
    )

@api_router.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, task_data: TaskUpdate, current_user: dict = Depends(get_current_user)):
    old_task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    if not old_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_doc = {k: v for k, v in task_data.dict().items() if v is not None}
    
    if "subtasks" in update_doc:
        update_doc["subtasks"] = [s.dict() if hasattr(s, 'dict') else s for s in update_doc["subtasks"]]
    
    update_doc["updated_at"] = datetime.utcnow()
    
    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": update_doc}
    )
    
    # Create activity for status change
    if task_data.status and task_data.status != old_task.get("status"):
        await create_activity(
            task_id, current_user["id"], current_user["name"],
            "status_changed",
            f"Status changed from '{old_task.get('status')}' to '{task_data.status}'"
        )
    
    # Create notification for new assignee
    if task_data.assignee_id and task_data.assignee_id != old_task.get("assignee_id") and task_data.assignee_id != current_user["id"]:
        await create_notification(
            task_data.assignee_id,
            "task_assigned",
            f"You've been assigned to task: {old_task['title']}",
            task_id
        )
    
    return await get_task(task_id, current_user)

@api_router.delete("/tasks/{task_id}")
async def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.tasks.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Delete comments and activities
    await db.comments.delete_many({"task_id": task_id})
    await db.activities.delete_many({"task_id": task_id})
    
    return {"message": "Task deleted successfully"}

# ============== COMMENT ROUTES ==============

@api_router.post("/comments", response_model=CommentResponse)
async def create_comment(comment_data: CommentCreate, current_user: dict = Depends(get_current_user)):
    comment_doc = {
        "content": comment_data.content,
        "task_id": comment_data.task_id,
        "user_id": current_user["id"],
        "user_name": current_user["name"],
        "created_at": datetime.utcnow()
    }
    
    result = await db.comments.insert_one(comment_doc)
    
    # Create activity
    await create_activity(
        comment_data.task_id,
        current_user["id"],
        current_user["name"],
        "commented",
        f"Added a comment"
    )
    
    # Get task to notify owner/assignee
    task = await db.tasks.find_one({"_id": ObjectId(comment_data.task_id)})
    if task:
        # Notify task owner if not the commenter
        if task["created_by"] != current_user["id"]:
            await create_notification(
                task["created_by"],
                "task_updated",
                f"{current_user['name']} commented on task: {task['title']}",
                comment_data.task_id
            )
        # Notify assignee if different from owner and commenter
        if task.get("assignee_id") and task["assignee_id"] != current_user["id"] and task["assignee_id"] != task["created_by"]:
            await create_notification(
                task["assignee_id"],
                "task_updated",
                f"{current_user['name']} commented on task: {task['title']}",
                comment_data.task_id
            )
    
    return CommentResponse(
        id=str(result.inserted_id),
        content=comment_doc["content"],
        task_id=comment_doc["task_id"],
        user_id=comment_doc["user_id"],
        user_name=comment_doc["user_name"],
        created_at=comment_doc["created_at"]
    )

@api_router.get("/comments/{task_id}", response_model=List[CommentResponse])
async def get_comments(task_id: str, current_user: dict = Depends(get_current_user)):
    comments = await db.comments.find({"task_id": task_id}).sort("created_at", 1).to_list(100)
    
    return [
        CommentResponse(
            id=str(c["_id"]),
            content=c["content"],
            task_id=c["task_id"],
            user_id=c["user_id"],
            user_name=c["user_name"],
            created_at=c["created_at"]
        )
        for c in comments
    ]

# ============== ACTIVITY ROUTES ==============

@api_router.get("/activities/{task_id}", response_model=List[ActivityResponse])
async def get_activities(task_id: str, current_user: dict = Depends(get_current_user)):
    activities = await db.activities.find({"task_id": task_id}).sort("created_at", -1).to_list(50)
    
    return [
        ActivityResponse(
            id=str(a["_id"]),
            task_id=a["task_id"],
            user_id=a["user_id"],
            user_name=a["user_name"],
            action=a["action"],
            details=a.get("details"),
            created_at=a["created_at"]
        )
        for a in activities
    ]

# ============== NOTIFICATION ROUTES ==============

@api_router.get("/notifications", response_model=List[NotificationResponse])
async def get_notifications(current_user: dict = Depends(get_current_user)):
    notifications = await db.notifications.find(
        {"user_id": current_user["id"]}
    ).sort("created_at", -1).to_list(50)
    
    return [
        NotificationResponse(
            id=str(n["_id"]),
            user_id=n["user_id"],
            type=n["type"],
            message=n["message"],
            task_id=n.get("task_id"),
            read=n.get("read", False),
            created_at=n["created_at"]
        )
        for n in notifications
    ]

@api_router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, current_user: dict = Depends(get_current_user)):
    await db.notifications.update_one(
        {"_id": ObjectId(notification_id), "user_id": current_user["id"]},
        {"$set": {"read": True}}
    )
    return {"message": "Notification marked as read"}

@api_router.put("/notifications/read-all")
async def mark_all_notifications_read(current_user: dict = Depends(get_current_user)):
    await db.notifications.update_many(
        {"user_id": current_user["id"]},
        {"$set": {"read": True}}
    )
    return {"message": "All notifications marked as read"}

@api_router.get("/notifications/unread-count")
async def get_unread_count(current_user: dict = Depends(get_current_user)):
    count = await db.notifications.count_documents({"user_id": current_user["id"], "read": False})
    return {"count": count}

# ============== DASHBOARD ROUTES ==============

@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    query = {
        "$or": [
            {"created_by": current_user["id"]},
            {"assignee_id": current_user["id"]}
        ]
    }
    
    tasks = await db.tasks.find(query).to_list(1000)
    
    total_tasks = len(tasks)
    completed_tasks = len([t for t in tasks if t["status"] == "Done"])
    in_progress_tasks = len([t for t in tasks if t["status"] == "In Progress"])
    
    now = datetime.utcnow()
    overdue_tasks = len([
        t for t in tasks 
        if t.get("due_date") and t["due_date"] < now and t["status"] != "Done"
    ])
    
    # Tasks by status
    tasks_by_status = {}
    for task in tasks:
        status = task["status"]
        tasks_by_status[status] = tasks_by_status.get(status, 0) + 1
    
    # Tasks by priority
    tasks_by_priority = {}
    for task in tasks:
        priority = task["priority"]
        tasks_by_priority[priority] = tasks_by_priority.get(priority, 0) + 1
    
    return DashboardStats(
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        overdue_tasks=overdue_tasks,
        in_progress_tasks=in_progress_tasks,
        tasks_by_status=tasks_by_status,
        tasks_by_priority=tasks_by_priority
    )

# ============== USER ROUTES ==============

@api_router.get("/users", response_model=List[UserResponse])
async def get_users(current_user: dict = Depends(get_current_user)):
    """Get all users (for task assignment)"""
    users = await db.users.find().to_list(100)
    return [
        UserResponse(
            id=str(u["_id"]),
            email=u["email"],
            name=u["name"],
            role=u.get("role", "member"),
            organization_id=u.get("organization_id"),
            created_at=u["created_at"]
        )
        for u in users
    ]

@api_router.put("/users/profile")
async def update_profile(name: str, current_user: dict = Depends(get_current_user)):
    await db.users.update_one(
        {"_id": ObjectId(current_user["id"])},
        {"$set": {"name": name}}
    )
    return {"message": "Profile updated successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
