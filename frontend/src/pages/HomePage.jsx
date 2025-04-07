import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import useAuth from '../hook/useAuth';
import Navbar from '../components/Navbar';
import useAuthStore from '../stores/useAuthStore';
import Post from '../components/Post';
import { User } from '../../../backend/src/models/User';

const HomePage = () => {
  const [user, setUser] = useState("Test");

  useAuth();

  useEffect(() => {
    const getUser = async() => {
      try {
        const response = await fetch("http://localhost:5175/api/user/", {
          credentials: "include"
        });

        const data = await response.json();

        if(response.ok) {
          setUser(data.username);
        }
      } catch(error) {
        console.error("Session check failed", error);
      }
    }

    getUser();
  }, [])

  return (
    <div className='content-center bg-background font-montagu text-center'>
      <Navbar />

    {user && 
      <div>
        <div className='flex justify-center w-full pb-5'>
          <div className='w-full max-w-3xl'>
            <div className='flex items-center gap-4 rounded-lg drop-shadow-xl py-6 bg-white px-4'>
              <div className='w-12 flex-shrink-0'>
                <Link to={`/profile/${user}`}>
                  <img src="/images/fishBackground.jpg" alt="" className='w-12 h-12 rounded-4xl cursor-pointer'/>
                </Link>
              </div>
              <button className='py-3 bg-btn rounded-xl text-white px-5 sm:text-2xl
                cursor-pointer sm:pr-15
                min-w-[670px] max-w-[670px] text-center truncate'>What's swimming through your mind, {user}?</button>
            </div>
          </div>
        </div>

        <Post User="test" Img="images/post_sample.jpg" DateUpload={Date.now()} ProfilePic="images/fishBackground.jpg"/>
        <Post User={user} Img="images/fishBackground.jpg" DateUpload={Date.now()} ProfilePic="images/fishBackground.jpg"/>
      </div>
    }

    </div>
  )
}

export default HomePage