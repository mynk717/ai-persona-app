import { useState, useEffect } from 'react';

export const useConversationMemory = (persona) => {
  const [conversationHistory, setConversationHistory] = useState([]);
  
  const storageKey = `conversation_${persona}`;
  
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setConversationHistory(JSON.parse(saved));
    }
  }, [persona, storageKey]);
  
  const saveConversation = (messages) => {
    localStorage.setItem(storageKey, JSON.stringify(messages.slice(-10))); // Keep last 10 messages
    setConversationHistory(messages.slice(-10));
  };
  
  const clearConversation = () => {
    localStorage.removeItem(storageKey);
    setConversationHistory([]);
  };
  
  return { conversationHistory, saveConversation, clearConversation };
};
