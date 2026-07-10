import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ComplaintForm from "./pages/ComplaintForm";
import Profile from "./pages/Profile";
import Demo from "./pages/Demo";
import AdminDashboard from "./pages/admin/Dashboard";
import TrackingPage from "./pages/TrackingPage";
import WelcomeBanner from './components/WelcomeBanner';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report" element={<ComplaintForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/track" element={<TrackingPage />} />
        </Routes>
       
        <Footer />
      </div>
    </BrowserRouter>
  );
}