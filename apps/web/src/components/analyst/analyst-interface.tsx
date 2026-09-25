"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/states";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  evidence?: Array<{
    type: string;
    ocid?: string;
    title?: string;
    value?: string;
  }>;
  timestamp: Date;
}

const EXAMPLE_QUESTIONS = [
  "Which procurements have the most significant contract amendments?",
  "What tenders are currently open?",
  "Show me procurements with integrity signals.",
  "What is the total contract value recorded?",
];

export function AnalystInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(question?: string) {
    const text = question ?? input.trim();
    if (!text || loading) return;

    setInput("");

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/analyst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      const json = await res.json();
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: json.data?.response ?? "I couldn't generate a response. Please try again.",
        evidence: json.data?.evidence,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="container-narrow py-6">
      {/* Disclaimer */}
      <div className="alert-info mb-6">
        <Info className="h-4 w-4 text-[hsl(var(--status-info))] flex-shrink-0 mt-0.5" aria-hidden />
        <div className="text-sm text-[hsl(212,47%,35%)]">
          <p className="font-medium mb-0.5">How this works</p>
          <p>
            The analyst is grounded in OpenContract's canonical procurement records and distinguishes available evidence from missing information.
            It can only answer questions about procurement records in this system.
            Always verify key facts against the source records.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="min-h-[400px] space-y-4 mb-6"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-base font-medium text-text-primary mb-2">
              Ask a question about the procurement data
            </p>
            <p className="text-sm text-text-secondary mb-6">
              You can ask about specific contracts, suppliers, signals, or trends.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2">
              {EXAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="text-sm text-left px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-text-secondary hover:text-text-primary"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={[
                "max-w-[85%] rounded-xl px-4 py-3 text-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface border border-border text-text-primary",
              ].join(" ")}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

              {/* Evidence references */}
              {msg.evidence && msg.evidence.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/40 space-y-1">
                  <p className="text-xs font-medium text-text-secondary">
                    Sources:
                  </p>
                  {msg.evidence.map((ev, i) => (
                    <div key={i} className="text-xs text-text-secondary">
                      {ev.ocid ? (
                        <Link
                          href={`/contracts/${ev.ocid}`}
                          className="text-[hsl(var(--status-info))] hover:underline"
                        >
                          {ev.ocid}
                        </Link>
                      ) : null}{" "}
                      {ev.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border rounded-xl px-4 py-3 flex items-center gap-2">
              <Spinner className="h-4 w-4 text-text-muted" />
              <span className="text-sm text-text-secondary">Analysing…</span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-4 bg-background border border-border rounded-xl p-3 shadow-md">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask a question about the procurement data…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="min-h-[56px] max-h-32 resize-none border-0 focus:ring-0 bg-transparent p-0"
            aria-label="Question input"
            rows={1}
          />
          <div className="flex flex-col justify-end gap-1">
            {messages.length > 0 && (
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setMessages([])}
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              size="icon"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Send question"
            >
              {loading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" aria-hidden />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
