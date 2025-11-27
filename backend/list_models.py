from google import genai
from dotenv import load_dotenv
import os

load_dotenv("backend/.env")

client = genai.Client(
    vertexai=True,
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location="us-central1"
)

print(f"Listing models in {os.getenv('GOOGLE_CLOUD_LOCATION', 'us-central1')}...")
try:
    for model in client.models.list():
        print(model.name)
except Exception as e:
    print(f"Error listing models: {e}")
