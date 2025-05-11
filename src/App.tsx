// src/App.tsx
import React, { useState } from 'react';
import SpeechToText from './components/speechToText';
import { speakText } from './utils/speakSpeech';

const App = () => {
  const [chat, setChat] = useState<string[]>([]);

  const handleSpeech = async (text: string) => {
    setChat(prev => [...prev, `You: ${text}`]);
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text }),
    });
    const data = await response.json();
    setChat(prev => [...prev, `Bot: ${data.reply}`]);
    speakText(data.reply);
  };

  return (
    <div>
      <SpeechToText onText={handleSpeech} />
      <div>
        {chat.map((line, i) => <div key={i}>{line}</div>)}
      </div>
    </div>
  );
};

export default App;
