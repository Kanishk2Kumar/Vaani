"use client";

import { useState } from "react";
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
  ChevronUp,
  Sparkles,
  Maximize2,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export default function Component() {
  const [activeTab, setActiveTab] = useState("Model");
  const [isSystemPromptExpanded, setIsSystemPromptExpanded] = useState(true);

  const tabs = [
    "Model",
    "Voice",
    "Tools",
  ];

  return (
    <div className="flex h-screen">
      <div className="w-72  border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-medium">Assistants</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-5 h-5  rounded"></div>
              <span className="text-sm">Docs</span>
            </div>
          </div>

          <Button className="w-full   ">
            <Plus className="w-4 h-4" />
            Create Assistant
          </Button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 " />
            <Input placeholder="Search Assistants" className="pl-10 " />
          </div>
        </div>

        {/* Assistant List */}
        <div className="flex-1 p-4">
          <div className="bg-blue-600 rounded-lg p-3 border-l-4 ">
            <div className="font-medium">Sarvad</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Sarvad</h1>
              <span className="text-sm ">7a06b762-ada5-47c0-bc37...</span>
              <div className="flex gap-2">
                <div className="w-4 h-4  rounded"></div>
                <div className="w-4 h-4  rounded"></div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-blue-600 ">
                <Play className="w-4 h-4 mr-2" />
                Test
              </Button>
              <Button variant="outline" className="border-blue-600 ">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button className=" ">
                <Phone className="w-4 h-4 mr-2" />
                Talk to Assistant
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <div className="flex">
            {tabs.map((tab) => (
              <Link href={`#${tab.toLowerCase()}`}>
              <button
                key={tab}
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

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Card id="model">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Model</h2>
                  <p className="text-blue-400">
                    Configure the behavior of the assistant.
                  </p>
                </div>
                <ChevronUp className="w-5 h-5 " />
              </div>

              <div className="space-y-6">
                {/* Provider and Model */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Provider
                    </label>
                    <Select defaultValue="openai">
                      <SelectTrigger className=" ">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className=" ">
                        <SelectItem value="openai">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-primary-foreground rounded"></div>
                            OpenAI
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center gap-2">
                      Model
                      <HelpCircle className="w-4 h-4 " />
                    </label>
                    <Select defaultValue="gpt4o">
                      <SelectTrigger className=" ">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className=" ">
                        <SelectItem value="gpt4o">GPT 4o Cluster</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* First Message Mode */}
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    First Message Mode
                    <HelpCircle className="w-4 h-4 " />
                  </label>
                  <Select defaultValue="assistant-first">
                    <SelectTrigger className=" ">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className=" ">
                      <SelectItem value="assistant-first">
                        Assistant speaks first
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* First Message */}
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    First Message
                    <HelpCircle className="w-4 h-4 " />
                  </label>
                  <Textarea
                    defaultValue="Thank you for calling Wellness Partners. This is Riley, your scheduling assistant. How may I help you today?"
                    className="   min-h-[80px]"
                  />
                </div>

                {/* System Prompt */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      System Prompt
                      <HelpCircle className="w-4 h-4 " />
                    </label>
                    <Button size="sm" className=" ">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>

                  <div className="relative">
                    <Textarea
                      value={`# Appointment Scheduling Agent Prompt

## Identity & Purpose

You are Riley, an appointment scheduling voice assistant for Wellness Partners, a multi-specialty health clinic. Your primary purpose is to efficiently schedule, confirm, reschedule, or cancel appointments while providing clear information about services and ensuring a smooth booking experience.

## Voice & Persona

### Personality
- Sound friendly, organized, and efficient
- Project a helpful and patient demeanor, especially with elderly or confused callers
- Maintain a warm but professional tone throughout the conversation`}
                      className="   min-h-[300px] pr-10"
                      readOnly={!isSystemPromptExpanded}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2  hover:text-white"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card id="voice" className="mt-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Voice Provider</h2>
                  <p className="text-blue-400">
                    Configure the voice of the assistant.
                  </p>
                </div>
                <ChevronUp className="w-5 h-5 " />
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Provider
                    </label>
                    <Select defaultValue="openai">
                      <SelectTrigger className=" ">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className=" ">
                        <SelectItem value="openai">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-primary-foreground rounded"></div>
                            Deepgram
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center gap-2">
                      Model
                      <HelpCircle className="w-4 h-4 " />
                    </label>
                    <Select defaultValue="gpt4o">
                      <SelectTrigger className=" ">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className=" ">
                        <SelectItem value="gpt4o">Asteria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card id="tools" className="mt-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Tools</h2>
                  <p className="text-blue-400">
                    Choose the tools that the assistant can use.
                  </p>
                </div>
                <ChevronUp className="w-5 h-5 " />
              </div>

              <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Tools
                    </label>
                    <Select defaultValue="openai">
                      <SelectTrigger className=" ">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className=" ">
                        <SelectItem value="openai">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-primary-foreground rounded"></div>
                            Tool 1
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
