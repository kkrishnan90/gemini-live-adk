from google.adk.agents import LlmAgent
from tools import consult_flight_specialist, consult_lifestyle_specialist
import config

# Define Root Agent (Nomad) with wrapper tools for Live API
nomad_agent = LlmAgent(
    name="Nomad",
    model=config.ORCHESTRATOR_MODEL,
    instruction=config.NOMAD_INSTRUCTION,
    tools=[consult_flight_specialist, consult_lifestyle_specialist]  # Wrapper tools for subagents
)