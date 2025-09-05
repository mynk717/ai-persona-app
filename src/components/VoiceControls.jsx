import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff } from 'lucide-react';
import { colors } from '../config';

const VoiceControls = ({ 
  isListening, 
  isSpeaking, 
  isVoiceEnabled, 
  onStartListening, 
  onStopListening, 
  onStopSpeaking,
  audioLevel 
}) => {
  return (
    <div className="flex items-center justify-center space-x-4 p-4">
      {/* Voice Input Button */}
      <motion.button
        className={`relative p-4 rounded-full transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 shadow-red-500/50' 
            : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
        } shadow-lg`}
        onClick={isListening ? onStopListening : onStartListening}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!isVoiceEnabled}
      >
        {isListening ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
        
        {/* Pulsing animation when listening */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ opacity: 0.3 }}
          />
        )}
        
        {/* Audio level indicator */}
        {isListening && audioLevel > 0 && (
          <motion.div
            className="absolute -inset-2 rounded-full border-2 border-red-400"
            animate={{ 
              scale: 1 + (audioLevel / 100),
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ duration: 0.1 }}
          />
        )}
      </motion.button>

      {/* Speaking Status */}
      <motion.button
        className={`p-3 rounded-full transition-all duration-300 ${
          isSpeaking 
            ? 'bg-blue-500 shadow-blue-500/50' 
            : 'bg-gray-600 shadow-gray-600/30'
        } shadow-lg`}
        onClick={isSpeaking ? onStopSpeaking : undefined}
        whileHover={{ scale: isSpeaking ? 1.05 : 1 }}
        whileTap={{ scale: isSpeaking ? 0.95 : 1 }}
        disabled={!isSpeaking}
      >
        {isSpeaking ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-gray-400" />
        )}
        
        {/* Speaking animation */}
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ opacity: 0.3 }}
          />
        )}
      </motion.button>

      {/* Voice Status Indicator */}
      <div className="flex items-center space-x-2">
        <div 
          className={`w-3 h-3 rounded-full ${
            !isVoiceEnabled ? 'bg-red-500' : 
            isListening ? 'bg-green-500' : 
            isSpeaking ? 'bg-blue-500' : 'bg-gray-500'
          }`}
        />
        <span className="text-sm text-gray-400">
          {!isVoiceEnabled ? 'Voice Disabled' :
           isListening ? 'Listening...' :
           isSpeaking ? 'Speaking...' : 'Voice Ready'}
        </span>
      </div>
    </div>
  );
};

export default VoiceControls;
