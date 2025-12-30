from pydantic import BaseModel,EmailStr
from typing import Optional
from datetime import datetime

class UserSignUp(BaseModel):
    full_name:str
    email:EmailStr
    password:str

class UserSignIn(BaseModel):
    email:EmailStr
    password:str

class userResponse(BaseModel):
    id:int
    full_name:str
    email:EmailStr
    role:str
    is_active:bool
    created_at:Optional[datetime]

    class config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str]
    email: Optional[EmailStr]

class PasswordChange(BaseModel):
    old_password: str
    new_password: str
    
