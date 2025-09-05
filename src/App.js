import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import { Mic, MicOff, Settings } from 'lucide-react';

import { personaConfig, colors } from "./config";
import PersonaSelector from "./components/PersonaSelector";
import MessageBubble from "./components/MessageBubble";
import VoiceControls from "./components/VoiceControls";
import AudioVisualizer from "./components/AudioVisualizer";
import { useOpenAIApi } from "./hooks/useOpenAIApi";
import { useVoiceChat } from "./hooks/useVoiceChat";

const App = () => {
  const [selectedPersona, setSelectedPersona] = useState("hitesh");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const chatDisplayRef = useRef(null);
  
  const { generateResponse, isLoading, error } = useOpenAIApi();
  const { 
    isListening, 
    isSpeaking, 
    transcript, 
    interimTranscript,
    audioLevel,
    isVoiceEnabled,
    startListening, 
    stopListening, 
    speakResponse, 
    stopSpeaking,
    setTranscript,
    setInterimTranscript
  } = useVoiceChat(selectedPersona);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle voice input completion
  useEffect(() => {
    if (transcript && !isListening) {
      handleSendMessage(null, transcript);
      setTranscript('');
    }
  }, [transcript, isListening]);

  // Show voice notifications
  useEffect(() => {
    if (!isVoiceEnabled) {
      toast.error('Voice features not supported in this browser');
    }
  }, [isVoiceEnabled]);

  const handleSendMessage = async (e, voiceInput = null) => {
    if (e) e.preventDefault();
    
    const messageText = voiceInput || input.trim();
    if (!messageText) return;

    const userMessage = { text: messageText, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    
    if (!voiceInput) setInput("");
    setInterimTranscript('');

    try {
      const aiResponseText = await generateResponse(
        personaConfig[selectedPersona].promptGuidance,
        messageText
      );

      if (aiResponseText) {
        const aiMessage = {
          text: aiResponseText,
          sender: "ai",
          persona: selectedPersona,
        };
        setMessages(prev => [...prev, aiMessage]);

        // Auto-speak response in voice mode
        if (isVoiceMode && isVoiceEnabled) {
          setTimeout(() => speakResponse(aiResponseText), 500);
        }
      }
    } catch (err) {
      toast.error('Failed to get AI response');
    }
  };

  const handlePersonaSwitch = (persona) => {
    if (selectedPersona !== persona) {
      setSelectedPersona(persona);
      setMessages([]);
      stopSpeaking();
      toast.success(`Switched to ${personaConfig[persona].name}`);
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (isVoiceMode) {
      stopListening();
      stopSpeaking();
    }
    toast.success(isVoiceMode ? 'Voice mode disabled' : 'Voice mode enabled');
  };

  const handleSpeakMessage = (text) => {
    speakResponse(text);
  };

  return (
    <div
      style={{ backgroundColor: colors.background }}
      className="min-h-screen p-4 flex flex-col items-center font-sans text-white relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: colors.container,
            color: colors.textPrimary,
            border: `1px solid ${colors.hiteshAccent}40`
          }
        }}
      />

      <motion.div
        style={{ backgroundColor: colors.container }}
        className="w-full max-w-4xl rounded-xl shadow-2xl flex flex-col h-[90vh] backdrop-blur-sm bg-opacity-95"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <header
          className="p-6 rounded-t-xl border-b border-gray-700/50"
          style={{ backgroundColor: colors.container + '80' }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: colors.textPrimary }}
              >
                AI Persona Voice Chat
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Voice-enabled conversations with AI mentors
              </p>
            </div>
            
            {/* Voice Mode Toggle */}
            <motion.button
              onClick={toggleVoiceMode}
              className={`p-3 rounded-full transition-all duration-300 ${
                isVoiceMode ? 'bg-green-500' : 'bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!isVoiceEnabled}
            >
              {isVoiceMode ? (
                <Mic className="w-6 h-6 text-white" />
              ) : (
                <MicOff className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>

          <PersonaSelector
            selectedPersona={selectedPersona}
            onSwitch={handlePersonaSwitch}
          />
        </header>

        {/* Voice Controls - Show in voice mode */}
        <AnimatePresence>
          {isVoiceMode && isVoiceEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-gray-700/50"
              style={{ backgroundColor: colors.container + '40' }}
            >
              <VoiceControls
                isListening={isListening}
                isSpeaking={isSpeaking}
                isVoiceEnabled={isVoiceEnabled}
                onStartListening={startListening}
                onStopListening={stopListening}
                onStopSpeaking={stopSpeaking}
                audioLevel={audioLevel}
              />
              
              <AudioVisualizer
                audioLevel={audioLevel}
                isActive={isListening || isSpeaking}
                persona={personaConfig[selectedPersona]}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Messages */}
        <main
          ref={chatDisplayRef}
          className="flex-grow p-6 overflow-y-auto space-y-4"
          style={{ 
            background: `linear-gradient(to bottom, ${colors.background}00, ${colors.background}10)` 
          }}
        >
          <AnimatePresence>
            {messages.map((msg, index) => (
              <MessageBubble 
                key={index} 
                message={msg} 
                index={index}
                onSpeak={handleSpeakMessage}
              />
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div 
              className="flex items-center space-x-3 my-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: personaConfig[selectedPersona].accentColor }}
              >
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                {personaConfig[selectedPersona].name} is thinking...
              </span>
            </motion.div>
          )}

          {/* Voice Input Indicator */}
          {interimTranscript && (
            <motion.div
              className="p-4 rounded-lg border-2 border-dashed"
              style={{ 
                borderColor: colors.voiceActive,
                backgroundColor: colors.voiceActive + '10'
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-sm italic" style={{ color: colors.textSecondary }}>
                "{interimTranscript}"
              </p>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              style={{
                backgroundColor: colors.errorBg,
                color: colors.errorText,
              }}
              className="p-4 rounded-lg text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {error}
            </motion.div>
          )}
        </main>

        {/* Input Form - Hide in voice mode when listening */}
        <AnimatePresence>
          {(!isVoiceMode || !isListening) && (
            <motion.form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-700/50 flex gap-4"
              initial={{ opacity: 1 }}
              animate={{ opacity: isVoiceMode && isListening ? 0.5 : 1 }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                style={{
                  backgroundColor: colors.aiBubble,
                  color: colors.textPrimary,
                  borderColor: personaConfig[selectedPersona].accentColor + '40',
                }}
                className="flex-grow rounded-lg p-3 text-sm focus:outline-none resize-none border"
                placeholder={isVoiceMode ? "Voice mode active - speak or type..." : "Type your message..."}
                rows="1"
                disabled={isVoiceMode && isListening}
              />
              <motion.button
                type="submit"
                disabled={isLoading || (isVoiceMode && isListening)}
                className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
                  (isLoading || (isVoiceMode && isListening)) ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{
                  background: `linear-gradient(to right, ${personaConfig[selectedPersona].accentColor}, ${colors.piyushAccent})`,
                  color: colors.textPrimary,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default App;
