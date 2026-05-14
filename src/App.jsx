import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HealthGenie from './pages/HealthGenie';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/genie" element={<HealthGenie />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Senthuranathan/healthgenie2.0.git
git push -u origin main