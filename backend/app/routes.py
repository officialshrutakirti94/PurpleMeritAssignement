from fastapi import APIRouter,HTTPException,Depends,status
from .schemas import userResponse,UserSignIn,UserSignUp,UserUpdate,PasswordChange
from .models import User
from sqlalchemy.orm import Session
from .auth import hashPassword,verifyHashPassword,get_current_user,create_access_token,admin_required
from datetime import datetime,timezone
from .database import get_db

router=APIRouter()

## REGISTER ROUTER

@router.post("/registration",response_model=userResponse)
def registration(data:UserSignUp,db:Session=Depends(get_db)):
    user=db.query(User).filter(User.email==data.email).first()
    if user:
        raise HTTPException(status_code=status.HTTP_208_ALREADY_REPORTED,detail="Email Exists")
    
    user=User(
        full_name=data.full_name,
        email=data.email,
        password=hashPassword(data.password),
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

## LOGIN ROUTER
@router.post("/login")
def login(data: UserSignIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not available")

    if not verifyHashPassword(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access"
        )

    user.last_login = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }




#-------------->USER
@router.get("/me",response_model=userResponse)
def get_me(current:User=Depends(get_current_user)):
    return current


##------------>Update User
@router.put("/update",response_model=userResponse)
def update_user(data:UserUpdate,
                db:Session=Depends(get_db),
                user:User=Depends(get_current_user),
                ):
    if data.full_name:
        user.full_name=data.full_name
    
    if data.email:
        user.email=data.email

    db.commit()
    db.refresh(user)
    return user

@router.put("/updatePass")
def update_pass(passw:PasswordChange,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    newHashedPass=hashPassword(passw.new_password)
    if not verifyHashPassword(passw.old_password,user.password):
        raise HTTPException(status=404 , detail="Wrong Password")
    user.password=newHashedPass
    db.commit()
    db.refresh(user)
    return {"success":200}


@router.get("/admin/users", response_model=list[userResponse])
def list_users(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    _: User = Depends(admin_required)
):
    offset = (page - 1) * limit
    users = db.query(User).offset(offset).limit(limit).all()
    return users


@router.put("/admin/users/{user_id}/activate")
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(admin_required)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = True
    db.commit()
    return {"message": "User activated"}


@router.put("/admin/users/{user_id}/deactivate")
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(admin_required)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = False
    db.commit()
    return {"message": "User deactivated"}





    



