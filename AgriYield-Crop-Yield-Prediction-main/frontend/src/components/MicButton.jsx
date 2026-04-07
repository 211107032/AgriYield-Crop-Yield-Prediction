import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

const MicButton = ({ onSpeechResult }) => {
    const [isListening, setIsListening] = useState(false);

    const toggleListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Your browser doesn't support speech recognition. Try Chrome.");
            return;
        }

        if (isListening) {
            setIsListening(false);
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US'; // Can change to local language code
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onError = (e) => {
            console.error(e);
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onSpeechResult(transcript);
        };

        recognition.start();
    };

    return (
        <button
            onClick={toggleListening}
            className={`p-6 rounded-full shadow-lg transition-all transform hover:scale-105 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-farm-green'
                } text-white`}
        >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
        </button>
    );
};

export default MicButton;
