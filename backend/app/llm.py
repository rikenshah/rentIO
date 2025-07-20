import openai
import os


def get_llm_response(scenario, question):
    """Call the OpenAI API to answer the user's question."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return "OpenAI API key not set."

    openai.api_key = api_key
    prompt = f"""
    You are a financial advisor. Here is a real estate vs. stock scenario:
    Scenario: {scenario}
    User question: {question}
    Please provide a clear, concise answer with reasoning.
    """
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message["content"]
