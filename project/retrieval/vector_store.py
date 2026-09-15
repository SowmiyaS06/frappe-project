import chromadb


CHROMA_PATH = "/Users/poojashivakumar16/benches/ai-bench/chroma_db"


class VectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=CHROMA_PATH)

        self.collection = self.client.get_or_create_collection(
            name="code_units"
        )

    def add(self, ids, embeddings, documents, metadatas):
        self.collection.upsert(
        ids=ids,
        embeddings=embeddings,
        documents=documents,
        metadatas=metadatas,
    )

    def search(self, query_embedding, top_k=5):
        return self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
        )

    def count(self):
        return self.collection.count()