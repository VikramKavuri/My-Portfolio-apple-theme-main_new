import os
import logging
from typing import List
from openai import OpenAI

logger = logging.getLogger(__name__)

# Initialize OpenRouter client
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    default_headers={
        "HTTP-Referer": os.getenv("APP_URL", "http://localhost:3000"),
        "X-Title": os.getenv("APP_NAME", "Vikram Portfolio Matcher"),
    },
)

# Use a reliable model - fallback to free tier if needed
MODEL = os.getenv("GENERATION_MODEL", "meta-llama/llama-3.1-8b-instruct:free")

def reasons_reply(jd_text: str, top_keywords: List[str], retrieved_snippets: List[str]) -> str:
    """
    Generate reasons why the candidate is a good fit based on JD and resume snippets
    
    Args:
        jd_text: The job description text
        top_keywords: Top keywords extracted from JD
        retrieved_snippets: Relevant resume chunks
        
    Returns:
        Formatted string with reasons and skill matches
    """
    try:
        # Prepare context from resume snippets
        resume_context = "\n---\n".join(retrieved_snippets) if retrieved_snippets else "No specific resume content available"
        
        system_prompt = (
            "You are a professional career advisor helping to articulate why a candidate is an excellent fit for a role. "
            "Tone: Professional, confident, and enthusiastic (98% professional, 2% warm). "
            "CRITICAL: Base your response ONLY on the resume evidence provided. Never fabricate skills or experiences. "
            "If a skill is mentioned in the job description but not found in the resume, acknowledge it honestly. "
            "\n\nOutput format:\n"
            "1) A heading: '### Why I'm a Strong Fit'\n"
            "2) 5-7 bullet points (each 1-2 sentences) explaining the fit, with specific examples from resume\n"
            "3) A heading: '### Top Matching Skills & Experience'\n"
            "4) A bullet list covering the top keywords, each showing WHERE and HOW the skill was used (with resume evidence)\n"
            "   Format: '• **[Skill]**: [1-2 sentence description of usage with specific context]'\n"
            "   If a skill is not found in resume, write: '• **[Skill]**: Not explicitly mentioned in resume'\n"
        )
        
        user_prompt = (
            f"**Job Description:**\n{jd_text}\n\n"
            f"**Key Skills/Keywords from JD:**\n{', '.join(top_keywords)}\n\n"
            f"**Resume Evidence (relevant excerpts):**\n{resume_context}\n\n"
            "Based on the above, generate a compelling match summary."
        )
        
        logger.info(f"Calling LLM with model: {MODEL}")
        
        response = client.chat.completions.create(
            model=MODEL,
            temperature=0.3,  # Slightly higher for more natural language
            max_tokens=1500,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
        )
        
        result = response.choices[0].message.content.strip()
        logger.info(f"LLM response generated successfully ({len(result)} chars)")
        return result
        
    except Exception as e:
        logger.error(f"Error in reasons_reply: {str(e)}", exc_info=True)
        
        # Fallback response if LLM fails
        fallback = (
            "### Why I'm a Strong Fit\n\n"
            "• Strong technical background with relevant experience in the field\n"
            "• Demonstrated expertise in key technologies mentioned in the job description\n"
            "• Track record of delivering results in similar roles\n"
            "• Proven ability to work with cross-functional teams\n"
            "• Continuous learner with up-to-date skills\n\n"
            "### Top Matching Skills & Experience\n\n"
        )
        
        for kw in top_keywords[:10]:
            fallback += f"• **{kw}**: Relevant experience available in resume\n"
        
        fallback += f"\n\n_Note: Detailed analysis temporarily unavailable. Error: {str(e)}_"
        return fallback