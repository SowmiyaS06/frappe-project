from project.embeddings.embedder import CodeEmbedder
from project.retrieval.vector_store import VectorStore


_embedder = CodeEmbedder()
_store = VectorStore()


class Retriever:
    def __init__(self):
        self.embedder = _embedder
        self.store = _store

    def search(self, query, top_k=5):
        query_embedding = self.embedder.embed_query(query)

        results = self.store.search(
            query_embedding,
            top_k=top_k,
        )

        candidates = []

        for i in range(len(results["ids"][0])):
            candidates.append({
                "id": results["ids"][0][i],
                "document": results["documents"][0][i],
                "metadata": results["metadatas"][0][i],
                "distance": results["distances"][0][i],
            })

        return candidates