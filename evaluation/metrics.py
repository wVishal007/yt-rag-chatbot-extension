# evaluation/metrics.py

def precision_at_k(retrieved_docs, relevant_urls, k=3):
    retrieved_urls = [doc.metadata["url"] for doc in retrieved_docs[:k]]

    relevant_count = sum(
        1 for url in retrieved_urls if url in relevant_urls
    )

    return relevant_count / k


def recall_at_k(retrieved_docs, relevant_urls, k=3):
    retrieved_urls = [doc.metadata["url"] for doc in retrieved_docs[:k]]

    relevant_count = sum(
        1 for url in retrieved_urls if url in relevant_urls
    )

    return relevant_count / len(relevant_urls)