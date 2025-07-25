// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Chat from './pages/Chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
