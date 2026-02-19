from qdrant_client import QdrantClient

# Connect to Qdrant
client = QdrantClient(host="localhost", port=6333)

# Get all points
results = client.scroll(
    collection_name="retail_docs",
    limit=10,
    with_payload=True,
    with_vectors=False
)

points, _ = results

print(f"Found {len(points)} points in collection\n")

for i, point in enumerate(points):
    print(f"Point {i+1}:")
    print(f"  ID: {point.id}")
    print(f"  Filename: {point.payload.get('filename', 'N/A')}")
    print(f"  Asset Category: {point.payload.get('asset_category', 'N/A')}")
    print(f"  File Hash: {point.payload.get('file_hash', 'N/A')}")
    print(f"  Text Preview: {point.payload.get('text', '')[:100]}...")
    print()
