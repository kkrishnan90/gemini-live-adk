from google.genai import types
from google.adk.agents.run_config import RunConfig
import inspect

print(f"types.Modality: {types.Modality}")
try:
    print(f"types.Modality.AUDIO: {types.Modality.AUDIO}")
    print(f"Type of types.Modality.AUDIO: {type(types.Modality.AUDIO)}")
except AttributeError:
    print("types.Modality.AUDIO does not exist")

print("\nRunConfig annotations:")
print(RunConfig.__annotations__)

try:
    rc = RunConfig(response_modalities=[types.Modality.AUDIO])
    print("\nRunConfig with Enum created successfully")
    print(rc)
except Exception as e:
    print(f"\nError creating RunConfig with Enum: {e}")

try:
    rc = RunConfig(response_modalities=["AUDIO"])
    print("\nRunConfig with String created successfully")
    print(rc)
except Exception as e:
    print(f"\nError creating RunConfig with String: {e}")
