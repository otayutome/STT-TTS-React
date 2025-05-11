import React, { useState , useRef} from 'react';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {

  const [transcript, setTranscript] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const RecognitionRef = useRef<SpeechRecognition | null>(null);

  const handleStartRecording = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continus = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      handleCommend(result);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech Recognition Error:', event.error);
    }
    
    RecognitionRef.current = recognition;
    recognition.start();
  }

  const handleCommend = async (result: string) => {
    
      if(result.toLowerCase().includes('hello')) {
        setResponse('Hello, how can I help you today?');
        speak("Hello, how can I help you today?");
      }else{
        const res = await fetch('/api/gpt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: result,
          }),
        });
        const data = await res.json();
        speak(data.reply);
        setResponse(data.reply);
      }
    
  }

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div>
        <button onClick={handleStartRecording}>Start</button>
        <p><strong>You:</strong> {transcript}</p>
        <p><strong>AI:</strong> {response}</p>
      </div>
    </div>
  );
}

export default App;
