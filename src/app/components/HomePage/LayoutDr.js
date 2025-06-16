'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Drawer from '../../components/Models/drawerMoldel';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import axios from 'axios';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const dropdownRef = useRef(null);

  const router = useRouter();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const goToPreviousPage = () => {
    router.back(); // Navigate to the previous page
  };

  const goToNextPage = () => {
    router.forward(); // Navigate to the next page
  };

  const dropdownItems = {
    माहिती_भरणे: [
      { href: "/Docter/CompltedVisits", label: "Visits पाहणे " },
    ],
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav
        className="bg-gray-800 bg-opacity-70 backdrop-blur-md text-white"
        style={{ position: 'sticky', top: 0, zIndex: 40 }}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">

            {/* Dropdown Menu */}
            <div className="flex flex-row" ref={dropdownRef}>
              {Object.keys(dropdownItems).map((menu) => (
                <div key={menu} className="relative -ml-2">
                  <button
                    onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                    className="hover:bg-blue-600 px-4 ml-6 sm:px-8 py-2 sm:mr-4 rounded-md text-sm font-medium border-b border-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    {menu}
                  </button>
                  {activeMenu === menu && (
                    <div className="absolute left-0 w-48 py-2 mt-2 rounded-md rounded-b-md shadow-xl bg-gradient-to-b from-gray-700 to-gray-800">
                      {dropdownItems[menu].map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="block px-4 py-2 text-white text-sm hover:bg-gray-600 hover:text-white transition duration-200 ease-in-out"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Link
              href="/Docter/profile"
              className="hover:bg-gray-700 px-3 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-110"
            >
              <Image
                className="rounded-full border-2 border-gray-300 hover:border-white transition duration-300"
                src="/assets/avatar.png"
                alt="User"
                width={30}
                height={30}
              />
            </Link>

            {/* Previous and Next Page Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={goToPreviousPage}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                onClick={goToNextPage}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
    </>
  );
}
