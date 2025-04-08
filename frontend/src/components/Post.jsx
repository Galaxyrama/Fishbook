import React from 'react'
import { Link } from 'react-router-dom';

const Post = ( { User, Img, DateUpload, ProfilePic } ) => {
  const date = new Date(DateUpload);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  
  return (
    <div className='font-montagu'>
        <div className='flex justify-center w-full pb-5'>
        <div className='w-full max-w-3xl pb-2 '>
          <div className='flex gap-4 rounded-lg drop-shadow-xl py-6 bg-white px-4 '>
            <div className='w-12 flex-shrink-0'>
                <Link to={`/profile/${User}`}>
                    <img src={ProfilePic} alt="" className='w-12 h-12 rounded-4xl mr-12 cursor-pointer'/>
                </Link>
            </div>
            <div className='text-left pr-2 max-w-3xl'>
                <Link to={`/profile/${User}`}>
                    <p className='text-xl font-semibold cursor-pointer inline-block max-w-max'>{User}</p>
                </Link>
                <p className='pb-2 text-sm text-gray-500'>{formattedDate}</p>
              
              <div>
                {/* Text Post */}
                <p className='text-justify pb-3 cursor-pointer'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, eaque maxime. Ex, 
                  earum vitae, blanditiis perferendis voluptate eaque dolore porro magni facilis 
                  consequuntur totam omnis odio perspiciatis recusandae mollitia quo?</p>
                  {/* Image Post */}
                {Img && <img src={Img} alt="" className='pb-3 w-full'/>}

                <hr className='pt-3'/>

                <div className='flex justify-between sm:px-20'>
                  <div className='flex select-none cursor-pointer'>
                  {/* Comments */}
                    <img src="/images/comment.png" alt="" className='w-6 h-6 mr-1'/>
                    <p># of comments</p> 
                  </div>
                  <div className='flex select-none cursor-pointer'>
                    {/* Likes */}
                    <img src="/images/heart.png" alt="" className='w-6 h-6 mr-1'/>
                    <p># of likes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post