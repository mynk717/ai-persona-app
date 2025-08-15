import React from 'react';
import { personaConfig, colors } from '../config';

const PersonaSelector = ({ selectedPersona, onSwitch }) => (
  <div className="flex gap-4 p-4 border-b border-gray-700">
    <button
      onClick={() => onSwitch('hitesh')}
      className={`px-6 py-2 rounded-full transition-all duration-300 font-bold ${
        selectedPersona === 'hitesh' ? 'text-white shadow-lg' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
      }`}
      style={{
        backgroundColor: selectedPersona === 'hitesh' ? colors.hiteshAccent : '',
        transform: selectedPersona === 'hitesh' ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {personaConfig.hitesh.name}
    </button>
    <button
      onClick={() => onSwitch('piyush')}
      className={`px-6 py-2 rounded-full transition-all duration-300 font-bold ${
        selectedPersona === 'piyush' ? 'text-white shadow-lg' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
      }`}
      style={{
        backgroundColor: selectedPersona === 'piyush' ? colors.piyushAccent : '',
        transform: selectedPersona === 'piyush' ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {personaConfig.piyush.name}
    </button>
  </div>
);

export default PersonaSelector;