from project.retrieval.retriever import Retriever
from project.retrieval.reranker import Reranker


class LogicReasoner:
    def __init__(self):
        self.retriever = Retriever()
        self.reranker = Reranker()

    def get_candidates(self, query, top_k=5):
        candidates = self.retriever.search(
            query,
            top_k=top_k
        )

        return self.reranker.rerank(
            query,
            candidates,
            top_k=top_k
        )

    def build_context(self, candidates):
        context = []

        for i, candidate in enumerate(candidates, start=1):
            metadata = candidate["metadata"]

            context.append(
                f"""
Candidate {i}
Application: {metadata["app_name"]}
Module: {metadata["module"]}
Symbol: {metadata["symbol_name"]}
Type: {metadata["unit_type"]}
File: {metadata["file_path"]}
Score: {candidate["final_score"]:.3f}

Code:
{candidate["document"]}
""".strip()
            )

        return "\n\n---\n\n".join(context)