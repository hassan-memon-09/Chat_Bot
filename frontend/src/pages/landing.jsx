// pages/Landing.jsx
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Smart ChatBot</h1>
      <p className="text-lg mb-8">Your AI Assistant powered by Gemini API</p>
      <button
        onClick={() => navigate('/chat')}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
      >
        Get Started
      </button>
    </div>
  );
}
