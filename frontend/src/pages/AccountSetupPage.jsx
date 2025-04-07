import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const AccountSetupPage = () => {
  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");
  const [description, setDescription] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");

  const handleForm = () => {

  }

  return (
    <div className='bg-background font-montagu min-h-screen'>
      <Navbar />
      <div className='block sm:flex'>
        <div className='mt-5 ml-5 w-sm'>
          <h1 className='text-center text-3xl text-dark-blue font-semibold'>Account Setup</h1>
          <div className='flex flex-col items-center mt-4'>
            <div className='w-40 flex-shrink-0'>
              <img src="/images/avatar-placeholder.png" className='h-40 w-40 rounded-full justify-center' />
            </div>
            <button type='submit' 
                    className='inline-block text-white py-2 px-5 
                            bg-btn rounded-xl cursor-pointer mt-5'
                    >Change Photo</button>
          </div>
        </div>
        <div className='mt-12 px-5 w-full'>
          <form onSubmit={handleForm}>
            <div className='container'>
              {/* Email */}
              <label htmlFor="email" className='inline-block mb-2 text-medium-blue'>Email Address</label>
              <div className='relative'>
                <img src="images/email.png" className='absolute left-4 top-1/2 transform -translate-y-3 w-6 h-6'/>
                <input type="email" placeholder='Enter your email' name='email' id='email'
                className='rounded-xl border-1 px-12 py-4 w-full' required
                onChange={(e) => setEmail(e.target.value)}
                value={email}/>
              </div>

              {/* Username */}
              <label htmlFor="username" className='inline-block mb-2 mt-5 text-medium-blue'>Username</label>
              <div className='relative'>
                <img src="images/user.png" className='absolute left-4 top-1/2 transform -translate-y-3 w-6 h-6'/>
                <input type="text" placeholder='Enter your username' name='username' id='username'
                className='rounded-xl border-1 px-12 py-4 w-full' required
                onChange={(e) => setusername(e.target.value)}
                value={username}/>
              </div>

              {/* Description */}
              <label htmlFor="description" className='inline-block mb-2 mt-5 text-medium-blue'>Profile Description</label>
              <div className='relative'>
                <textarea type="email" placeholder='Hello everyone! I’m {user}, here to fish with you all!' name='description' id='description'
                className='rounded-xl border-1 py-4 w-full' required
                onChange={(e) => setDescription(e.target.value)}
                value={description}/>
              </div>

              {/* Birthdate */}
              <label htmlFor="birthDate" className='inline-block mb-2 mt-5 text-medium-blue'>Birth Date</label>
              <div className='relative'>
                <img src="images/calendar.png" className='absolute left-4 top-1/2 transform -translate-y-3 w-6 h-6'/>
                <input type="date" placeholder='Enter your username' name='birthDate' id='birthDate'
                className='rounded-xl border-1 pl-12 py-4 w-full' required
                onChange={(e) => setBirthDate(e.target.value)}
                value={birthDate}/>
              </div>

              {/* Gender */}
              <label htmlFor="gender" className='inline-block mb-2 mt-5 text-medium-blue'>Gender</label>
              <div className='relative'>
                <img src="images/gender.png" className='absolute left-4 top-1/2 transform -translate-y-3 w-6 h-6'/>
                <select name='gender' id='gender'
                className='rounded-xl border-1 px-12 py-4 w-full' required
                onChange={(e) => setGender(e.target.value)}
                value={gender}> 
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Null">Not prefer to answer</option>
                </select>
              </div>

              {/* Current location */}
              <label htmlFor="location" className='inline-block mb-2 mt-5 text-medium-blue'>Current Location</label>
              <div className='relative'>
                <img src="images/location.png" className='absolute left-4 top-1/2 transform -translate-y-3 w-6 h-6'/>
                <input type="text" placeholder='Enter your current location' name='location' id='location'
                className='rounded-xl border-1 px-12 py-4 w-full' required
                onChange={(e) => setCurrentLocation(e.target.value)}
                value={currentLocation}/>
              </div>

              <button type='submit' 
                      className='bg-btn text-white w-full cursor-pointer
                                  mt-5 py-3 rounded-xl text-xl mb-7'>Confirm</button>
            </div>     
          </form>
        </div>
      </div>
    </div>
  )
}

export default AccountSetupPage