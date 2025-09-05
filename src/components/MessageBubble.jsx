import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, User, Bot } from 'lucide-react';
import { colors, personaConfig } from '../config';

const MessageBubble = ({ message, index, onSpeak }) => {
  const isUser = message.sender === 'user';
  const persona = !isUser ? personaConfig[message.persona] : null;
  
  return (
    <motion.div
      className={`flex items-start space-x-3 mb-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {/* Avatar */}
      <div 
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500' : 'bg-gray-700'
        }`}
        style={{ 
          backgroundColor: !isUser ? persona?.accentColor : undefined,
          backgroundImage: !isUser && persona?.avatar ? `url(${persona.avatar})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : !persona?.avatar ? (
          <Bot className="w-5 h-5 text-white" />
        ) : null}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[70%] ${isUser ? 'text-right' : ''}`}>
        {/* Sender Name */}
        {!isUser && (
          <div className="text-xs text-gray-400 mb-1">
            {persona?.name || 'AI Assistant'}
          </div>
        )}
        
        {/* Message Bubble */}
        <div
          className={`relative p-4 rounded-2xl shadow-lg ${
            isUser 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : 'bg-gray-800 text-gray-100 rounded-bl-md'
          }`}
          style={{
            backgroundColor: !isUser ? colors.aiBubble : undefined,
            borderColor: !isUser ? persona?.accentColor + '30' : undefined,
            borderWidth: !isUser ? '1px' : undefined
          }}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
          
          {/* Voice Play Button for AI messages */}
          {!isUser && onSpeak && (
            <button
              onClick={() => onSpeak(message.text)}
              className="absolute -bottom-2 -right-2 p-2 rounded-full bg-white shadow-lg hover:scale-110 transition-transform"
              style={{ color: persona?.accentColor }}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : ''}`}>
          {new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
