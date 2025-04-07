import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div>
      <Navbar />
      <h1>Page not found</h1>
      <p>Sorry, the page you are looking for cannot be found.
        Please check the URL or try navigating back to the homepage.
      </p>
      <Link to={"/"}> 
        <p>Go back to homepage &rarr;</p>
      </Link>
    </div>
  )
}

export default PageNotFound