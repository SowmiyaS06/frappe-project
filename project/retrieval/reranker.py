import re


UNIT_TYPE_WEIGHTS = {
    "function": 1.0,
    "method": 1.0,
    "api_endpoint": 1.0,
    "class": 0.7,
    "js_handler": 0.6,
    "doctype": 0.5,
}


class Reranker:
    def rerank(self, query, candidates, top_k=5):
        query_words = set(
            re.findall(r"\b[a-zA-Z_]+\b", query.lower())
        )

        scored_candidates = []

        for candidate in candidates:
            document = candidate["document"].lower()
            unit_type = candidate["metadata"]["unit_type"]

            vector_score = 1 / (1 + candidate["distance"])

            keyword_matches = sum(
                1
                for word in query_words
                if word in document
            )

            keyword_score = (
                keyword_matches / max(len(query_words), 1)
            )

            unit_type_score = UNIT_TYPE_WEIGHTS.get(
                unit_type,
                0.5
            )

            final_score = (
                0.6 * vector_score
                + 0.2 * keyword_score
                + 0.2 * unit_type_score
            )

            scored_candidates.append({
                **candidate,
                "vector_score": vector_score,
                "keyword_score": keyword_score,
                "unit_type_score": unit_type_score,
                "final_score": final_score,
            })

        scored_candidates.sort(
            key=lambda x: x["final_score"],
            reverse=True
        )

        return scored_candidates[:top_k]