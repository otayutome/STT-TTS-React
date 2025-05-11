// src/components/SpeechToText.tsx
import React, { useState } from 'react';

const SpeechToText: React.FC<{ onText: (text: string) => void }> = ({ onText }) => {
  const [listening, setListening] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.lang = 'en-US';
    recognition.current.interimResults = false;
    recognition.current.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      onText(transcript);
    };
    recognition.current.start();
    setListening(true);
  };

  return (
    <button onClick={startListening}>
      {listening ? 'Listening...' : 'Start Talking'}
    </button>
  );
};

export default SpeechToText;
