import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Tooltip } from 'flowbite' 

const Navbar = () => {
  const navigate = useNavigate();

  //Makes it so that the tooltip is consistent
  useEffect(() => {
    const $targetE1 = document.getElementById('tooltip-logout');
    const $triggerE1 = document.querySelector('[data-tooltip-target="tooltip-logout"]');

    if($targetE1 && $triggerE1) {
      new Tooltip($targetE1, $triggerE1);
    }
  }, []);

  const handleLogout = async() => {
    console.log("Button has been clicked");

    try {
      const response = await fetch("http://localhost:5175/api/user/logout", {
        credentials: 'include'
      });

      if(response.ok) {
        navigate("/login");
      }

    } catch(error) {
      console.error(error);
    }
  }

  return (
    <div className='font-montagu'>
      <div className='w-full flex relative items-center text-center py-4 bg-btn mb-2'>
        <Link to="/" className='absolute left-1/2 transform -translate-x-1/2 text-white 
        text-4xl cursor-pointer'>Fishbook</Link>
        <img 
          src='/images/logout.png' 
          onClick={handleLogout} 
          className='bg-white w-10 h-10 ml-auto mr-8 rounded-3xl p-1
                      cursor-pointer pointer-events-auto
                      hover:bg-gray-100'
          data-tooltip-target='tooltip-logout'/>

          {/* Tooltip */}
          <div
            id="tooltip-logout" 
            role="tooltip" 
            className="absolute z-10 invisible 
                       inline-block px-3 py-2 text-sm 
                       font-medium text-btn 
                       bg-white rounded-lg shadow-sm 
                       opacity-0 transition-opacity 
                       duration-300 tooltip">
            Click to Logout
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
      </div>
    </div>
  )
}

export default Navbar