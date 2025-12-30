from fastapi import FastAPI,HTTPException
from .database import engine
from .models import Base
from .routes import router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="User Management API")
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    raise HTTPException(status_code=404,detail=f"Error:{e}")
app.include_router(router)

@app.get("/")
def root():
    return {"message": "API running"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
