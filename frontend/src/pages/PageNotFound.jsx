import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div className='bg-background font-montagu min-h-screen'>
      <Navbar />
      <div className='flex items-center justify-center w-full'>
        <div className='text-center max-w-100 mt-25'>
          <h1 className='font-bold text-4xl mb-5'>404</h1>
          <img src='/images/PageNotFoundImg.png'/>
          <h1 className='font-semibold text-2xl mb-5 mt-5'>Page not found</h1>
          <p className='max-w-90 mx-auto'>Sorry, the page you are looking for cannot be found.
            Please check the URL or try navigating back to the homepage.
          </p>
          <Link to={"/"}> 
            <p className=' bg-btn text-white py-3 rounded-lg mt-7'>Go back to homepage &rarr;</p>
          </Link>
        </div>
      </div> 
    </div>
  )
}

export default PageNotFound