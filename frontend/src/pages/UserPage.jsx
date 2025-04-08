import React, { useState, useEffect } from 'react'
import Post from '../components/Post';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const UserPage = () => {
  const { username } = useParams();

  return (
    <div className=' bg-background min-h-screen font-montagu'>
      <Navbar />
      <div className='flex w-full justify-center pt-4 sm:px-16'>
        <div className='block w-full max-w-3xl justify-center'>
          <div className='block sm:flex w-full'>
            <div className='flex justify-center'>
              <div className='w-40 flex-shrink-0'>
                <img src="/images/fishBackground.jpg" className='w-40 h-40 rounded-full' />
              </div>
            </div>
            <div className='block w-full text-center sm:ml-5 px-3'>
              <div className='sm:px-10 py-5 flex justify-evenly sm:gap-10'>
                <div className='block'>
                  <p className='text-xl sm:text-2xl'>2</p>
                  <p className='text-xl sm:text-2xl text-[#4B4B4B]'>Casts</p>
                </div>
                <div className='block'>
                  <p className='text-xl sm:text-2xl'>100</p>
                  <p className='text-xl sm:text-2xl text-[#4B4B4B]'>Hookers</p>
                </div>
                <div className='block'>
                  <p className='text-xl sm:text-2xl'>5</p>
                  <p className='text-xl sm:text-2xl text-[#4B4B4B]'>Hooked</p>
                </div>
              </div>
              <button className='w-full rounded-xl py-3 bg-btn text-white
                                 cursor-pointer'>
                                 Get Hooked</button>
            </div>
          </div>
          <div className='text-center mt-3 sm:mt-5'>
            <h1 className='text-[40px] sm:text-left'>{username}</h1>
            <p className='text-[18px] text-[#4B4B4B] sm:text-left'>Imo Mama</p>
          </div>
        </div>
      </div>

      <hr className='my-5 border-gray-600'/>

      <Post User={username} Img="/images/Towa.jpg" DateUpload={Date.now()} ProfilePic="/images/fishBackground.jpg"/>
    </div>
  )
}

export default UserPage