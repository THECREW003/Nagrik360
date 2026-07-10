import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="bg-[#0f172a] text-gray-300 mt-auto border-t-4 border-[#138808]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-6 text-xs">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 text-center">
          <Link to="/privacy" className="hover:text-white hover:underline">
            Privacy Policy
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/terms" className="hover:text-white hover:underline">
            Terms of Service
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/helpdesk" className="hover:text-white hover:underline">
            Helpdesk
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/accessibility" className="hover:text-white hover:underline">
            Accessibility Statement
          </Link>
        </div>
        <p className="text-center text-gray-400 mb-1">
          © 2026 Nagarik360. All rights reserved. Content owned, maintained
          and updated by the respective Municipal Department.
        </p>
        <p className="text-center text-gray-500">
          This is a citizen grievance redressal portal developed for
          demonstration purposes.
        </p>
      </div>
    </footer>
  );
}