from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="AI Service - HRMS",
    description="AI-powered HR and Recruitment Management Service",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Service is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-service"}

# AI endpoints will be added here
@app.post("/ai/candidate-summary")
async def candidate_summary():
    return {"message": "AI candidate summary endpoint - ready for implementation"}

@app.post("/ai/match")
async def candidate_match():
    return {"message": "AI candidate matching endpoint - ready for implementation"}

@app.post("/ai/interview-feedback")
async def interview_feedback():
    return {"message": "AI interview feedback endpoint - ready for implementation"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
