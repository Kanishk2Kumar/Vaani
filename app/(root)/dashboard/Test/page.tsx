"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import supabase from "@/lib/client";
import { useAuth } from "@/contexts/AuthContext";

export default function VoiceAssistantPage() {
  // Audio recording state
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [botResponse, setBotResponse] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Assistant state
  const [assistants, setAssistants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [sessionId] = useState("1"); // Using fixed session ID for simplicity
  const { user } = useAuth();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Detect browser language on component mount
  useEffect(() => {
    const browserLanguage = navigator.language.split("-")[0];
    setLanguage(browserLanguage);
  }, []);

  // Fetch assistants
  useEffect(() => {
    const fetchAssistants = async () => {
      if (!user?.userid) return;

      const { data, error } = await supabase
        .from("assistants")
        .select("*")
        .eq("user_id", user.userid);

      if (!error && data) setAssistants(data);
    };

    fetchAssistants();
  }, [user]);

  // Fetch chat history when assistant or session changes
  useEffect(() => {
    if (selectedAssistant) {
      fetchChatHistory();
    }
  }, [selectedAssistant, sessionId]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/history/${selectedAssistant}/${sessionId}`
      );
      if (!response.ok) throw new Error("Failed to fetch chat history");
      const data = await response.json();
      setChatHistory(data.history || []);
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  };

  const handleAssistantClick = (assistant: any) => {
    setSelectedAssistant(assistant.assistant_id);
  };

  const startRecording = async () => {
    if (!selectedAssistant) {
      alert("Please select an assistant first");
      return;
    }

    setBotResponse(null);
    setTranscription(null);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/m4a" });
      const audioFile = new File([audioBlob], "recording.m4a", {
        type: "audio/m4a",
      });

      const formData = new FormData();
      formData.append("audio_file", audioFile);
      formData.append("language", language);

      try {
        const res = await fetch(
          `${API_BASE_URL}/voice-chat/${selectedAssistant}/${sessionId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) throw new Error("Failed to fetch response");

        const data = await res.json();
        setAudioUrl(URL.createObjectURL(audioBlob));
        setBotResponse(data.response);
        setTranscription(data.transcription);
        if (data.language) {
          setLanguage(data.language);
        }
        
        // Refresh chat history after new interaction
        fetchChatHistory();
      } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong. Check console.");
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  useEffect(() => {
    if (botResponse) {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      const selectedVoice = voices.find((voice) =>
        voice.lang.toLowerCase().startsWith(language.toLowerCase())
      );

      const utterance = new SpeechSynthesisUtterance(botResponse);
      utterance.lang = selectedVoice?.lang || language;
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = 1;
      utterance.pitch = 1;

      synth.cancel();
      synth.speak(utterance);
    }
  }, [botResponse, language]);

  const filteredAssistants = assistants.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-72 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <span className="font-medium">Assistants</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search Assistants"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Assistant list */}
        <div className="flex-1 p-4 overflow-auto">
          {filteredAssistants.map((a) => (
            <div
              key={a.assistant_id}
              className={`rounded-lg p-3 border mb-2 cursor-pointer ${
                selectedAssistant === a.assistant_id
                  ? "bg-primary/10 border-primary"
                  : "bg-muted"
              }`}
              onClick={() => handleAssistantClick(a)}
            >
              <div className="font-medium">{a.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Last used: {new Date(a.updated_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Chat history */}
        <div className="flex-1 overflow-auto p-6">
          <div className="">
                <h1 className="text-xl font-semibold mb-4">💬 Chat History</h1>
                <div className="space-y-4">
                  {chatHistory.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      {selectedAssistant
                        ? "No chat history yet"
                        : "Select an assistant to view chat history"}
                    </p>
                  )}
                  {chatHistory.map((message) => (
                    <div key={message.id} className="space-y-2">
                      {/* User message */}
                      {message.user_query && (
                        <div className="flex justify-end">
                          <div className="max-w-[80%] rounded-lg p-3 bg-primary text-primary-foreground">
                            <p>{message.user_query}</p>
                            <p className="text-xs text-primary-foreground/70 mt-1">
                              {new Date(message.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Bot response */}
                      {message.bot_response && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                            <p>{message.bot_response}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(message.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
          </div>
        </div>

        {/* Audio recorder */}
        <div className="p-6 border-t">
          <div className="">
                <h1 className="text-xl font-semibold mb-4">🎙️ Audio Recorder</h1>

                {/* Language selector dropdown */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm">Language:</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                {!recording ? (
                  <Button onClick={startRecording} disabled={!selectedAssistant}>
                    Start Recording
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="destructive">
                    Stop Recording
                  </Button>
                )}

                {audioUrl && (
                  <div className="mt-4 text-center">
                    <p className="mb-2 font-medium">🎧 Uploaded Audio:</p>
                    <audio controls src={audioUrl} className="mt-2" />
                  </div>
                )}

                {transcription && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <h2 className="font-semibold">📝 Your Message:</h2>
                    <p>{transcription}</p>
                  </div>
                )}

                {botResponse && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
                    <h2 className="font-semibold mb-2">🤖 Assistant Response:</h2>
                    <p>{botResponse}</p>

                    <div className="mt-3 space-x-2">
                      <Button onClick={() => speechSynthesis.pause()}>Pause</Button>
                      <Button onClick={() => speechSynthesis.resume()}>Resume</Button>
                      <Button onClick={() => speechSynthesis.cancel()}>Stop</Button>
                      <span className="text-sm text-gray-500">
                        Speaking in: {language}
                      </span>
                    </div>
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
}