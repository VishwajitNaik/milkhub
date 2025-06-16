'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Drawer from '../components/Models/drawerMoldel';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import AvakDudhNond from './AvakDudhachiNondani/page';
import AddUserMilk from "../components/AddUserMilk";
import VikriMilk from '../components/VikriMilk';
import AddUserOrder from '@/app/components/MObileView/AddUserOrder.js';
import AddUserAdvance from '@/app/components/MObileView/AddUserAdvance';
import BillKapat from "../components/MObileView/BillKapat.js"
import AddUcchal from '@/app/components/MObileView/UcchalMobile.js';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const dropdownRef = useRef(null);

  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get('/api/owner/logout');
      router.push('/');
    } catch (error) {
      console.log('Logout failed: ', error.message);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const dropdownItems = {
    माहिती_भरणे: [
      { href: "/home/GetKapat", label: "कपाती पाहणे " },
      { href: "/home/Rates/AddRates", label: "दरपत्रक भरणे " },
      { href: "/home/SthirKapat", label: " कपातीचे नावे भरणे " },
      { href: "/home/DefaultSNF", label: "फिक्स SNF" },
      { href: "/home/AnimalDetails/Animalinfo", label: "जनावर भरणे" },
      { href: "/home/AnimalDetails/GetAnimalDetails", label: "जनावर यादी" },

    ],
    रीपोर्ट: [
      { href: "/home/Sabhasad_List", label: "उत्पादकाची यादी " },
      { href: "/home/BillData", label: "बील पेमेंट " },
      { href: "/home/Rates/GetRates", label: "दर पत्रक पाहणे  " },
      { href: "/home/AddOwnerOrders", label: "ऑर्डर करणे " },
      { href: "/home/GetAllUcchal", label: "सर्व उत्पादक उच्चल पाहणे" },
      { href: "/home/UchhalKapat", label: "सर्व उत्पादक उच्चल कपात पाहणे" },
      { href: "/home/orders/getOwnerOrders", label: "संघ ऑर्डर पाहणे " },

      { href: "/home/DateWiseAllOrders", label: "सर्व उत्पादक ऑर्डर पाहणे" },
      { href: "/home/AdvanceSabhasad_List", label: "सभासद अडवांस पाहणे " },
      { href: "/home/BillKapatSabhasad_List", label: "बिल कपात पाहणे " },
      { href: "/home/AllUserBillKapat", label: "सर्व सभासद कपात पाहणे  " },
      { href: "/home/AllUserAdvance", label: "सर्व सभासद अडवांस पाहणे " },

    ],
    इतर: [
      { href: "/home/Ucchal_sabhsad", label: "उच्चल सभासद बाकी पाहणे" },
      { href: "/home/AllUserOrders", label: "सर्व उत्पादक बाकी पाहणे" },
      { href: "/home/milkRecords/OnwerBills", label: "संघ बिल पाहणे" },
      { href: "/home/Docter/DocterVisits", label: " डॉक्टर व्हिजिट पाहणे " },
      { href: "/home/AnimalDetails/Allanimals", label: "सर्व उत्पादक जनावर पाहणे" },
      { href: "/home/Docter/GetDocterVisit", label: "डॉक्टर सेवा मागणी " },
      { href: "/home/Analysis/Milk", label: "दूध विश्लेषण" },
      { href: "/home/Analysis/Orders", label: "ऑर्डर विश्लेषण" }
    ],
  };

  const mobileComponents = [
        {
      component: 'VikriMilk',
      label: 'vikriMilk',
      icon: '/assets/vikrimilk.png' // Path to ucchal icon
    },
    {
      component: 'AddUserOrder',
      label: 'ऑर्डर भरणे',
      icon: '/assets/orders.png' // Path to order icon
    },
    {
      component: 'AddUserAdvance',
      label: 'अडवांस भरणे',
      icon: '/assets/advance.png' // Path to advance icon
    },
    {
      component: 'BillKapat',
      label: 'बिल कपात',
      icon: '/assets/kharedi_kapat.png' // Path to bill kapat icon
    },
    {
      component: 'AddUcchal',
      label: 'उच्चल भरणे',
      icon: '/assets/ucchal.png' // Path to ucchal icon
    }

  ];


  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'VikriMilk':
        return <VikriMilk />;
      case 'AddUserOrder':
        return <AddUserOrder />;
      case 'AddUserAdvance':
        return <AddUserAdvance />;
      case 'BillKapat':
        return <BillKapat />;
      case 'AddUcchal':
        return <AddUcchal />;
      default:
        return null;
    }
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
        className="bg-gradient-to-r from-gray-800 to-gray-900 bg-opacity-90 backdrop-blur-md text-white shadow-lg"
        style={{ position: 'sticky', top: 0, zIndex: 40 }}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Drawer Toggle Button */}
            <div className="flex items-center">
              <button
                onClick={toggleDrawer}
                className="text-xl font-bold cursor-pointer hover:bg-gray-700 p-2 rounded-full transition duration-300"
              >
                <FontAwesomeIcon icon={faBars} size="lg" />
              </button>
            </div>

            {/* Dropdown Menu */}
            <div className="flex flex-row" ref={dropdownRef}>
              {Object.keys(dropdownItems).map((menu) => (
                <div key={menu} className="relative -ml-2">
                  <button
                    onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                    className="hover:bg-blue-600 px-4 sm:px-8 py-2 sm:mr-4 rounded-md text-sm font-medium border-b border-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
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

            {/* Right Side (Avatar and Logout) */}
            <div className="flex items-center space-x-8">
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white transition duration-300 ease-in-out transform hover:scale-110"
              >
                <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
              </button>
              <Link
                href="/home/updateDetails/OnwerUpdate"
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
            </div>
          </div>
        </div>
      </nav>

      <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} />

      {/* Mobile View */}
      <div className="md:hidden">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover absolute top-0 left-0 opacity-20 -z-10"
        >
          <source src="/assets/milk.mp4" type="video/mp4" />
        </video>

        {/* Always show AddUserMilk at the top */}
        <div className="p-4">
          <AddUserMilk />
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap justify-center gap-2 p-4">
          {mobileComponents.map((item) => (
            <button
              key={item.component}
              onClick={() => setActiveComponent(activeComponent === item.component ? null : item.component)}
              className={`px-4 py-2 mt-4 rounded-lg text-white`}
            >
              <div className='flex flex-col'>
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={100}
                  height={100}
                  className="inline-block mr-2"
                />
                {item.label}
              </div>
            </button>
          ))}
        </div>

        {/* Render the active component below buttons if selected */}
        {activeComponent && (
          <div className="p-4">
            {renderActiveComponent()}
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <AvakDudhNond />
      </div>
    </>
  );
}