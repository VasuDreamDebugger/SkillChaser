import React, { useContext, useEffect, useState, useRef } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { SignIn, useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext.js";
import axios from "axios";
import { toast } from "react-hot-toast";

const NavBar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { isEducator, getToken, setIsEducator, backendUrl } =
    useContext(AppContext);
  const isCourseListPage = location.pathname.includes("/course-list");

  const logoRef = useRef(null);
  const runnerRef = useRef(null);
  const eduBtnRef = useRef(null);
  const [runnerVisible, setRunnerVisible] = useState(true);
  const [sprinting, setSprinting] = useState(false);

  // when user logs in, trigger a subtle sprint animation once
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  useEffect(() => {
    if (user && !hasLoggedIn) {
      // delay slightly so UI settles
      const t = setTimeout(() => setHasLoggedIn(true), 300);
      return () => clearTimeout(t);
    }
  }, [user, hasLoggedIn]);

  // When hasLoggedIn becomes true, trigger the sprint animation once
  useEffect(() => {
    if (!hasLoggedIn) return;
    // compute target position and run sprint
    const run = async () => {
      if (!runnerRef.current || !eduBtnRef.current || !logoRef.current) return;
      try {
        const runnerRect = runnerRef.current.getBoundingClientRect();
        const btnRect = eduBtnRef.current.getBoundingClientRect();
        const containerRect = logoRef.current.getBoundingClientRect();
        // compute delta relative to runner's current container (we'll move runner via transform)
        const runnerCenter = runnerRect.left + runnerRect.width / 2;
        const btnCenter = btnRect.left + btnRect.width / 2;
        const deltaX = btnCenter - runnerCenter;

        // begin sprint
        setSprinting(true);
        // enable transition and move
        runnerRef.current.style.transition =
          "transform 1.3s cubic-bezier(.18,.82,.3,1)";
        runnerRef.current.style.transform = `translateX(${deltaX}px)`;

        // animate particles by toggling display; simple approach: make them visible then animate via inline styles
        const particles = runnerRef.current.querySelectorAll(".particle");
        particles.forEach((p, i) => {
          // random direction
          const px = (Math.random() * 60 + 30) * (i % 2 === 0 ? 1 : -1);
          const py = -(Math.random() * 30 + 10);
          p.style.setProperty("--px", px + "px");
          p.style.setProperty("--py", py + "px");
          p.style.display = "block";
          p.style.animation = `particleFly 900ms ease-out forwards`;
        });

        // after transition ends, hide runner (so it appears to land on button) then reset back after a moment
        const onTransEnd = () => {
          runnerRef.current.removeEventListener("transitionend", onTransEnd);
          // hide runner at target
          setRunnerVisible(false);
          setTimeout(() => {
            // reset transform and particles
            runnerRef.current.style.transition = "none";
            runnerRef.current.style.transform = "translateX(0px)";
            particles.forEach((p) => {
              p.style.display = "none";
              p.style.animation = "";
            });
            // show runner back at original pos
            setRunnerVisible(true);
            setSprinting(false);
          }, 600);
        };

        runnerRef.current.addEventListener("transitionend", onTransEnd);
      } catch (err) {
        console.error("Sprint error:", err);
        setSprinting(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoggedIn]);

  const becomeEducator = async () => {
    console.log("become edu clicked");
    try {
      if (!user) {
        toast.error("Please sign in to become an educator");
        //openSignIn();
        return;
      }
      if (user.publicMetadata.role === "educator") {
        navigate("/educator");
      } else {
        const token = await getToken();
        const { data } = await axios.post(
          backendUrl + "/api/educator/update-role",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.message) {
          setIsEducator(true);
          toast.success(data.message || "You are now an educator");
          navigate("/educator");
        } else {
          toast.error(data.error || "Failed to become educator");
        }
      }
    } catch (error) {
      console.log("Error in becoming educator:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        "Error in becoming educator";
      toast.error(errorMsg);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-5 border-b border-gray-500 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      } py-4`}
    >
      {/* Logo: Skill (static gradient) + Chaser (animated letters) + runner emoji */}
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

      <div>
        {/* For Desktop view */}
        <div className="hidden md:flex items-center gap-5 text-gray-500">
          <div className="flex items-center gap-2">
            <button
              ref={eduBtnRef}
              onClick={() => becomeEducator()}
              className="cursor-pointer"
            >
              {isEducator ? "Educator Dashboard" : "Become Educator"}{" "}
            </button>
            |{" "}
            {user && (
              <span className=" ">
                <Link to="/my-enrollments"> My Enrollments</Link>
              </span>
            )}
          </div>
          {user ? (
            <UserButton />
          ) : (
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-white hover:text-blue-600"
              onClick={() => openSignIn()}
            >
              Get Account
            </button>
          )}
        </div>

        {/* For Mobile view */}
        <div className="flex md:hidden items-center gap-2 text-gray-600 ">
          <div className="flex items-center gap-2">
            <button onClick={() => becomeEducator()}>Become Educator </button>|
            <Link to="/my-enrollments" className="hidden">
              {" "}
              My Enrollments
            </Link>
          </div>
          {user ? (
            <UserButton />
          ) : (
            <button onClick={() => openSignIn()}>
              <img src={assets.user_icon} alt="userIcon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
