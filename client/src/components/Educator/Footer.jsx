import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t">
      <div>
        <style>{`\n          @keyframes eduFooterRunner {\n            0% { transform: translateY(0) rotate(0deg); }\n            50% { transform: translateY(-3px) rotate(3deg); }\n            100% { transform: translateY(0) rotate(0deg); }\n          }\n          .edu-footer-emoji { display:inline-block; animation: eduFooterRunner 1.6s ease-in-out infinite; }\n        `}</style>

        <div className="hidden md:block">
          <Link to="/" className="no-underline">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-3 py-1 rounded-md shadow-md hover:scale-105 transition-transform">
              <span>SkillChaser</span>
              <span className="edu-footer-emoji" aria-hidden>
                🏃‍➡️
              </span>
            </div>
          </Link>
        </div>
        <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>

        <p className="py-4 text-center text-xs md:text-sm text-gray-500">
          Copyright 2025 © AuralisLMS.All Rights Reversed.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
