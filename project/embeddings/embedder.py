import torch
from sentence_transformers import SentenceTransformer


MODEL_NAME = "Qwen/Qwen3-Embedding-0.6B"


class CodeEmbedder:
    def __init__(self):
        if torch.backends.mps.is_available():
            self.device = "mps"
        else:
            self.device = "cpu"

        self.model = SentenceTransformer(
            MODEL_NAME,
            device=self.device,
        )

    def embed_texts(self, texts):
        return self.model.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=True,
        )

    def embed_query(self, query):
        return self.model.encode(
            query,
            normalize_embeddings=True,
        )