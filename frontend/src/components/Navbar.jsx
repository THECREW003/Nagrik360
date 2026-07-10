import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/report", label: "Lodge Grievance" },
    { to: "/track", label: "Track Status" },
    { to: "/profile", label: "Directory" },
  ];

  return (
    <header
      className="bg-white border-b border-gray-300 sticky top-0 z-50"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-2xl text-[#0f172a]">🏛️</span>
          <span className="text-lg font-bold text-[#0f172a]">Nagarik360</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`font-mono text-[11px] tracking-widest uppercase pb-1 ${
                  isActive
                    ? "text-[#0f172a] border-b-2 border-[#0f172a]"
                    : "text-gray-500 hover:text-[#0f172a]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link to="/login" className="text-xl text-[#0f172a]">
            👤
          </Link>
        </nav>
      </div>
    </header>
  );
}