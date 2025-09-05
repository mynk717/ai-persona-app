import { useState, useCallback, useRef, useEffect } from 'react';
import { personaConfig } from '../config';

export const useVoiceChat = (selectedPersona) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [voices, setVoices] = useState([]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && 'speechSynthesis' in window) {
      setIsVoiceEnabled(true);
    }
  }, []);

  // Get persona-specific voice
  const getPersonaVoice = useCallback(() => {
    const config = personaConfig[selectedPersona]?.voice;
    if (!config || voices.length === 0) return null;

    for (const preferredVoice of config.preferredVoices) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(preferredVoice.toLowerCase()) ||
        v.lang.includes('en-IN') || v.lang.includes('hi-IN')
      );
      if (voice) return voice;
    }

    // Fallback to default English voice
    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  }, [selectedPersona, voices]);

  // Audio level monitoring
  const startAudioMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          animationRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.warn('Audio monitoring failed:', error);
    }
  }, []);

  const stopAudioMonitoring = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setAudioLevel(0);
  }, []);

  // Speech recognition
  const startListening = useCallback(async () => {
    if (!isVoiceEnabled) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-IN';
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      startAudioMonitoring();
    };

    recognitionRef.current.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);
      if (final) {
        setTranscript(final);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      stopAudioMonitoring();
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      stopAudioMonitoring();
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsListening(false);
    }
  }, [isVoiceEnabled, startAudioMonitoring, stopAudioMonitoring]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  // Speech synthesis
  const speakResponse = useCallback((text) => {
    if (!text || !isVoiceEnabled) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getPersonaVoice();
    const config = personaConfig[selectedPersona]?.voice;

    if (voice) utterance.voice = voice;
    if (config) {
      utterance.rate = config.speed || 1.0;
      utterance.pitch = config.pitch || 1.0;
      utterance.volume = config.volume || 1.0;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [selectedPersona, getPersonaVoice, isVoiceEnabled]);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    audioLevel,
    isVoiceEnabled,
    voices,
    startListening,
    stopListening,
    speakResponse,
    stopSpeaking,
    setTranscript,
    setInterimTranscript
  };
};
