import React from 'react'
import Post from '../components/Post';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const UserPage = () => {
  const { username } = useParams();

  return (
    <div className='text-center bg-background'>
      <Navbar />
      <Post User={username} Img="/images/fishBackground.jpg" DateUpload={Date.now()} ProfilePic="/images/fishBackground.jpg"/>
    </div>
  )
}

export default UserPage