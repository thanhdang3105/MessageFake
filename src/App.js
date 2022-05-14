import Login from './components/Login';
import ChatRoom from './components/Chatroom';
import { Route, Routes, BrowserRouter, HashRouter } from 'react-router-dom'
import AuthProvider from './context/AuthProvider';
import AppProvider from './context/AppProvider';
import './App.css'

function App() {

  return (
    <div className="App">
      <HashRouter basename='/MessageFake' hashType>
      <AuthProvider>
        <AppProvider>
          <Routes>
              <Route path="/" element={<ChatRoom />} />
              <Route path="/login" element={<Login />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
      </HashRouter>
    </div>
  );
}

export default App;