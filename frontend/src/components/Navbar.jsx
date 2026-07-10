import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-semibold text-lg tracking-wide">
        Nagarik360
      </Link>
      <div className="flex gap-6 text-sm">
        <Link to="/" className="hover:text-blue-300">Home</Link>
        <Link to="/report" className="hover:text-blue-300">Report Issue</Link>
        <Link to="/track" className="hover:text-blue-300">Track Complaint</Link>
        <Link to="/profile" className="hover:text-blue-300">Profile</Link>
        <Link to="/login" className="hover:text-blue-300">Login</Link>
      </div>
    </nav>
  );
}