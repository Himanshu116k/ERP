import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaUserShield } from "react-icons/fa";
import Beams from "./Beams"; // 👈 import your Sentry background

export default function LoginPage() {
  const [role, setRole] = useState("student");
  const [myhue,setmyhue]=useState(0)

  const themes = {
    student: {
      icon: <FaUserGraduate className="text-6xl text-emerald-400" />,
      accent: "emerald",
      hue:7,
    },
    teacher: {
      icon: <FaChalkboardTeacher className="text-6xl text-blue-400" />,
      accent: "blue",
       hue:1.2,
    },
    staff: {
      icon: <FaUserTie className="text-6xl text-pink-400" />,
      accent: "pink",
       hue:0.029,
    },
    admin: {
      icon: <FaUserShield className="text-6xl text-purple-400" />,
      accent: "purple",
       hue:1,
    },
  };

  const currentTheme = themes[role];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Futuristic Background */}
      <div className="absolute inset-0 w-full">
<Beams
     animationType="rotate"
    timeScale={1}
    height={3.5}
    baseWidth={4}
    scale={3.6}
    hueShift={myhue}
    colorFrequency={2}
    noise={0.2}
    glow={1}
  />      </div>

      {/* Overlay for readability */}
      <div className="absolute inset-0 "></div>

      {/* Login Card */}
      <div className="relative z-10 flex justify-center items-center h-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 
                     shadow-2xl rounded-3xl p-8 sm:p-10 w-full max-w-md"
        >
          <div className="flex justify-center mb-4">{currentTheme.icon}</div>
          <h1 className="text-3xl font-bold text-white mb-6 capitalize tracking-wide text-center">
            {role} Login
          </h1>
          <a className="p" href="">here</a>

          {/* Role Switcher */}
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {Object.keys(themes).map((r) => (
              <button
                key={r}
                onClick={() => {setRole(r);
                    setmyhue(themes[r].hue);}
                }
                className={`px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all duration-300 ${
                  
                  role === r
                    ? "bg-white/30 scale-110 shadow-lg"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl bg-black/30 text-white 
                         placeholder-gray-400 border border-white/20 
                         focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-black/30 text-white 
                         placeholder-gray-400 border border-white/20 
                         focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.05 }}
              className={`w-full bg-${currentTheme.accent}-500/90 text-white 
                          font-semibold py-3 rounded-xl shadow-lg 
                          hover:bg-${currentTheme.accent}-400/90 transition border-2 border-gray-400`}
            >
              Login
            </motion.button>
          </form>

          <p className=" text-black text-xs mt-6 text-center">
            ERP Portal – Secure Login for{" "}
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
