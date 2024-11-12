from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional
import sqlite3
import random
import requests
app = FastAPI(
    docs_url='/',
    openapi_tags=[
        {"name": "Authentication", "description": ""},
        {"name": "User", "description": ""},
        {"name": "AI Generation", "description": ""},
        {"name": "Content Management", "description": ""},
    ]
)

# Cấu hình CORS để Frontend có thể gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://diemquynh.fun"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cấu hình bảo mật
SECRET_KEY = "quynhngu"  # Trong thực tế nên lưu trong biến môi trường
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 3

# Mô hình dữ liệu
class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    email: str
    password: str

# Giả lập database user (trong thực tế nên dùng database thật)
fake_users_db = {
    "quynhhr.10@gmail.com": {
        "email": "quynhhr.10@gmail.com",
        "hashed_password": "$2b$12$4k4bMRApIpr.cbOSZjp3pewIQ4wkj7vhcVL5YrBDTpJdpNGhEhIXO"  # "password"
    },
    "admin@diemquynh.fun": {
        "email": "admin@diemquynh.fun",
        "hashed_password": "$2b$12$4k4bMRApIpr.cbOSZjp3pewIQ4wkj7vhcVL5YrBDTpJdpNGhEhIXO"  # "password"
    }
}

# Công cụ mã hóa password
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(email: str):
    if email in fake_users_db:
        return fake_users_db[email]
    return None

def authenticate_user(email: str, password: str):
    user = get_user(email)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        print(pwd_context.hash(password))
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/api/login", response_model=Token, tags=["Authentication"])
async def login(form_data: UserLogin):
    user = authenticate_user(form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = get_user(email)
    if user is None:
        raise credentials_exception
    return user

# Thêm endpoint mới để lấy thông tin user
@app.get("/api/user/me", tags=["User"])
async def read_users_me(current_user = Depends(get_current_user)):
    return {
        "email": current_user["email"]
    }
    
    
def get_api_key_gemini():
    # lấy api key từ database
    conn = sqlite3.connect('./database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT api_key FROM api_keys WHERE expired = 0")
    api_key = cursor.fetchone()
    conn.close()
    return random.choice(api_key)

class GeminiRequest(BaseModel):
    user_prompt: str
    system_prompt: str = "Bạn là một chuyên gia trong việc tạo nội dung đăng tuyển việc làm"
    model: str = "gemini-pro"
    temperature: float = 0.8
    topK: int = 50
    topP: float = 0.97
    maxOutputTokens: int = 4096
    
def call_gemini_api(api_key, system_prompt, user_prompt, model, temperature, topK , topP, maxOutputTokens):
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        headers = {
            "Content-Type": "application/json"
        }

        data = {
            "contents": [{
                "parts": [{
                    "text": system_prompt + "\n" + user_prompt
                }]
            }],
            "generationConfig": {
                "temperature": temperature,
                "topK": topK,
                "topP": topP,
                "maxOutputTokens": maxOutputTokens,
            }
        }
        
        response = requests.post(
            f"{url}?key={api_key}",
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['candidates'][0]['content']['parts'][0]['text']
        else:
            return f"Error: HTTP {response.status_code} - {response.text}"
            
    except Exception as e:
        return f"Error: {str(e)}"
    
@app.post("/gemini-api", tags=["AI Generation"])
def gemini_api_endpoint(request: GeminiRequest, current_user = Depends(get_current_user)):
    api_key = get_api_key_gemini()
    if not api_key:
        raise HTTPException(status_code=400, detail="No API keys available")
    
    response = call_gemini_api(
            api_key,
            system_prompt=request.system_prompt,
            user_prompt=request.user_prompt,
            model=request.model,
            temperature=request.temperature,
            topK=request.topK,
            topP=request.topP,
            maxOutputTokens=request.maxOutputTokens
        )
    # Kiểm tra nếu response bắt đầu bằng "Error:"
    if isinstance(response, str) and response.startswith("Error:"):
        return {"status": "error", "message": response}
    result = {"status": "success", "response": response}
    return result

# Thêm model mới
class SavedContent(BaseModel):
    title: str
    content: str
    user_email: str

# Thêm các endpoint mới
@app.post("/api/contents/save", tags=["Content Management"])
async def save_content(content: SavedContent, current_user = Depends(get_current_user)):
    try:
        conn = sqlite3.connect('./database.db')
        cursor = conn.cursor()
        
        # Tạo bảng nếu chưa tồn tại
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS saved_contents
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
         title TEXT,
         content TEXT,
         user_email TEXT,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
        ''')
        
        cursor.execute(
            "INSERT INTO saved_contents (title, content, user_email) VALUES (?, ?, ?)",
            (content.title, content.content, current_user["email"])
        )
        
        conn.commit()
        conn.close()
        
        return {"status": "success", "message": "Đã lưu nội dung thành công"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/contents/list", tags=["Content Management"])
async def get_saved_contents(current_user = Depends(get_current_user)):
    try:
        conn = sqlite3.connect('./database.db')
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT id, title, content, created_at FROM saved_contents WHERE user_email = ? ORDER BY created_at DESC",
            (current_user["email"],)
        )
        
        contents = cursor.fetchall()
        conn.close()
        
        return {
            "status": "success",
            "contents": [
                {
                    "id": row[0],
                    "title": row[1],
                    "content": row[2],
                    "created_at": row[3]
                }
                for row in contents
            ]
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.delete("/api/contents/{content_id}", tags=["Content Management"])
async def delete_content(content_id: int, current_user = Depends(get_current_user)):
    try:
        conn = sqlite3.connect('./database.db')
        cursor = conn.cursor()
        
        cursor.execute(
            "DELETE FROM saved_contents WHERE id = ? AND user_email = ?",
            (content_id, current_user["email"])
        )
        
        conn.commit()
        conn.close()
        
        return {"status": "success", "message": "Đã xóa nội dung thành công"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
