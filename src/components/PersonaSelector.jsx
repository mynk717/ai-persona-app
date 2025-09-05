import React from 'react';
import { motion } from 'framer-motion';
import { colors, personaConfig } from '../config';

const PersonaSelector = ({ selectedPersona, onSwitch }) => {
  return (
    <div className="p-6 rounded-xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#E0E0E0] mb-2">Meet The Mentors</h2>
        <p className="text-[#A0A0A0] text-sm">Select a mentor to start conversation</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mx-auto">
        {Object.values(personaConfig).map((persona) => (
          <motion.div
            key={persona.id}
            className={`relative bg-[#2D2D2D] p-6 rounded-2xl flex flex-col items-center text-center cursor-pointer border-2 transition-all duration-300 ${
              selectedPersona === persona.id 
                ? 'border-[#8C47EE] scale-105 shadow-2xl' 
                : 'border-transparent hover:border-[#8C47EE] hover:scale-102'
            }`}
            onClick={() => onSwitch(persona.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Avatar with gradient border */}
            <div 
              className="w-24 h-24 p-1 rounded-full overflow-hidden mb-4" 
              style={{ 
                background: selectedPersona === persona.id 
                  ? `linear-gradient(45deg, ${persona.accentColor}, #47A9EE)` 
                  : 'linear-gradient(45deg, #8C47EE, #47A9EE)' 
              }}
            >
              <img 
                src={persona.avatar} 
                alt={persona.name} 
                className="w-full h-full rounded-full object-cover border-[3px] border-[#2D2D2D]" 
              />
            </div>

            <h3 className="text-[#E0E0E0] text-xl font-bold mb-1">{persona.name}</h3>
            <p className="text-[#A0A0A0] text-sm font-light mb-4 leading-relaxed">{persona.bio}</p>

            {/* Active indicator */}
            {selectedPersona === persona.id && (
              <motion.div 
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: persona.accentColor }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </motion.div>
            )}

            {/* Selection button */}
            <div 
              className="mt-auto w-full py-2 rounded-lg text-center"
              style={{ 
                background: selectedPersona === persona.id 
                  ? `linear-gradient(to right, ${persona.accentColor}40, rgba(71, 169, 238, 0.4))` 
                  : 'linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))' 
              }}
            >
              <span className="text-[#E0E0E0] font-semibold text-sm">
                {selectedPersona === persona.id ? 'Selected' : 'Select Mentor'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PersonaSelector;
