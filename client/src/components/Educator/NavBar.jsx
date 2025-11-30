import React, { useEffect, useState, useRef } from "react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();
  const navigate = useNavigate();

  const logoRef = useRef(null);
  const runnerRef = useRef(null);
  const [runnerVisible, setRunnerVisible] = useState(true);
  const [sprinting, setSprinting] = useState(false);
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate("/")}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate("/")}
        className="flex items-center gap-3 cursor-pointer select-none skill-logo"
        aria-label="Go to home"
        ref={(el) => (logoRef.current = el)}
      >
        <style>{`
          /* Gradient skim animation reused for both Skill & Chaser */
          @keyframes gradientSkim {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Chaser letter vertical bounce */
          @keyframes chaserBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }

          /* Runner idle subtle back-and-forth */
          @keyframes runnerIdle {
            0% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(6px) translateY(-2px); }
            100% { transform: translateX(0) translateY(0); }
          }

          /* Particle burst during sprint */
          @keyframes particleFly {
            0% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
            100% { transform: translateX(var(--px)) translateY(var(--py)) scale(0.3); opacity: 0; }
          }

          /* SKILL text: bold, smooth sans, animated gradient */
          .skill-text {
            background: linear-gradient(90deg, #0ea5e9, #3b82f6, #ef731bff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            background-size: 220% 220%;
            animation: gradientSkim 6s linear infinite;
            font-weight: 700;
            letter-spacing: 0.05em;
             font-family: Cursive;
          }

          .chaser {
            display: inline-flex;
            gap: 0.08rem;
          }

          /* Outer wrapper: bounce animation only */
          .chaser-letter {
            display: inline-block;
            animation: chaserBounce 950ms ease-in-out infinite;
            animation-fill-mode: both;
          }

          /* Inner span: gradient skim + custom font, NOT paused on hover */
          .chaser-letter-inner {
            display: inline-block;
            background: linear-gradient(120deg, #e3e4d9ff, #f05d0eff, #dcefecff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            background-size: 240% 240%;
            animation: gradientSkim 5s linear infinite;
            font-weight: 700;
            letter-spacing: 0.04em;
            font-family: Georgia, 'Times New Roman', serif;
          }

          .runner {
            display: inline-block;
            margin-left: 0px;
            font-size: 1.7rem; /* bigger emoji size */
            line-height: 1;
            transform-origin: center;
            animation: runnerIdle 1.6s ease-in-out infinite;
          }

          /* Particle style */
          .particle {
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 999px;
            pointer-events: none;
            opacity: 0;
          }

          /* Pause only Chaser bounce + runner idle on hover; Skill & Chaser gradients stay moving */
          .skill-logo:hover .chaser-letter,
          .skill-logo:hover .runner {
            animation-play-state: paused !important;
          }
        `}</style>

        <div className="flex items-center gap-0 relative">
          {/* SKILL text */}
          <span className="skill-text text-xl md:text-4xl">Skill</span>

          {/* CHASER text with bounce + gradient skim per letter */}
          <span className="chaser text-xl md:text-3xl" aria-hidden>
            {"Chaser".split("").map((ch, i) => (
              <span
                key={i}
                className="chaser-letter"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="chaser-letter-inner">{ch}</span>
              </span>
            ))}
          </span>

          {/* Runner emoji with larger size + particles */}
          <span
            ref={runnerRef}
            className="runner"
            aria-hidden
            style={{
              position: "relative",
              display: runnerVisible ? "inline-block" : "none",
            }}
          >
            🏃‍➡️
            {/* particle container positioned relative to runner */}
            <span
              className="particles"
              style={{ position: "absolute", left: 0, top: "-6px" }}
            >
              {[0, 1, 2, 3].map((p) => (
                <span
                  key={p}
                  className="particle"
                  style={{
                    background: "rgba(59,130,246,0.9)",
                    transform: "translate(0,0)",
                    display: sprinting ? "block" : "none",
                  }}
                />
              ))}
            </span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi..! {user ? user.fullName : "Educator"}</p>
        {user ? (
          <UserButton />
        ) : (
          <img src={assets.user_icon} alt="icon" className="max-w-8" />
        )}
      </div>
    </div>
  );
};

export default NavBar;
