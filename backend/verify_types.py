from google.genai import types
try:
    print(f"types.SpeechConfig: {types.SpeechConfig}")
    print(f"types.VoiceConfig: {types.VoiceConfig}")
    print(f"types.PrebuiltVoiceConfig: {types.PrebuiltVoiceConfig}")
    print(f"types.AudioTranscriptionConfig dir: {dir(types.AudioTranscriptionConfig)}")
except AttributeError as e:
    print(f"Error: {e}")
