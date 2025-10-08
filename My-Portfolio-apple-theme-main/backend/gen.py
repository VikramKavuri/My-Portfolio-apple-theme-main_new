# backend/gen.py
import os
from typing import List
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url=os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1/chat/completions"),
    default_headers={
        "HTTP-Referer": os.getenv("APP_URL", "http://localhost:3000"),
        "X-Title": os.getenv("APP_NAME", "Vikram Portfolio"),
    },
)

MODEL = os.getenv("GENERATION_MODEL", "moonshotai/kimi-k2:free")

# MODEL = os.getenv("GENERATION_MODEL", "gpt-4o-mini")

def reasons_reply(jd_text: str, top_keywords: List[str], retrieved_snippets: List[str]) -> str:
    system = (
        "You are a concise, evidence-grounded writing assistant. "
        "Tone: 98% enthusiastic, engaging, with light, good-natured sarcasm. "
        "Never fabricate skills; ONLY use facts exposed in the provided resume snippets. "
        "Output exactly:\n"
        "1) A heading '5 Reasons I'm a Strong Fit'\n"
        "2) Five bullet points, each 1-2 sentences, human and vivid.\n"
        "3) A heading 'Top Matching Skills & Where I used them'\n"
        "4) A bullet list mapping the provided top keywords to concrete resume evidence; if evidence is missing, say 'not found in my resume'."
    )
    user = (
        f"Job Description:\n{jd_text}\n\n"
        f"Top Keywords to cover: {', '.join(top_keywords)}\n\n"
        "Resume Evidence (snippets):\n" + "\n---\n".join(retrieved_snippets)
    )
    resp = _client.chat.completions.create(
        model=MODEL,
        temperature=0.2,
        messages=[{"role":"system","content":system},{"role":"user","content":user}],
    )
    return resp.choices[0].message.content.strip()
