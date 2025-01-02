import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:hidden flex justify-between items-center bg-gray-800 text-white p-4">
        <div className="text-2xl font-bold">Iki Menu Rung Dadi</div>
        <button onClick={toggleNavbar} className="focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
            ></path>
          </svg>
        </button>
      </div>
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:block h-full w-48 bg-gray-800 text-white flex flex-col sticky top-0`}
      >
        <div className="p-4 text-2xl font-bold">Iki Menu Rung Dadi</div>
        <nav className="flex flex-col p-4 flex-grow">
          <Link to="/" className="py-2 px-4 hover:bg-gray-700 rounded">
            Dashboard
          </Link>
          <Link to="/menu2" className="py-2 px-4 hover:bg-gray-700 rounded">
            Menu 2
          </Link>
          <Link to="/menu3" className="py-2 px-4 hover:bg-gray-700 rounded">
            Menu 3
          </Link>
        </nav>
        <div className="p-4 mt-auto">
          © HELLYEAH © 2025
        </div>
      </div>
    </div>
  );
};

export default Navbar;