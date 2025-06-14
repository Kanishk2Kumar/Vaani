"use client";

// ── NEW IMPORTS ───────────────────────────────────────────
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
// ──────────────────────────────────────────────────────────

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
import supabase from "@/lib/client";
import { useAuth } from "@/contexts/AuthContext";

export default function AssistantPage() {
  /* ───────────────────────────────
     State
  ─────────────────────────────── */
  const [assistants, setAssistants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // form fields
  const [name, setName] = useState("");
  const [triggerType, setTriggerType] = useState("webhook");
  const [actionType, setActionType] = useState("call_assistant");
  const [description, setDescription] = useState("");
  const { user } = useAuth();

  /* ───────────────────────────────
     Fetch existing assistants
  ─────────────────────────────── */
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

  /* ───────────────────────────────
     Create Assistant
  ─────────────────────────────── */
  const handleSave = async () => {
    if (!name) {
      alert("Give your assistant a name 🤖");
      return;
    }

    const payload = {
      name,
      trigger_type: triggerType,
      action_type: actionType,
      description,
      user_id: user.userid,
    };

    const { error } = await supabase.from("assistants").insert([payload]);

    if (error) {
      console.error("❌ Could not save assistant:", error.message);
      alert("Failed to save assistant");
    } else {
      alert("Assistant saved!");
      resetForm();
    }
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setName("");
    setTriggerType("webhook");
    setActionType("call_assistant");
    setDescription("");
  };

  /* ───────────────────────────────
     Click existing assistant
  ─────────────────────────────── */
  const handleAssistantClick = (assistant: any) => {
    setShowCreateForm(true);
    setName(assistant.name);
    setTriggerType(assistant.trigger_type);
    setActionType(assistant.action_type);
    setDescription(assistant.description);
  };

  const filteredAssistants = assistants.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ───────────────────────────────
     UI
  ─────────────────────────────── */
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-72 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <span className="font-medium">Assistants</span>
            <Button size="sm" onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
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
              key={a.id}
              className="bg-muted rounded-lg p-3 border mb-2 cursor-pointer"
              onClick={() => handleAssistantClick(a)}
            >
              <div className="font-medium">{a.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main – Session Wise Analysis */}
      <div className="flex-1 p-6 overflow-auto">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Session Wise Analysis
            </h2>

            <div className="overflow-x-auto">
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-32">Session ID</TableHead>
                    <TableHead className="w-40">Analysis</TableHead>
                    <TableHead>Feedback</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {[
                    {
                      id: "S-001",
                      analysis: "good",
                      feedback: "Great clarity throughout.",
                    },
                    {
                      id: "S-002",
                      analysis: "moderate",
                      feedback: "Some pauses detected.",
                    },
                    {
                      id: "S-003",
                      analysis: "disappointed",
                      feedback: "Frequent off‑topic responses.",
                    },
                    {
                      id: "S-004",
                      analysis: "bad",
                      feedback: "User abandoned the session.",
                    },
                  ].map((row) => (
                    <TableRow key={row.id} className="border-b last:border-0">
                      <TableCell className="font-medium">{row.id}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block rounded-full px-3 py-1 capitalize font-medium ${
                            row.analysis === "good"
                              ? "bg-green-100 text-green-800"
                              : row.analysis === "moderate"
                              ? "bg-yellow-100 text-yellow-800"
                              : row.analysis === "disappointed"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {row.analysis}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.feedback}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
