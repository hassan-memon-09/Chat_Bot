// pages/Chat.jsx
import { useState } from 'react';
import axios from 'axios';

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = { role: 'user', content: input };
    setMessages([...messages, newMsg]);
    setInput('');

    const res = await axios.post('http://localhost:3000/chat', { prompt: input });
    setMessages(prev => [...prev, { role: 'model', content: res.data.response }]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-800 text-white">
      <header className="p-4 text-center font-bold text-2xl border-b border-gray-600">ChatBot</header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-xl ${
              msg.role === 'user' ? 'bg-blue-600 self-end' : 'bg-gray-600 self-start'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </main>

      <footer className="p-4 border-t border-gray-600 flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Send
        </button>
      </footer>
    </div>
  );
}
