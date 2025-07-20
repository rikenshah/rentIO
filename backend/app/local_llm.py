"""Utilities for interacting with a local CPU-based language model."""

from pathlib import Path
from functools import lru_cache
from typing import Optional

from huggingface_hub import hf_hub_download
from llama_cpp import Llama


MODEL_REPO = "TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF"
MODEL_FILE = "tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"


def download_model(model_dir: Path) -> Path:
    """Download the GGUF model if it's not already present."""
    model_dir.mkdir(parents=True, exist_ok=True)
    model_path = model_dir / MODEL_FILE
    if not model_path.exists():
        hf_hub_download(repo_id=MODEL_REPO, filename=MODEL_FILE, local_dir=model_dir, local_dir_use_symlinks=False)
    return model_path


class LocalLLM:
    """Simple wrapper around a llama-cpp model."""

    def __init__(self, model_path: Path, n_gpu_layers: int = 0, n_ctx: int = 2048):
        self.llm = Llama(model_path=str(model_path), n_gpu_layers=n_gpu_layers, n_ctx=n_ctx)

    def generate(self, prompt: str, max_tokens: int = 256) -> str:
        result = self.llm(prompt, max_tokens=max_tokens, stop=["</s>"])
        return result["choices"][0]["text"].strip()


@lru_cache(maxsize=1)
def get_local_llm(model_dir: Optional[Path] = None) -> LocalLLM:
    model_dir = model_dir or Path("models")
    model_path = download_model(model_dir)
    return LocalLLM(model_path)


def get_local_llm_response(scenario, question: str) -> str:
    """Generate a response from the local model given the scenario."""
    prompt = (
        "You are a financial advisor. Here is a real estate vs. stock scenario:\n"
        f"Scenario: {scenario}\n"
        f"Question: {question}\n"
        "Answer in a short paragraph."
    )
    llm = get_local_llm()
    return llm.generate(prompt)
