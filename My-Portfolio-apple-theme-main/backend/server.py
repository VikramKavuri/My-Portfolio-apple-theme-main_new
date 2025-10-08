import os
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from typing import Dict, Any, List

from rag_service import RES_INDEXES, top_keywords, score_against_resume, embed_single
from gen import reasons_reply  # your existing LLM reasons generator

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://my-portfolio-apple-theme-mainnew.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchRequest(BaseModel):
    job_description: str

class MatchResponse(BaseModel):
    top_keywords: List[str]
    results: Dict[str, Any]

@app.get("/healthz")
def health():
    return {"ok": True}

@app.post("/match", response_model=MatchResponse)
def match(req: MatchRequest):
    jd = (req.job_description or "").strip()
    if not jd:
        return {"top_keywords": [], "results": {}}

    jd_vec = embed_single(jd)
    keywords = top_keywords(jd, n=10)

    results = {}
    for idx in RES_INDEXES:
        score, top_pairs = score_against_resume(jd_vec, idx, top_k=6)
        retrieved = [c for (c, s) in top_pairs][:6]
        reasons = reasons_reply(jd, keywords, retrieved)
        results[idx.name] = {"score": round(score, 1), "reasons": reasons}

    return {"top_keywords": keywords, "results": results}
