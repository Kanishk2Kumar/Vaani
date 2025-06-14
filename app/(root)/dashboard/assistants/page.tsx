"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { FileUpload } from "@/components/ui/file-upload";
import { useAuth } from "@/contexts/AuthContext";

export default function Component() {
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("Model");
  const [assistants, setAssistants] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("gpt4o");
  const [voiceProvider, setVoiceProvider] = useState("deepgram");
  const [voiceModel, setVoiceModel] = useState("asteria");
  const [firstMessage, setFirstMessage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  // Assistant ID
  const [selectedAssistant, setSelectedAssistant] = useState<any | null>(null);
  const [sessionId, setSessionId] = useState("1");

  const { user } = useAuth();
  const tabs = ["Model", "Files", "ConnectionLink"];

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchAssistants = async () => {
      if (!user?.userid) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/assistants/${user.userid}`
        );
        if (!response.ok) throw new Error("Failed to fetch assistants");
        const data = await response.json();

        if (data && data.assistants && Array.isArray(data.assistants)) {
          setAssistants(data.assistants);
        } else {
          console.error("Unexpected response structure:", data);
          setAssistants([]);
        }
      } catch (error) {
        console.error("Error fetching assistants:", error);
        setAssistants([]);
      }
    };

    fetchAssistants();
  }, [user]);

  const handleFileUpload = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!name || !firstMessage || !systemPrompt) {
      setError("Please fill all required fields");
      return;
    }

    if (!user?.userid) {
      setError("User not authenticated");
      return;
    }

    setError(null);
    setIsCreating(true);

    try {
      const formData = new FormData();

      // Append all required fields
      formData.append("user_id", user.userid);
      formData.append("name", name);
      formData.append("first_message", firstMessage);
      formData.append("system_prompt", systemPrompt);
      formData.append("provider", provider);
      formData.append("model", model);
      formData.append("voice_provider", voiceProvider);
      formData.append("voice_model", voiceModel);

      // Append files if any
      if (files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? value.name : value);
      }

      const response = await fetch(`${API_BASE_URL}/assistants/create`, {
        method: "POST",
        body: formData,
        // Important: Don't set Content-Type header - let browser set it
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Backend error details:", responseData);
        throw new Error(
          responseData.detail ||
            responseData.message ||
            `Server error: ${response.statusText}`
        );
      }

      // Success case
      console.log("Assistant created:", responseData);

      // Refresh the list
      const refreshResponse = await fetch(
        `${API_BASE_URL}/assistants/${user.userid}`
      );
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setAssistants(data?.assistants || []);
      }

      // Reset form
      setShowCreateForm(false);
      setName("");
      setModel("gpt4o");
      setProvider("openai");
      setVoiceProvider("deepgram");
      setVoiceModel("asteria");
      setFirstMessage("");
      setSystemPrompt("");
      setFiles([]);
    } catch (error: any) {
      console.error("Creation error:", error);

      // Handle different error formats
      let errorMessage = "Failed to create assistant";
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error.detail) {
        errorMessage = error.detail;
      }

      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAssistantClick = (assistant: any) => {
    setSelectedAssistant(assistant);
    setShowCreateForm(true);
    setName(assistant.name);
    setProvider(assistant.provider);
    setModel(assistant.model);
    setVoiceProvider(assistant.voice_provider);
    setVoiceModel(assistant.voice_model);
    setFirstMessage(assistant.first_message);
    setSystemPrompt(assistant.system_prompt);
    setFiles([]);
    setError(null);
  };
  const connectionLink = selectedAssistant
    ? `${API_BASE_URL}/chat/${selectedAssistant.assistant_id}/${sessionId}`
    : null;
  return (
    <div className="flex h-screen">
      <div className="w-72 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-medium">Assistants</span>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              setName("");
              setProvider("openai");
              setModel("gpt4o");
              setVoiceProvider("deepgram");
              setVoiceModel("asteria");
              setFirstMessage("");
              setSystemPrompt("");
              setFiles([]);
              setShowCreateForm(true);
              setError(null);
            }}
          >
            <Plus className="w-4 h-4" />
            Create Assistant
          </Button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input placeholder="Search Assistants" className="pl-10" />
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          {assistants.length > 0 ? (
            assistants.map((assistant) => (
              <div
                key={assistant.assistant_id}
                className="bg-muted rounded-lg p-3 border mb-2 cursor-pointer"
                onClick={() => handleAssistantClick(assistant)}
              >
                <div className="font-medium">{assistant.name}</div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No assistants found
            </div>
          )}
        </div>
      </div>

      {showCreateForm && (
        <div className="flex-1 flex flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">
                  {name || "New Assistant"}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleSubmit} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Save Assistant"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p>{error}</p>
            </div>
          )}

          <div className="border-b">
            <div className="flex">
              {tabs.map((tab) => (
                <Link href={`#${tab.toLowerCase()}`} key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            <Card id="model">
              <CardContent className="p-6 space-y-6">
                <div className="text-xl font-semibold mb-4">Assistant Info</div>
                <Input
                  placeholder="Assistant Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isCreating}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2">Provider</label>
                    <Select
                      value={provider}
                      onValueChange={setProvider}
                      disabled={isCreating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="openai">OpenAI</SelectItem> */}
                        <SelectItem value="groq">Groq</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2">Model</label>
                    <Select
                      value={model}
                      onValueChange={setModel}
                      disabled={isCreating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="llama3">LLaMA 3 </SelectItem>
                        <SelectItem value="mixtral">Mixtral </SelectItem>
                        <SelectItem value="gemma">Gemma </SelectItem>
                        <SelectItem value="gpt4o">GPT 4o</SelectItem>
                        <SelectItem value="mixtral">Mixtral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2">
                      Voice Provider
                    </label>
                    <Select
                      value={voiceProvider}
                      onValueChange={setVoiceProvider}
                      disabled={isCreating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deepgram">Deepgram</SelectItem>
                        <SelectItem value="openai">OpenAI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2">
                      Voice Model
                    </label>
                    <Select
                      value={voiceModel}
                      onValueChange={setVoiceModel}
                      disabled={isCreating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asteria">Asteria</SelectItem>
                        <SelectItem value="nova">Nova</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2">
                    First Message
                  </label>
                  <Textarea
                    value={firstMessage}
                    onChange={(e) => setFirstMessage(e.target.value)}
                    placeholder="e.g. Thank you for calling Wellness Partners..."
                    className="min-h-[80px]"
                    disabled={isCreating}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2">
                    System Prompt
                  </label>
                  <Textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="e.g. You are Riley, a voice assistant for..."
                    className="min-h-[200px]"
                    disabled={isCreating}
                  />
                </div>
              </CardContent>
            </Card>

            <Card id="files" className="mt-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upload File</h2>
                <FileUpload onChange={handleFileUpload} />
                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">
                      Files to Upload
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {files.map((file, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="truncate max-w-xs">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card id="ConnectionLink" className="mt-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Connect With Ease to Your Code
                </h2>
                <div className="space-y-4 border-t pt-4">
                  <div className="bg-gray-100 p-4 rounded text-sm font-mono break-all">
                    <h3 className="text-lg font-semibold">Chat Connect Link</h3>
                    {connectionLink ||
                      "Select an assistant to get the connection link."}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
