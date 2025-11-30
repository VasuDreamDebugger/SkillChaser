import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      <div
        className="flex flex-col md:flex-row items-start px-8 md:px-0 
      justify-center gap-5 md:gap-20 py-5 border-b border-white/30"
      >
        <div className="flex flex-col md:items-start items-center w-full">
          <style>{`\n            @keyframes footerRunner {\n              0% { transform: translateY(0) rotate(0deg); }\n              50% { transform: translateY(-4px) rotate(4deg); }\n              100% { transform: translateY(0) rotate(0deg); }\n            }\n            .footer-logo-emoji { display:inline-block; animation: footerRunner 1.6s ease-in-out infinite; }\n          `}</style>

          <Link to="/" className="no-underline">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:scale-105 hover:shadow-lg transition-transform">
              <span>SkillChaser</span>
              <span className="footer-logo-emoji" aria-hidden>
                🏃‍➡️
              </span>
            </div>
          </Link>

          <p className="mt-6 text-center md:text-left text-sm text-white/80">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
          </p>
        </div>
        <div className="flex flex-col md:items-start items-center w-full text-white/80">
          <h2 className="font-semibold mb-5">Company</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm  md:space-y-2">
            <Link>Home</Link>
            <Link>About Us</Link>
            <Link>Contact Us</Link>
            <Link>Privacy Policy</Link>
          </ul>
        </div>
        <div className="hidden md:flex flex-col items-start w-full text-white/80">
          <h2 className="font-semibold mb-5">Subscribe to our newsletter</h2>
          <p className="text-sm">
            the latest news,articles,and resources,sent to your inbox weekly
          </p>
          <div className="flex gap-3 items-center mt-5">
            <input
              type="email"
              placeholder="Enter email"
              className="border border-gray-500/30 bg-gray-800 text-gray-500  outline-none w-64 h-9 rounded px-2 text-sm"
            />
            <button className="bg-blue-600 w-24 h-9 text-white/80 rounded">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-sm text-white/80">
        Copyright 2025 © AuralisLMS. All Rights Reversed
      </p>
    </footer>
  );
};

export default Footer;
