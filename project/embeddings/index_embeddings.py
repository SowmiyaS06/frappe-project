from project.embeddings.embedder import CodeEmbedder
from project.indexer.db import fetch_all
from project.retrieval.vector_store import VectorStore

DB_PATH = "/Users/poojashivakumar16/benches/ai-bench/code_index.sqlite3"
BATCH_SIZE = 32


def build_embedding_text(record):
    return f"""
Application: {record['app_name']}
Module: {record['module']}
DocType: {record['doctype']}
Symbol: {record['symbol_name']}
Type: {record['unit_type']}
Language: {record['language']}
Description: {record['docstring']}
Decorators: {record['decorators']}
Related DocTypes: {record['related_doctypes']}
Dependencies: {record['dependencies']}
Source Code:
{record['source_code']}
""".strip()


def index_all_records():
    records = fetch_all(DB_PATH)

    embedder = CodeEmbedder()
    store = VectorStore()

    for start in range(0, len(records), BATCH_SIZE):
        batch = records[start:start + BATCH_SIZE]

        documents = [
            build_embedding_text(record)
            for record in batch
        ]

        embeddings = embedder.embed_texts(documents)

        ids = [
            str(record["id"])
            for record in batch
        ]

        metadatas = [
            {
                "app_name": record["app_name"],
                "module": record["module"],
                "symbol_name": record["symbol_name"],
                "unit_type": record["unit_type"],
                "language": record["language"],
                "file_path": record["file_path"],
            }
            for record in batch
        ]

        store.add(
            ids=ids,
            embeddings=embeddings.tolist(),
            documents=documents,
            metadatas=metadatas,
        )

        print(
            f"Indexed {min(start + BATCH_SIZE, len(records))}/{len(records)}"
        )

    print(f"Finished. ChromaDB contains {store.count()} records.")


if __name__ == "__main__":
    index_all_records()