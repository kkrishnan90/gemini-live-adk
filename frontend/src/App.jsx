import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Settings,
  Volume2,
  Zap,
  Bot,
  Clock,
  Activity,
  MessageSquare,
  Send,
} from "lucide-react";
import FlightCard from "./components/FlightCard";

// ActivityLog Component - Right Panel
const ActivityLog = ({
  ttfb,
  avgTtfb,
  activeTool,
  toolLatency,
  toolResult,
}) => {
  return (
    <div className="flex flex-col gap-4 h-full font-sans">
      <div className="flex items-center gap-2 px-1 mb-2 border-b border-white/10 pb-2">
        <Activity className="w-4 h-4 text-blue-400" />
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">
          System Activity
        </h3>
      </div>

      <div className="space-y-4 overflow-y-auto pr-2">
        {/* Card 1: Turn TTFB */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 shadow-lg hover:border-yellow-500/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">
                Turn TTFB in ms
              </p>
              <p className="text-xl font-mono font-medium text-gray-200">
                {ttfb ? `${(ttfb * 1000).toFixed(0)}ms` : "--"}
              </p>
            </div>
          </div>
        </div>

        {/* Card 1.5: Average TTFB */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 shadow-lg hover:border-orange-500/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">
                Average TTFB
              </p>
              <p className="text-xl font-mono font-medium text-gray-200">
                {avgTtfb ? `${(avgTtfb * 1000).toFixed(0)}ms` : "--"}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Active Tool/Subagent */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 shadow-lg hover:border-blue-500/30 transition-all duration-300 min-h-[120px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">
                Active Subagent
              </p>
              <p className="text-sm font-medium text-gray-200 truncate">
                {activeTool ? activeTool.agent : "Idle"}
              </p>
            </div>
          </div>

          {activeTool && activeTool.args ? (
            <div className="mt-2 text-[10px] font-mono bg-black/40 p-2.5 rounded-lg border border-white/5 text-gray-400 overflow-x-auto">
              {Object.entries(activeTool.args).map(([key, val]) => (
                <div key={key} className="flex gap-2 mb-1 last:mb-0">
                  <span className="text-purple-400 shrink-0">{key}:</span>
                  <span className="text-gray-300 break-all">{String(val)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-600 italic pl-12">
              Waiting for delegation...
            </div>
          )}
        </div>

        {/* Card 2.5: Subagent Result */}
        {toolResult && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 shadow-lg hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">
                  Subagent Response
                </p>
              </div>
            </div>
            <div className="text-[10px] font-mono bg-black/40 p-2.5 rounded-lg border border-white/5 text-gray-300 overflow-x-auto max-h-32 custom-scrollbar">
              {toolResult}
            </div>
          </div>
        )}

        {/* Card 3: Latency */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 shadow-lg hover:border-green-500/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">
                Subagent Execution Time
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-mono font-medium text-gray-200">
                  {toolLatency ? `${(toolLatency * 1000).toFixed(0)}ms` : "--"}
                </p>
                {activeTool && !toolLatency && (
                  <span className="text-[10px] text-blue-400 animate-pulse font-medium">
                    Processing...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [flightData, setFlightData] = useState(null);
  const [transcripts, setTranscripts] = useState([]); // Separate state for transcripts

  // Log State
  const [ttfb, setTtfb] = useState(null);
  const [avgTtfb, setAvgTtfb] = useState(null);
  const [ttfbHistory, setTtfbHistory] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [toolLatency, setToolLatency] = useState(null);
  const [toolResult, setToolResult] = useState(null);

  const [config, setConfig] = useState({
    voice_name: "Aoede",
    vad_settings: {
      silence_duration_ms: 1000,
      prefix_padding_ms: 300,
    },
    proactive_audio: true,
    affective_dialog: true,
    start_of_speech_sensitivity: "START_SENSITIVITY_LOW",
    end_of_speech_sensitivity: "END_SENSITIVITY_LOW",
  });

  const websocket = useRef(null);
  const audioContext = useRef(null);
  const processor = useRef(null);
  const source = useRef(null);
  const inputAnalyser = useRef(null);
  const outputAnalyser = useRef(null);
  const micButtonRef = useRef(null);
  const animationFrameRef = useRef(null);
  const chatContainerRef = useRef(null);

  const nextStartTime = useRef(0);
  const activeSources = useRef([]);
  const currentUserTranscript = useRef("");
  const currentAgentTranscript = useRef("");
  const audioIgnoreUntil = useRef(0);

  // Define refs for cleanup to avoid dependency cycles in useEffect
  const cleanupRef = useRef(() => {});

  const stopAudioPlayback = () => {
    activeSources.current.forEach((source) => {
      try {
        source.stop();
      } catch {
        // Ignore errors if source already stopped
      }
    });
    activeSources.current = [];
    // Reset next start time to now to avoid delay in next response
    if (audioContext.current) {
      nextStartTime.current = audioContext.current.currentTime;
    }
  };

  const resetTurnState = () => {
    setTtfb(null);
    setActiveTool(null);
    setToolLatency(null);
    stopAudioPlayback();
    // Ignore incoming audio for 500ms to clear the "tail" of the previous response
    audioIgnoreUntil.current = Date.now() + 500;
    // Reset current transcripts
    currentUserTranscript.current = "";
    currentAgentTranscript.current = "";
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [transcripts, flightData]);

  useEffect(() => {
    // Initialize Audio Context for playback
    audioContext.current = new (window.AudioContext ||
      window.webkitAudioContext)({ sampleRate: 24000 });

    // Initialize Analysers
    outputAnalyser.current = audioContext.current.createAnalyser();
    outputAnalyser.current.fftSize = 256;

    cleanupRef.current = () => {
      if (websocket.current) websocket.current.close();
      if (audioContext.current) audioContext.current.close();
      if (processor.current) {
        processor.current.disconnect();
        if (source.current) source.current.disconnect();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    return () => {
      cleanupRef.current();
    };
  }, []);

  // Visualizer Loop
  useEffect(() => {
    if (!isConnected) {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const updateVisuals = () => {
      if (!micButtonRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateVisuals);
        return;
      }

      let inputVolume = 0;
      let outputVolume = 0;

      if (inputAnalyser.current) {
        const inputData = new Uint8Array(
          inputAnalyser.current.frequencyBinCount
        );
        inputAnalyser.current.getByteFrequencyData(inputData);
        inputVolume = inputData.reduce((a, b) => a + b, 0) / inputData.length;
      }

      if (outputAnalyser.current) {
        const outputData = new Uint8Array(
          outputAnalyser.current.frequencyBinCount
        );
        outputAnalyser.current.getByteFrequencyData(outputData);
        outputVolume =
          outputData.reduce((a, b) => a + b, 0) / outputData.length;
      }

      const inputActive = inputVolume > 5;
      const outputActive = outputVolume > 5;

      let shadowColor = "rgba(59,130,246,0.5)";
      let scale = 1;
      let ringColor = "rgb(59,130,246)";

      if (outputActive) {
        const intensity = Math.min(1, outputVolume / 50);
        shadowColor = `rgba(168,85,247,${0.4 + intensity * 0.4})`;
        scale = 1 + intensity * 0.2;
        ringColor = "rgb(168,85,247)";
      } else if (inputActive && isRecording) {
        const intensity = Math.min(1, inputVolume / 50);
        shadowColor = `rgba(34,197,94,${0.4 + intensity * 0.4})`;
        scale = 1 + intensity * 0.2;
        ringColor = "rgb(34,197,94)";
      }

      micButtonRef.current.style.boxShadow = `0 0 ${
        30 * scale
      }px ${shadowColor}`;
      micButtonRef.current.style.transform = `scale(${scale})`;
      micButtonRef.current.style.borderColor = ringColor;

      animationFrameRef.current = requestAnimationFrame(updateVisuals);
    };

    updateVisuals();

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isConnected, isRecording]);

  const connect = async () => {
    if (audioContext.current.state === "suspended") {
      await audioContext.current.resume();
    }

    websocket.current = new WebSocket("ws://localhost:8000/ws/chat");

    websocket.current.onopen = () => {
      setIsConnected(true);
      websocket.current.send(
        JSON.stringify({
          setup: config,
        })
      );
      startRecording();
    };

    websocket.current.onmessage = async (event) => {
      if (event.data instanceof Blob) {
        const arrayBuffer = await event.data.arrayBuffer();
        playPcmAudio(arrayBuffer);
      } else {
        try {
          const data = JSON.parse(event.data);

          // Handle different types of messages
          if (data.type === "transcript") {
            // Complete transcript from turn completion
            setTranscripts((prev) => {
              const lastIdx = prev.length - 1;
              if (lastIdx >= 0 && prev[lastIdx].role === data.role) {
                // Update last transcript (replace partial with final)
                return [
                  ...prev.slice(0, lastIdx),
                  { role: data.role, text: data.text },
                ];
              }
              return [...prev, { role: data.role, text: data.text }];
            });

            // Reset accumulators
            if (data.role === "user") currentUserTranscript.current = "";
            if (data.role === "agent") currentAgentTranscript.current = "";
          } else if (data.type === "transcript_partial") {
            // Streaming partial transcript
            if (data.role === "agent") {
              // Agent transcripts are deltas (append)
              currentAgentTranscript.current += data.text;
            } else {
              // User transcripts are accumulated interim results (overwrite)
              currentUserTranscript.current = data.text;
              // If user is speaking, assume agent turn is done/interrupted and clear agent buffer
              currentAgentTranscript.current = "";
            }

            const targetText =
              data.role === "agent"
                ? currentAgentTranscript.current
                : currentUserTranscript.current;

            setTranscripts((prev) => {
              const lastIdx = prev.length - 1;
              if (lastIdx >= 0 && prev[lastIdx].role === data.role) {
                // Update last transcript
                return [
                  ...prev.slice(0, lastIdx),
                  { role: data.role, text: targetText },
                ];
              } else {
                // Add new transcript
                return [...prev, { role: data.role, text: targetText }];
              }
            });
          } else if (data.type === "subagent_start") {
            setActiveTool({
              agent: data.agent,
              args: data.args,
            });
            setToolLatency(null);
            setToolResult(null);
          } else if (data.type === "subagent_complete") {
            setToolLatency(data.duration);
            setToolResult(data.result);
          } else if (data.type === "ttfb") {
            setTtfb(data.duration);
            setTtfbHistory((prev) => {
              const newHistory = [...prev, data.duration];
              const avg =
                newHistory.reduce((a, b) => a + b, 0) / newHistory.length;
              setAvgTtfb(avg);
              return newHistory;
            });
          } else if (
            data.type === "tool_response" &&
            data.tool === "check_flight_availability"
          ) {
            setFlightData(data.result);
          } else if (data.text && data.role) {
            // Legacy text message format (fallback) - treat as transcript if not already handled
            // Optional: Add to transcripts if needed, but for now we rely on server_content
          }
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      }
    };

    websocket.current.onclose = () => {
      setIsConnected(false);
      setIsRecording(false);
      stopRecording();
    };
  };

  const playPcmAudio = (arrayBuffer) => {
    // Check if we should ignore this audio packet (stale tail)
    if (Date.now() < audioIgnoreUntil.current) {
      return;
    }

    const audioCtx = audioContext.current;
    const pcmData = new Int16Array(arrayBuffer);
    const float32Data = new Float32Array(pcmData.length);

    for (let i = 0; i < pcmData.length; i++) {
      float32Data[i] = pcmData[i] / 32768.0;
    }

    const buffer = audioCtx.createBuffer(1, float32Data.length, 24000);
    buffer.copyToChannel(float32Data, 0);

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    if (outputAnalyser.current) {
      source.connect(outputAnalyser.current);
      outputAnalyser.current.connect(audioCtx.destination);
    } else {
      source.connect(audioCtx.destination);
    }

    // Track the source
    activeSources.current.push(source);
    source.onended = () => {
      activeSources.current = activeSources.current.filter((s) => s !== source);
    };

    const currentTime = audioCtx.currentTime;
    if (nextStartTime.current < currentTime) {
      nextStartTime.current = currentTime + 0.05;
    }

    source.start(nextStartTime.current);
    nextStartTime.current += buffer.duration;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000,
      });

      source.current = audioCtx.createMediaStreamSource(stream);
      processor.current = audioCtx.createScriptProcessor(2048, 1, 1);

      const inputVisualiser = audioCtx.createAnalyser();
      inputVisualiser.fftSize = 256;
      inputAnalyser.current = inputVisualiser;

      processor.current.onaudioprocess = (e) => {
        if (
          !websocket.current ||
          websocket.current.readyState !== WebSocket.OPEN
        )
          return;

        const inputData = e.inputBuffer.getChannelData(0);

        // Simple VAD check (client-side trigger for reset)
        // Calculate RMS
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);

        // Threshold for speech (approximate)
        if (rms > 0.1 && !window.hasResetTurn) {
          resetTurnState();
          window.hasResetTurn = true;
          // Reset flag after some time to allow next turn reset
          setTimeout(() => {
            window.hasResetTurn = false;
          }, 2000);
        }

        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7fff;
        }

        websocket.current.send(pcmData.buffer);
      };

      source.current.connect(inputVisualiser);
      inputVisualiser.connect(processor.current);
      processor.current.connect(audioCtx.destination);

      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (processor.current) {
      processor.current.disconnect();
      if (source.current) source.current.disconnect();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Top Header */}
      <header className="h-16 border-b border-white/5 bg-gray-900/50 backdrop-blur-md fixed top-0 left-0 right-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Nomad - Multi-Agent Travel Planner
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${
                isConnected ? "bg-green-400" : "bg-red-400"
              }`}></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}></span>
          </span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {isConnected ? "System Online" : "Disconnected"}
          </span>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="pt-20 pb-6 px-6 h-screen grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Controls (3 cols) */}
        <aside className="lg:col-span-3 flex flex-col gap-6 h-full overflow-hidden min-h-0">
          <div className="bg-gray-800/40 rounded-2xl border border-white/5 p-5 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <Settings className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-widest">
                Configuration
              </h2>
            </div>

            <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar flex-1">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Voice Persona
                </label>
                <select
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 transition-colors"
                  value={config.voice_name}
                  onChange={(e) =>
                    setConfig({ ...config, voice_name: e.target.value })
                  }>
                  {["Aoede", "Puck", "Charon", "Kore", "Fenrir"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase flex justify-between">
                  <span>VAD Silence</span>
                  <span>{config.vad_settings.silence_duration_ms}ms</span>
                </label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={config.vad_settings.silence_duration_ms}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      vad_settings: {
                        ...config.vad_settings,
                        silence_duration_ms: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Sensitivity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="bg-black/20 border border-white/10 rounded-lg px-2 py-2 text-xs text-gray-300 focus:outline-none"
                    value={config.start_of_speech_sensitivity}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        start_of_speech_sensitivity: e.target.value,
                      })
                    }>
                    <option value="START_SENSITIVITY_LOW">Start: Low</option>
                    <option value="START_SENSITIVITY_UNSPECIFIED">
                      Start: Med
                    </option>
                    <option value="START_SENSITIVITY_HIGH">Start: High</option>
                  </select>
                  <select
                    className="bg-black/20 border border-white/10 rounded-lg px-2 py-2 text-xs text-gray-300 focus:outline-none"
                    value={config.end_of_speech_sensitivity}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        end_of_speech_sensitivity: e.target.value,
                      })
                    }>
                    <option value="END_SENSITIVITY_LOW">End: Low</option>
                    <option value="END_SENSITIVITY_UNSPECIFIED">
                      End: Med
                    </option>
                    <option value="END_SENSITIVITY_HIGH">End: High</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-3">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    Proactive Audio
                  </span>
                  <button
                    onClick={() =>
                      setConfig({
                        ...config,
                        proactive_audio: !config.proactive_audio,
                      })
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      config.proactive_audio ? "bg-blue-600" : "bg-gray-700"
                    }`}>
                    <div
                      className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${
                        config.proactive_audio ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    Affective Dialog
                  </span>
                  <button
                    onClick={() =>
                      setConfig({
                        ...config,
                        affective_dialog: !config.affective_dialog,
                      })
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      config.affective_dialog ? "bg-purple-600" : "bg-gray-700"
                    }`}>
                    <div
                      className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${
                        config.affective_dialog ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col items-center">
              <button
                ref={micButtonRef}
                onClick={toggleRecording}
                disabled={!isConnected}
                className={`relative group p-6 rounded-full transition-all duration-300 ${
                  !isConnected
                    ? "opacity-50 cursor-not-allowed bg-gray-800"
                    : isRecording
                    ? "bg-red-500/10 text-red-500 ring-2 ring-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.3)]"
                    : "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30 hover:bg-blue-500/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                }`}>
                {isRecording ? (
                  <div className="relative">
                    <span className="absolute -inset-full rounded-full animate-ping bg-red-500/20"></span>
                    <Mic className="w-8 h-8 relative z-10" />
                  </div>
                ) : (
                  <MicOff className="w-8 h-8" />
                )}
              </button>
              <p className="mt-3 text-xs font-medium text-gray-500 uppercase tracking-widest">
                {isRecording ? "Live listening..." : "Mic Muted"}
              </p>
            </div>
          </div>
        </aside>

        {/* Center Column: Chat Interface (6 cols) */}
        <main className="lg:col-span-6 flex flex-col h-full relative min-h-0">
          {/* Connection Overlay if disconnected */}
          {!isConnected && (
            <div className="absolute inset-0 z-20 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
                <Bot className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to Nomad
              </h2>
              <p className="text-gray-400 max-w-md mb-8">
                Your AI-powered multi-agent travel companion. Connect to start
                planning your next adventure with real-time voice interaction.
              </p>
              <button
                onClick={connect}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95">
                Initialize System
              </button>
            </div>
          )}

          <div className="bg-gray-800/40 rounded-2xl border border-white/5 flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-gray-800/50 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Live Transcript
                </span>
              </div>
              <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20">
                BIDI STREAM ACTIVE
              </span>
            </div>

            <div
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
              ref={chatContainerRef}>
              {transcripts.length === 0 && !flightData && (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4 opacity-50">
                  <Bot className="w-12 h-12 stroke-1" />
                  <p className="text-sm font-mono">Ready for voice input...</p>
                </div>
              )}

              {flightData && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <FlightCard flight={flightData} />
                </div>
              )}

              {transcripts.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "agent" ? "justify-start" : "justify-end"
                  } animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                      msg.role === "agent"
                        ? "bg-gray-800/80 backdrop-blur-sm text-gray-100 border border-white/10 rounded-tl-none"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-none shadow-lg shadow-blue-500/20"
                    }`}>
                    {msg.role === "agent" && (
                      <div className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-semibold">
                        Nomad
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right Column: Activity Log (3 cols) */}
        <aside className="lg:col-span-3 h-full overflow-hidden min-h-0">
          <div className="bg-gray-800/40 rounded-2xl border border-white/5 p-5 h-full overflow-hidden shadow-xl">
            <ActivityLog
              ttfb={ttfb}
              avgTtfb={avgTtfb}
              activeTool={activeTool}
              toolLatency={toolLatency}
              toolResult={toolResult}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
