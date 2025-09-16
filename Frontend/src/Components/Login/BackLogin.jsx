import React, { useState } from 'react'
import Navbar from './Navbar'
import axios from "axios";

const BackLogin = () => {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 👇 dynamic endpoint based on role
      const endpoint = `http://localhost:5000/${role}/login`;

      const response = await axios.post(endpoint, {
        email,
        password,
      });

      console.log("Login Success:", response.data);

      // Example: redirect to dashboard
      if (response.data.success) {
        window.location.href = `/${role}/dashboard`; 
      }
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Navbar />
      <img 
        className="h-screen w-full absolute top-0 left-0 -z-10 object-cover" 
        src="https://s3.amazonaws.com/info-mongodb-com/_com_assets/cms/kv6qz4v5ozumn6llm-Blog%20Header%204.png" 
        alt="background" 
      />

      <div className="flex justify-center items-center h-screen w-full gap-6 px-4">
        <img 
          className="h-[35vw] max-h-[300px] object-contain hidden md:block" 
          src="https://www.mongodb.com/docs/atlas/images/atlas-plp/atlas-plp-hero.svg" 
          alt="Atlas Left" 
        />

        {/* Glass Form */}
        <div className="w-[90%] sm:w-[400px] p-8 rounded-2xl shadow-lg 
                        bg-white/20 backdrop-blur-md border border-white/30 
                        text-white text-center">
          
          {/* Role Buttons */}
          <div className="flex justify-between mb-6">
            {["student", "teacher", "staff"].map((item) => (
              <button 
                key={item}
                onClick={() => setRole(item)}
                className={`w-full mx-1 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${role === item 
                    ? "bg-amber-400 text-black shadow-md" 
                    : "bg-white/20 text-white hover:bg-white/30"}`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-6">
            {role.charAt(0).toUpperCase() + role.slice(1)} Login
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5 text-left">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-amber-400" 
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-amber-400" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-2 rounded-lg bg-amber-400 text-black font-semibold 
                         hover:bg-amber-300 transition-all duration-300">
              Login
            </button>
             
          
             <span className='text-center'>Total line of code in this project:- <a href='#' className='text-red-500'>23200</a></span>
             
          </form>
        </div>

        <img 
          className="h-[35vw] max-h-[300px] object-contain hidden md:block" 
          src="https://webimages.mongodb.com/_com_assets/cms/kykgzd0sd3qiv9n36-atlas-hero.svg" 
          alt="Atlas Right" 
        />
      </div>
    </div>
  )
}

export default BackLogin
