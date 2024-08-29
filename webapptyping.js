import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TypingSimulator = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [speed, setSpeed] = useState(5);
  const [mistakeFrequency, setMistakeFrequency] = useState(5);
  const [pauseDuration, setPauseDuration] = useState(5);
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState('Ready');

  const speedLabels = ["Very Slow", "Slow", "Moderately Slow", "Slightly Slow", "Normal",
                       "Slightly Fast", "Moderately Fast", "Fast", "Very Fast", "Ultra Fast"];
  const pauseLabels = ["Very Short", "Short", "Moderately Short", "Slightly Short", "Normal",
                       "Slightly Long", "Moderately Long", "Long", "Very Long", "Extra Long"];

  const sanitizeInput = (text) => {
    return text.replace(/[^\x20-\x7E\n]/g, '');
  };

  const simulateTyping = async () => {
    const sanitizedText = sanitizeInput(inputText);
    setIsTyping(true);
    setOutputText('');

    for (let i = 5; i > 0; i--) {
      setStatus(`Starting in ${i} seconds...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setStatus('Typing in progress...');

    const baseDelay = 100 * (11 - speed) / 5;
    const mistakeProbability = mistakeFrequency / 100;

    for (const char of sanitizedText) {
      if (Math.random() < mistakeProbability) {
        const mistakeChar = 'qwertyuiopasdfghjklzxcvbnm'[Math.floor(Math.random() * 26)];
        setOutputText(prev => prev + mistakeChar);
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
        setOutputText(prev => prev.slice(0, -1));
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
      }

      setOutputText(prev => prev + char);
      let delay = baseDelay * (Math.random() + 0.5);
      if ('.!?\n'.includes(char)) {
        delay *= pauseDuration;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    setIsTyping(false);
    setStatus('Typing completed!');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Web-based Typing Simulator</h1>
      
      <div className="mb-4">
        <Label htmlFor="input-text">Enter text to be typed:</Label>
        <Input
          id="input-text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to be typed..."
          className="w-full h-32"
        />
      </div>

      <div className="mb-4">
        <Label>Typing Speed: {speedLabels[speed - 1]}</Label>
        <Slider
          value={[speed]}
          onValueChange={(value) => setSpeed(value[0])}
          min={1}
          max={10}
          step={1}
        />
      </div>

      <div className="mb-4">
        <Label>Mistake Frequency: {mistakeFrequency}%</Label>
        <Slider
          value={[mistakeFrequency]}
          onValueChange={(value) => setMistakeFrequency(value[0])}
          min={0}
          max={10}
          step={1}
        />
      </div>

      <div className="mb-4">
        <Label>Pause Duration: {pauseLabels[pauseDuration - 1]}</Label>
        <Slider
          value={[pauseDuration]}
          onValueChange={(value) => setPauseDuration(value[0])}
          min={1}
          max={10}
          step={1}
        />
      </div>

      <Button onClick={simulateTyping} disabled={isTyping}>
        {isTyping ? 'Typing...' : 'Start Typing'}
      </Button>

      <div className="mt-4">
        <Label>Status:</Label>
        <div className="border p-2 rounded">{status}</div>
      </div>

      <div className="mt-4">
        <Label>Output:</Label>
        <div className="border p-2 rounded h-32 overflow-auto whitespace-pre-wrap">
          {outputText}
        </div>
      </div>
    </div>
  );
};

export default TypingSimulator;