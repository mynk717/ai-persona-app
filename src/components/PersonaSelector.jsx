const PersonaSelector = () => (

    <div className="p-4 rounded-xl flex flex-col items-center">
    <div className="mb-8 text-center">
    <h2 className="text-3xl font-bold text-[#E0E0E0]">Meet The Mentors</h2>
    <p className="text-[#A0A0A0] text-sm mt-2">Select a mentor to start Conversation</p>
    </div>
    
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
      {Object.values(personaConfig).map(persona => (
        <div
          key={persona.name}
          className="relative bg-[#2D2D2D] p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer border-2 border-transparent hover:border-[#8C47EE]"
          onClick={() => handlePersonaSwitch(persona.id)}
        >
          {/* Avatar with gradient border */}
          <div className="w-24 h-24 p-1 rounded-full overflow-hidden mb-4" style={{ background: 'linear-gradient(45deg, #8C47EE, #47A9EE)' }}>
            <img 
              src={persona.avatar} 
              alt={persona.name} 
              className="w-full h-full rounded-full object-cover border-[3px] border-[#2D2D2D]" 
            />
          </div>
    
          <h3 className="text-[#E0E0E0] text-2xl font-extrabold mb-1">{persona.name}</h3>
          <p className="text-[#A0A0A0] text-sm font-light mb-4 leading-relaxed">{persona.bio}</p>
    
          {/* This is the gradient button at the bottom of the card */}
          <div className="absolute bottom-0 w-full p-4 rounded-b-2xl" style={{ background: 'linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))' }}>
            <span className="text-[#E0E0E0] font-semibold text-sm">Select Mentor</span>
          </div>
        </div>
      ))}
    </div>
    </div>
    );