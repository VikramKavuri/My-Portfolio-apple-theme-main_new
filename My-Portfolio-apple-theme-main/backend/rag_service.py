import os, numpy as np
from pathlib import Path
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from openai import OpenAI

ROOT = Path(__file__).parent
RES_DIR = ROOT / "resumes"

# --- OpenRouter via OpenAI SDK ---
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url=os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"),
    default_headers={
        "HTTP-Referer": os.getenv("APP_URL", "http://localhost:3000"),
        "X-Title": os.getenv("APP_NAME", "Bhaskar Portfolio Matcher"),
    },
)
EMBED_MODEL = os.getenv("EMBEDDING_MODEL", "openai/text-embedding-3-small")

def embed(texts: List[str]) -> np.ndarray:
    # batched embedding call
    out = client.embeddings.create(model=EMBED_MODEL, input=texts)
    arr = np.array([d.embedding for d in out.data], dtype=np.float32)
    # L2 normalize
    norms = np.linalg.norm(arr, axis=1, keepdims=True) + 1e-9
    return arr / norms

def chunk_text(txt: str, max_chars: int = 1200, overlap: int = 150) -> List[str]:
    chunks, start = [], 0
    while start < len(txt):
        end = min(len(txt), start + max_chars)
        chunks.append(txt[start:end])
        start = end - overlap
        if start < 0:
            start = 0
        if start >= len(txt):
            break
    return chunks

def _load_resumes() -> Dict[str, str]:
    docs = {}
    for p in sorted(RES_DIR.glob("resume_*.txt")):
        docs[p.stem] = p.read_text(encoding="utf-8", errors="ignore")
    return docs

class ResumeIndex:
    def __init__(self, name: str, text: str):
        self.name = name
        self.chunks = chunk_text(text)
        self.embeds = embed(self.chunks) if self.chunks else np.zeros((0, 1536), dtype=np.float32)

RESUMES = _load_resumes()
RES_INDEXES = [ResumeIndex(name, txt) for name, txt in RESUMES.items()]

def top_keywords(jd_text: str, n: int = 10) -> List[str]:
    vec = TfidfVectorizer(stop_words="english", ngram_range=(1,2), max_features=5000)
    X = vec.fit_transform([jd_text])
    tfidf = X.toarray()[0]
    vocab = np.array(vec.get_feature_names_out())
    top_idx = tfidf.argsort()[::-1][:n]
    return vocab[top_idx].tolist()

def score_against_resume(jd_vec: np.ndarray, idx: ResumeIndex, top_k: int = 6):
    if idx.embeds.shape[0] == 0:
        return 0.0, []
    sims = np.dot(idx.embeds, jd_vec)         # cosine (all normalized)
    top_idx = sims.argsort()[::-1][:top_k]
    top_chunks = [idx.chunks[i] for i in top_idx]
    score = float(np.mean(sims[top_idx]) * 100.0)
    return score, list(zip(top_chunks, sims[top_idx].tolist()))

def embed_single(text: str) -> np.ndarray:
    v = embed([text])[0]
    return v
