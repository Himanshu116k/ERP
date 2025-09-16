import React from 'react';
import { IoHome } from "react-icons/io5";
import { IoIosContact } from "react-icons/io";
import { FcAbout } from "react-icons/fc";

const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-16 z-50 
                    bg-blue-400/10 backdrop-blur-md 
                    shadow-lg border-b border-amber-300">
      <div className="flex justify-between items-center px-10 h-full">
        
        {/* Logo */}
        <div className="text-3xl font-bold text-white tracking-wide">
          <h1 className="hover:text-amber-300 transition-colors duration-300 cursor-pointer">
            ERP
            
          </h1>
          
        </div>

        {/* Menu */}
        <ul className="flex items-center gap-10 text-lg font-medium">
          
         
          <li className="relative cursor-pointer flex items-center gap-2 
                         text-white hover:text-amber-300 transition duration-300">
            <span className=""></span>
           
          </li>
          <li className="group relative cursor-pointer flex items-center gap-2 
                         text-white hover:text-amber-300 transition duration-300">
            <span className="group-hover:hidden">Home</span>
            <IoHome className="hidden group-hover:block text-2xl" />
          </li>

          <li className="group relative cursor-pointer flex items-center gap-2 
                         text-white hover:text-amber-300 transition duration-300">
            <span className="group-hover:hidden">About</span>
            <FcAbout className="hidden group-hover:block text-2xl" />
          </li>

          <li className="group relative cursor-pointer flex items-center gap-2 
                         text-white hover:text-amber-300 transition duration-300">
            <span className="group-hover:hidden">Contact</span>
            <IoIosContact className="hidden group-hover:block text-2xl" />
          </li>

        </ul>
      </div>
    </div>
  );
};

export default Navbar;
