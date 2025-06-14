"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import supabase from "@/lib/client";
import { useAuth } from "@/contexts/AuthContext";

export default function AssistantPage() {
  const [assistants, setAssistants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form fields
  const [name, setName] = useState("");
  const [triggerType, setTriggerType] = useState("webhook");
  const [actionType, setActionType] = useState("call_assistant");
  const [description, setDescription] = useState("");
  const { user } = useAuth();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

  useEffect(() => {
    if (selectedAssistant) {
      fetchSessions(selectedAssistant);
    }
  }, [selectedAssistant]);

  const fetchSessions = async (assistantId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Get unique sessions with their creation time
      const { data: sessionsData, error } = await supabase
        .from("chat_history")
        .select("session_id, created_at")
        .eq("assistant_id", assistantId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      if (!sessionsData || sessionsData.length === 0) {
        setSessions([]);
        return;
      }

      // Fetch sentiment for each session and add unique key
      const sessionPromises = sessionsData.map(async (session) => {
        const response = await fetch(
          `${API_BASE_URL}/sentiment/${assistantId}/${session.session_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch sentiment");
        const sentimentData = await response.json();
        return {
          ...sentimentData,
          // Create unique key combining session ID and timestamp
          uniqueKey: `${session.session_id}-${new Date(session.created_at).getTime()}`
        };
      });

      const sessionsWithSentiment = await Promise.all(sessionPromises);
      setSessions(sessionsWithSentiment);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load session data");
    } finally {
      setLoading(false);
    }
  };

  const handleAssistantClick = (assistant: any) => {
    setSelectedAssistant(assistant.assistant_id);
    setName(assistant.name);
    setTriggerType(assistant.trigger_type);
    setActionType(assistant.action_type);
    setDescription(assistant.description);
  };

  const filteredAssistants = assistants.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSentimentColor = (sentiment: string) => {
    const lowerSentiment = sentiment.toLowerCase();
    switch (lowerSentiment) {
      case "good":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-200 text-yellow-800";
      case "dissapointed":
        return "bg-red-100 text-red-800";
      case "mixed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Session Sentiment Analysis
            </h2>

            {loading && <div className="text-center py-4">Loading sessions...</div>}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                {error}
              </div>
            )}

            {!loading && sessions.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                {selectedAssistant
                  ? "No session data available for this assistant"
                  : "Select an assistant to view session analysis"}
              </div>
            )}

            {sessions.length > 0 && (
              <div className="overflow-x-auto">
                <Table className="min-w-full text-sm">
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="w-32">Session ID</TableHead>
                      <TableHead className="w-40">Sentiment</TableHead>
                      <TableHead>Messages</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {sessions.map((session) => (
                      <TableRow key={session.uniqueKey} className="border-b last:border-0">
                        <TableCell className="font-medium">
                          {session.session_id}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-block rounded-full px-3 py-1 capitalize font-medium ${getSentimentColor(
                              session.sentiment
                            )}`}
                          >
                            {session.sentiment}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {session.message_count} messages
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}