# backend/rag_service.py
import os, json, math
from pathlib import Path
from typing import List, Dict, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

ROOT = Path(__file__).parent
RES_DIR = ROOT / "resumes"

# ---- Load models once (fast warm) ----
EMBED_MODEL_NAME = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
_embedder = SentenceTransformer(EMBED_MODEL_NAME)

# ---- Load resumes (constant) ----
def _load_resumes() -> Dict[str, str]:
    docs = {}
    for p in sorted(RES_DIR.glob("resume_*.txt")):
        docs[p.stem] = p.read_text(encoding="utf-8", errors="ignore")
    return docs

_RESUMES = _load_resumes()

# ---- Chunking helper (simple, robust for resumes) ----
def chunk_text(txt: str, max_chars: int = 1200, overlap: int = 150) -> List[str]:
    chunks, start = [], 0
    while start < len(txt):
        end = min(len(txt), start + max_chars)
        chunks.append(txt[start:end])
        start = end - overlap
        if start < 0: start = 0
    return chunks

# ---- Precompute embeddings (per chunk) ----
class ResumeIndex:
    def __init__(self, name: str, text: str):
        self.name = name
        self.chunks = chunk_text(text)
        self.embeddings = _embedder.encode(self.chunks, convert_to_numpy=True, normalize_embeddings=True)

RES_INDEXES = [ResumeIndex(name, txt) for name, txt in _RESUMES.items()]

# ---- Simple scoring ----
def score_against_resume(jd_embed: np.ndarray, idx: ResumeIndex, top_k: int = 6):
    sims = np.dot(idx.embeddings, jd_embed)  # already normalized
    top_idx = sims.argsort()[::-1][:top_k]
    top_chunks = [idx.chunks[i] for i in top_idx]
    # Score: mean of top-k similarities → 0..1 → 0..100
    score = float(np.mean(sims[top_idx]) * 100.0)
    return score, list(zip(top_chunks, sims[top_idx].tolist()))

# ---- Keyword extraction (top 10) ----
def top_keywords(jd_text: str, n: int = 10) -> List[str]:
    vec = TfidfVectorizer(stop_words="english", ngram_range=(1,2), max_features=5000)
    X = vec.fit_transform([jd_text])
    tfidf = X.toarray()[0]
    vocab = np.array(vec.get_feature_names_out())
    top_idx = tfidf.argsort()[::-1][:n]
    return vocab[top_idx].tolist()
