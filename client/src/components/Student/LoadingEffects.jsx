import React from "react";

// Home Page - Animated Books Loading
export const HomePageLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="relative w-32 h-40">
        {/* Animated Books */}
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-8 h-24 bg-gradient-to-b from-blue-400 to-blue-600 rounded transform"
              style={{
                animation: `bookBounce 1.5s ease-in-out ${i * 0.3}s infinite`,
                transformOrigin: "center bottom",
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes bookBounce {
          0%, 100% {
            transform: translateY(0px) rotateZ(-5deg);
          }
          25% {
            transform: translateY(-30px) rotateZ(0deg);
          }
          50% {
            transform: translateY(0px) rotateZ(5deg);
          }
          75% {
            transform: translateY(-15px) rotateZ(-3deg);
          }
        }
      `}</style>
      <p className="mt-12 text-gray-600 font-semibold">
        Loading your courses...
      </p>
      <p className="text-sm text-gray-500 mt-2">
        📚 Don't worry, knowledge is worth the wait!
      </p>
    </div>
  );
};

// Course List - Jumping Search Icon
export const CourseListLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-cyan-50 to-blue-50">
      <div className="relative w-40 h-32">
        {/* Search icon animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🔍</div>
        </div>
      </div>
      <p className="mt-8 text-gray-700 font-semibold text-lg">
        Searching for amazing courses...
      </p>
      <div className="flex gap-1 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full"
            style={{
              animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.5);
          }
        }
      `}</style>
      <p className="text-sm text-gray-500 mt-4">
        🎯 Found it yet? Just a moment...
      </p>
    </div>
  );
};

// Course Details - Expanding Cards Animation
export const CourseDetailsLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-48 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg shadow-lg"
            style={{
              animation: `expandShrink 2s ease-in-out ${i * 0.4}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes expandShrink {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <p className="mt-12 text-gray-700 font-semibold text-lg">
        Loading course details...
      </p>
      <p className="text-sm text-gray-500 mt-2">
        ✨ Getting ready to blow your mind...
      </p>
    </div>
  );
};

// My Enrollments - Rolling Progress Bars
export const MyEnrollmentsLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 p-4">
      <div className="w-full max-w-2xl space-y-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                style={{
                  animation: `slideIn 2s ease-in-out ${i * 0.3}s infinite`,
                  transformOrigin: "left",
                }}
              />
            </div>
            <div className="h-6 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
      <p className="mt-12 text-gray-700 font-semibold text-lg">
        Tracking your progress...
      </p>
      <p className="text-sm text-gray-500 mt-2">📈 You're doing amazing!</p>
    </div>
  );
};

// Player Page - Playing Video Animation
export const PlayerLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <div className="relative w-40 h-40 mb-8">
        {/* Play button animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-8xl animate-pulse">▶️</div>
        </div>
        {/* Spinning ring around play button */}
        <div
          className="absolute inset-0 border-4 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full"
          style={{
            animation: `spin 1.5s linear infinite`,
          }}
        />
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p className="text-gray-700 font-semibold text-lg">
        Preparing your video...
      </p>
      <p className="text-sm text-gray-500 mt-2">
        🎬 Let's learn something awesome!
      </p>
    </div>
  );
};

// Dashboard Page - Animated Metrics
export const DashboardLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-red-50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-32 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg shadow-lg border-2 border-orange-300"
            style={{
              animation: `floatUp 2s ease-in-out ${i * 0.4}s infinite`,
            }}
          >
            <div className="h-full flex items-center justify-center text-4xl">
              {i === 0 ? "👥" : i === 1 ? "📚" : "💰"}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes floatUp {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
      <p className="mt-12 text-gray-700 font-semibold text-lg">
        Loading your dashboard...
      </p>
      <p className="text-sm text-gray-500 mt-2">
        📊 Your success stats are being calculated...
      </p>
    </div>
  );
};

// My Courses (Educator) - Spinning Cards
export const MyCoursesLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-teal-50 to-cyan-50">
      <div className="relative w-64 h-48 mb-8">
        {/* 3D Spinning cards effect */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 h-48 w-64 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-lg shadow-xl"
            style={{
              animation: `rotate3D 3s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              transform: `rotateY(${i * 40}deg)`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes rotate3D {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: rotateY(360deg) rotateX(360deg);
            opacity: 1;
          }
        }
      `}</style>
      <p className="text-gray-700 font-semibold text-lg">
        Loading your courses...
      </p>
      <p className="text-sm text-gray-500 mt-2">
        📖 Your creations are on the way...
      </p>
    </div>
  );
};

// Students Enrolled (Educator) - Animated Users
export const StudentsEnrolledLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 p-4">
      <div className="flex items-center justify-center gap-4 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-16 h-16 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full shadow-lg flex items-center justify-center text-2xl"
            style={{
              animation: `popIn 1.5s ease-in-out ${i * 0.3}s infinite`,
            }}
          >
            👤
          </div>
        ))}
      </div>
      <style>{`
        @keyframes popIn {
          0%, 100% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }
      `}</style>
      <p className="text-gray-700 font-semibold text-lg">
        Loading enrolled students...
      </p>
      <p className="text-sm text-gray-500 mt-2">🎓 Your learners are here!</p>
    </div>
  );
};
