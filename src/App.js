import React, { useState, useRef, useEffect } from "react";
import { personaConfig, colors } from "./config";
import PersonaSelector from "./components/PersonaSelector";
import MessageBubble from "./components/MessageBubble";
import { useGeminiApi } from "./hooks/useGeminiApi";

const App = () => {
  const [selectedPersona, setSelectedPersona] = useState("hitesh");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatDisplayRef = useRef(null);
  const { generateResponse, isLoading, error } = useGeminiApi();

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async e => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const aiResponseText = await generateResponse(
      personaConfig[selectedPersona].promptGuidance,
      userMessage.text
    );

    if (aiResponseText) {
      const aiMessage = {
        text: aiResponseText,
        sender: "ai",
        persona: selectedPersona,
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const handlePersonaSwitch = persona => {
    if (selectedPersona !== persona) {
      setSelectedPersona(persona);
      setMessages([]);
    }
  };

  // Tailwind CSS animation keyframes
  const animationStyle = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return (
    <div
      style={{ backgroundColor: colors.background }}
      className="min-h-screen p-4 flex flex-col items-center font-sans text-white"
    >
      <style>{animationStyle}</style>
      <div
        style={{ backgroundColor: colors.container }}
        className="w-full max-w-4xl rounded-xl shadow-2xl flex flex-col h-[90vh]"
      >
        <header
          className="p-4 rounded-t-xl"
          style={{ backgroundColor: colors.container }}
        >
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: colors.textPrimary }}
          >
            AI Persona Demo
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Simulating the styles of Hitesh Choudhary & Piyush Garg.
          </p>
          <PersonaSelector
            selectedPersona={selectedPersona}
            onSwitch={handlePersonaSwitch}
          />
        </header>

        <div className="p-4 border-b border-gray-700 space-y-4">
          <div className="space-y-2">
            <h3
              className="text-xl font-semibold"
              style={{ color: colors.textPrimary }}
            >
              Data Prep (Conceptual)
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: colors.textSecondary }}
            >
              For this demo, "data preparation" involves crafting a detailed
              system prompt based on public content from{" "}
              <a
                href="https://hitesh.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors"
              >
                Hitesh Choudhary
              </a>{" "}
              and{" "}
              <a
                href="https://www.piyushgarg.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors"
              >
                Piyush Garg
              </a>
              . In a real-world scenario, this might involve fine-tuning the
              model on a large corpus of their content or using advanced
              Retrieval-Augmented Generation (RAG) techniques.
            </p>
          </div>
          <div className="space-y-2">
            <h3
              className="text-xl font-semibold"
              style={{ color: colors.textPrimary }}
            >
              Prompt Logic
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: colors.textSecondary }}
            >
              The following instructions are dynamically injected as a system
              prompt to guide the AI's persona for each response:
            </p>
            <div
              className="rounded-lg p-4 font-mono text-sm leading-snug"
              style={{ backgroundColor: colors.aiBubble }}
            >
              <pre className="whitespace-pre-wrap">
                {personaConfig[selectedPersona].promptGuidance}
              </pre>
            </div>
          </div>
        </div>

        <main
          ref={chatDisplayRef}
          className="flex-grow p-4 overflow-y-auto custom-scrollbar space-y-4"
        >
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} index={index} />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 my-2 ml-auto">
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                {personaConfig[selectedPersona].name} is typing...
              </span>
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: personaConfig[selectedPersona].accentColor,
                }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-pulse delay-75"
                style={{
                  backgroundColor: personaConfig[selectedPersona].accentColor,
                }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-pulse delay-150"
                style={{
                  backgroundColor: personaConfig[selectedPersona].accentColor,
                }}
              ></div>
            </div>
          )}
          {error && (
            <div
              style={{
                backgroundColor: colors.errorBg,
                color: colors.errorText,
              }}
              className="p-4 rounded-lg my-4 text-sm"
            >
              {error}
            </div>
          )}
        </main>

        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-700 flex gap-4"
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            style={{
              backgroundColor: colors.aiBubble,
              color: colors.textPrimary,
              borderColor: colors.hiteshAccent,
            }}
            className="flex-grow rounded-lg p-3 text-sm focus:outline-none resize-none overflow-hidden"
            placeholder="Ask something..."
            rows="1"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
            style={{
              background: "linear-gradient(to right, #6366F1, #8B5CF6)",
              color: colors.textPrimary,
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
