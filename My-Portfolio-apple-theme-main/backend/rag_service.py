import os
import numpy as np
import logging
from pathlib import Path
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from openai import OpenAI

logger = logging.getLogger(__name__)

ROOT = Path(__file__).parent
RES_DIR = ROOT / "resumes"

# --- OpenRouter via OpenAI SDK for embeddings ---
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    default_headers={
        "HTTP-Referer": os.getenv("APP_URL", "http://localhost:3000"),
        "X-Title": os.getenv("APP_NAME", "Vikram Portfolio Matcher"),
    },
)

EMBED_MODEL = os.getenv("EMBEDDING_MODEL", "openai/text-embedding-3-small")

def embed(texts: List[str]) -> np.ndarray:
    """
    Embed a list of texts using OpenRouter embedding model
    
    Args:
        texts: List of text strings to embed
        
    Returns:
        Normalized embedding vectors as numpy array
    """
    try:
        if not texts:
            logger.warning("Empty text list provided to embed()")
            return np.zeros((0, 1536), dtype=np.float32)
        
        logger.info(f"Embedding {len(texts)} text chunks with model {EMBED_MODEL}")
        
        response = client.embeddings.create(
            model=EMBED_MODEL,
            input=texts
        )
        
        # Extract embeddings
        arr = np.array([d.embedding for d in response.data], dtype=np.float32)
        
        # L2 normalize
        norms = np.linalg.norm(arr, axis=1, keepdims=True) + 1e-9
        normalized = arr / norms
        
        logger.info(f"Successfully embedded texts. Shape: {normalized.shape}")
        return normalized
        
    except Exception as e:
        logger.error(f"Error in embed(): {str(e)}", exc_info=True)
        # Return zero vectors as fallback
        embedding_dim = 1536  # Standard for text-embedding-3-small
        return np.zeros((len(texts), embedding_dim), dtype=np.float32)

def chunk_text(txt: str, max_chars: int = 1200, overlap: int = 150) -> List[str]:
    """
    Split text into overlapping chunks
    
    Args:
        txt: Input text to chunk
        max_chars: Maximum characters per chunk
        overlap: Overlap between consecutive chunks
        
    Returns:
        List of text chunks
    """
    if not txt or not txt.strip():
        return []
    
    chunks = []
    start = 0
    
    while start < len(txt):
        end = min(len(txt), start + max_chars)
        chunk = txt[start:end].strip()
        
        if chunk:  # Only add non-empty chunks
            chunks.append(chunk)
        
        # Move to next chunk with overlap
        start = end - overlap
        if start <= 0 or start >= len(txt):
            break
    
    return chunks

def _load_resumes() -> Dict[str, str]:
    """
    Load all resume files from the resumes directory
    
    Returns:
        Dictionary mapping resume names to their text content
    """
    docs = {}
    
    if not RES_DIR.exists():
        logger.error(f"Resume directory not found: {RES_DIR}")
        return docs
    
    resume_files = sorted(RES_DIR.glob("resume_*.txt"))
    
    if not resume_files:
        logger.warning(f"No resume files found in {RES_DIR}")
        return docs
    
    for p in resume_files:
        try:
            content = p.read_text(encoding="utf-8", errors="ignore")
            if content.strip():
                docs[p.stem] = content
                logger.info(f"Loaded resume: {p.stem} ({len(content)} chars)")
            else:
                logger.warning(f"Empty resume file: {p.stem}")
        except Exception as e:
            logger.error(f"Error loading {p.stem}: {str(e)}")
    
    logger.info(f"Total resumes loaded: {len(docs)}")
    return docs

class ResumeIndex:
    """
    Stores a resume's text chunks and their embeddings for similarity search
    """
    def __init__(self, name: str, text: str):
        self.name = name
        self.chunks = chunk_text(text)
        
        if self.chunks:
            try:
                self.embeds = embed(self.chunks)
            except Exception as e:
                logger.error(f"Failed to embed resume {name}: {str(e)}")
                embedding_dim = 1536
                self.embeds = np.zeros((len(self.chunks), embedding_dim), dtype=np.float32)
        else:
            self.embeds = np.zeros((0, 1536), dtype=np.float32)
        
        logger.info(f"ResumeIndex created for {name}: {len(self.chunks)} chunks, {self.embeds.shape} embeddings")

# Load resumes on module import
RESUMES = _load_resumes()
RES_INDEXES = [ResumeIndex(name, txt) for name, txt in RESUMES.items()]

def top_keywords(jd_text: str, n: int = 10) -> List[str]:
    """
    Extract top N keywords from job description using TF-IDF
    
    Args:
        jd_text: Job description text
        n: Number of top keywords to extract
        
    Returns:
        List of top keywords
    """
    try:
        if not jd_text or not jd_text.strip():
            return []
        
        vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),  # Unigrams and bigrams
            max_features=5000,
            min_df=1
        )
        
        X = vectorizer.fit_transform([jd_text])
        tfidf_scores = X.toarray()[0]
        feature_names = np.array(vectorizer.get_feature_names_out())
        
        # Get top N by TF-IDF score
        top_indices = tfidf_scores.argsort()[::-1][:n]
        keywords = feature_names[top_indices].tolist()
        
        logger.info(f"Extracted {len(keywords)} keywords from JD")
        return keywords
        
    except Exception as e:
        logger.error(f"Error extracting keywords: {str(e)}")
        return []

def score_against_resume(jd_vec: np.ndarray, idx: ResumeIndex, top_k: int = 6) -> Tuple[float, List[Tuple[str, float]]]:
    """
    Score a resume against a job description vector using cosine similarity
    
    Args:
        jd_vec: Embedded job description vector
        idx: ResumeIndex to score against
        top_k: Number of top chunks to return
        
    Returns:
        Tuple of (average_score, list of (chunk, similarity) pairs)
    """
    try:
        if idx.embeds.shape[0] == 0:
            logger.warning(f"No embeddings available for resume {idx.name}")
            return 0.0, []
        
        # Compute cosine similarities (vectors are already normalized)
        similarities = np.dot(idx.embeds, jd_vec)
        
        # Get top K chunks
        top_indices = similarities.argsort()[::-1][:top_k]
        top_chunks_with_scores = [
            (idx.chunks[i], float(similarities[i]))
            for i in top_indices
        ]
        
        # Average score of top K chunks, scaled to 0-100
        avg_score = float(np.mean(similarities[top_indices]) * 100.0)
        
        logger.info(f"Resume {idx.name} scored {avg_score:.1f}")
        return avg_score, top_chunks_with_scores
        
    except Exception as e:
        logger.error(f"Error scoring resume {idx.name}: {str(e)}")
        return 0.0, []

def embed_single(text: str) -> np.ndarray:
    """
    Embed a single text string
    
    Args:
        text: Text to embed
        
    Returns:
        Normalized embedding vector
    """
    if not text or not text.strip():
        logger.warning("Empty text provided to embed_single()")
        return np.zeros(1536, dtype=np.float32)
    
    result = embed([text])
    return result[0] if result.shape[0] > 0 else np.zeros(1536, dtype=np.float32)