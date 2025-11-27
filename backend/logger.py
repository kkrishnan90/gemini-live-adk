import asyncio
import time

# Global queue for logs
log_queue = asyncio.Queue()

def log_tool_start(tool_name, args):
    try:
        log_queue.put_nowait({
            "type": "subagent_start",
            "agent": tool_name,
            "args": args,
            "timestamp": time.time()
        })
    except Exception:
        pass

def log_tool_complete(tool_name, result, duration):
    try:
        log_queue.put_nowait({
            "type": "subagent_complete",
            "agent": tool_name,
            "result": result,
            "duration": duration,
            "timestamp": time.time()
        })
    except Exception:
        pass