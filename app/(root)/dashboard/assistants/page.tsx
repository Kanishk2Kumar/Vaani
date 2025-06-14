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
import {
  Search,
  Plus,
  Play,
  MessageCircle,
  Phone,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { FileUpload } from "@/components/ui/file-upload";
import supabase from "@/lib/client";
import { useAuth } from "@/contexts/AuthContext";

export default function Component() {
  const [files, setFiles] = useState<File[]>([]);
  const [Filelink, setFilelink] = useState<string>("");
  const [activeTab, setActiveTab] = useState("Model");
  const [assistants, setAssistants] = useState<any>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [name, setName] = useState("");
  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("gpt4o");
  const [voiceProvider, setVoiceProvider] = useState("deepgram");
  const [voiceModel, setVoiceModel] = useState("asteria");
  const [firstMessage, setFirstMessage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  const { user } = useAuth();

  const tabs = ["Model", "Voice", "Tools"];

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

  const handleFileUpload = async (selectedFiles: File[]) => {
    setFiles(selectedFiles);

    for (const file of selectedFiles) {
      const filename = `uploads/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("assistant-files")
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error.message);
      } else {
        const { data: fileUrl } = supabase.storage
          .from("assistant-files")
          .getPublicUrl(filename);

        if (fileUrl?.publicUrl) setFilelink(fileUrl.publicUrl);
      }
    }
  };

  const handleSubmit = async () => {
    if (!name || !firstMessage || !systemPrompt) {
      alert("Please fill all required fields.");
      return;
    }

    const { error } = await supabase.from("assistants").insert([
      {
        name,
        provider,
        model,
        user_id: user.userid,
        voice_provider: voiceProvider,
        voice_model: voiceModel,
        first_message: firstMessage,
        system_prompt: systemPrompt,
        file_url: Filelink,
      },
    ]);

    if (error) {
      console.error("❌ Error uploading assistant:", error.message);
      alert("Failed to upload assistant.");
    } else {
      alert("Assistant uploaded successfully!");
      setShowCreateForm(false);
      setName("");
      setModel("gpt4o");
      setProvider("openai");
      setVoiceProvider("deepgram");
      setVoiceModel("asteria");
      setFirstMessage("");
      setSystemPrompt("");
      setFilelink("");
    }
  };

  const handleAssistantClick = (assistant: any) => {
    setShowCreateForm(true);
    setName(assistant.name);
    setProvider(assistant.provider);
    setModel(assistant.model);
    setVoiceProvider(assistant.voice_provider);
    setVoiceModel(assistant.voice_model);
    setFirstMessage(assistant.first_message);
    setSystemPrompt(assistant.system_prompt);
    setFilelink(assistant.file_url);
  };

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
              setFilelink("");
              setFiles([]);
              setShowCreateForm(true);
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
          {assistants.map((assistant: any) => (
            <div
              key={assistant.id}
              className="bg-muted rounded-lg p-3 border mb-2 cursor-pointer"
              onClick={() => handleAssistantClick(assistant)}
            >
              <div className="font-medium">{assistant.name}</div>
            </div>
          ))}
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
                <Button onClick={handleSubmit}>Save Assistant</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>

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
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2">Provider</label>
                    <Select value={provider} onValueChange={setProvider}>
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
                    <Select value={model} onValueChange={setModel}>
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
                    <Select value={voiceModel} onValueChange={setVoiceModel}>
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
                  />
                </div>
              </CardContent>
            </Card>

            <Card id="files" className="mt-4">
              <CardContent className="p-6">
                {!Filelink && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Upload File</h2>
                    <FileUpload onChange={handleFileUpload} />
                    {files.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">
                          Upload Files
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {files.map((file, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="truncate max-w-xs">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
                {Filelink && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Uploaded Files</h3>
                    <a
                      href={Filelink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Click to see file
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
