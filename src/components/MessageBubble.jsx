import React from 'react';
import { colors } from '../config';

const MessageBubble = ({ message, index }) => (
  <div
    style={{
      animation: `fadeInUp 0.3s ease-out ${index * 0.1}s forwards`,
      animationFillMode: 'forwards',
      opacity: 0,
      backgroundColor: message.sender === 'user' ? colors.userBubble : colors.aiBubble,
      color: colors.textPrimary,
    }}
    className={`p-4 rounded-lg max-w-[80%] my-2 shadow-md ${
      message.sender === 'user' ? 'ml-auto rounded-br-none' : 'mr-auto rounded-bl-none'
    }`}
  >
    <p className="text-sm">{message.text}</p>
  </div>
);

export default MessageBubble;