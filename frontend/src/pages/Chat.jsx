// pages/Chat.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaRobot, FaPaperPlane, FaCopy } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => alert('Code copied to clipboard!'),
      (err) => alert('Failed to copy code: ' + err),
    );
  };

  // Parse message to detect code blocks and structure text
  const parseMessage = (content) => {
    if (Array.isArray(content)) {
      // If backend returns structured response (array of lines)
      return content.map(line => ({ type: 'text', content: line }));
    }

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'text';
      const code = match[2].trim();
      const textBefore = content.slice(lastIndex, match.index).trim();
      if (textBefore) {
        parts.push(...textBefore.split('\n').filter(line => line.trim()).map(line => ({ type: 'text', content: line.trim() })));
      }
      parts.push({ type: 'code', language, content: code });
      lastIndex = match.index + match[0].length;
    }

    const textAfter = content.slice(lastIndex).trim();
    if (textAfter) {
      parts.push(...textAfter.split('\n').filter(line => line.trim()).map(line => ({ type: 'text', content: line.trim() })));
    }

    return parts.length ? parts : [{ type: 'text', content }];
  };

  const sendMessage = async () => {
    if (!input.trim()) {
      setError('Please enter a message');
      return;
    }

    const newMsg = { role: 'user', content: input, timestamp: new Date().toLocaleTimeString() };
    setMessages([...messages, newMsg]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/chat', { prompt: input });
      setMessages(prev => [
        ...prev,
        { role: 'model', content: res.data.response, timestamp: new Date().toLocaleTimeString() },
      ]);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to get response from server';
      setError(errorMsg.includes('503') ? 'Server is temporarily busy. Please try again later.' : errorMsg);
      setMessages(prev => [
        ...prev,
        { role: 'model', content: 'Error: Could not get response', timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white flex flex-col font-poppins">
      {/* Header */}
      <header className="p-4 text-center font-bold text-3xl md:text-4xl bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-md">
        <div className="flex items-center justify-center gap-2">
          <FaRobot className="text-blue-400 text-3xl" />
          <span>Smart ChatBot</span>
        </div>
        <p className="text-sm md:text-base text-gray-300 mt-2">Powered by Gemini AI</p>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-600/80 max-w-xl mx-auto animate-fade-in">
            {error}
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            } animate-fade-in max-w-3xl mx-auto`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div
              className={`p-4 rounded-xl max-w-[80%] md:max-w-[60%] shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {msg.role === 'model' && <FaRobot className="text-blue-400 text-lg" />}
                <span className="text-sm text-gray-300">
                  {msg.role === 'user' ? 'You' : 'Bot'} • {msg.timestamp}
                </span>
              </div>
              {parseMessage(msg.content).map((part, partIdx) => (
                <div key={partIdx} className="mt-2">
                  {part.type === 'text' ? (
                    <ul className="list-disc pl-5">
                      <li>{part.content}</li>
                    </ul>
                  ) : (
                    <div className="relative">
                      <SyntaxHighlighter
                        language={part.language}
                        style={vscDarkPlus}
                        customStyle={{
                          background: '#1f2937',
                          padding: '1rem',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                        }}
                        showLineNumbers
                      >
                        {part.content}
                      </SyntaxHighlighter>
                      <button
                        onClick={() => copyToClipboard(part.content)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
                        title="Copy code"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-gray-600/80 max-w-[80%] md:max-w-[60%] animate-pulse">
              <div className="flex items-center gap-2 mb-1">
                <FaRobot className="text-blue-400 text-lg" />
                <span className="text-sm text-gray-300">Bot • Typing...</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 flex gap-2 md:gap-4">
        <input
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-3 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 flex items-center gap-2"
          disabled={isLoading}
        >
          <FaPaperPlane className="text-lg" />
          <span>Send</span>
        </button>
      </footer>
    </div>
  );
}