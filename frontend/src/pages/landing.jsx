// pages/Landing.jsx
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaLanguage, FaBolt, FaComments } from 'react-icons/fa'; // Icons ke liye react-icons

export default function Landing() {
  const navigate = useNavigate();

  // Features data for cards
  const features = [
    {
      icon: <FaRobot className="text-4xl text-blue-400" />,
      title: 'AI-Powered Chat',
      description: 'Experience intelligent conversations with our Gemini AI-powered chatbot.',
    },
    {
      icon: <FaLanguage className="text-4xl text-blue-400" />,
      title: 'Multi-Language Support',
      description: 'Chat in multiple languages with seamless translation capabilities.',
    },
    {
      icon: <FaBolt className="text-4xl text-blue-400" />,
      title: 'Fast Responses',
      description: 'Get instant answers to your queries with minimal wait time.',
    },
    {
      icon: <FaComments className="text-4xl text-blue-400" />,
      title: 'User-Friendly Interface',
      description: 'Enjoy a clean and intuitive UI designed for all users.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white flex flex-col">
      {/* Header Section */}
      <header className="flex flex-col items-center justify-center text-center py-16 px-4 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
          Smart ChatBot
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 animate-fade-in delay-200">
          Your ultimate AI assistant powered by Gemini API. Ask anything, get instant responses,
          and enjoy a seamless chat experience tailored to your needs.
        </p>
        <button
          onClick={() => navigate('/chat')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105"
        >
          Get Started
        </button>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
          Why Choose Our ChatBot?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-center mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer (Optional) */}
      <footer className="py-8 text-center text-gray-400">
        <p>© 2025 Smart ChatBot. Powered by Gemini API.</p>
      </footer>
    </div>
  );
}