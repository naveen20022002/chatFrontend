import React from 'react'

const Avatar = ({username, userId, online}) => {
    const colors = ['bg-gray-200', 'bg-red-200', 'bg-purple-300']
    const userIdBase10 = parseInt(userId, 16)
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];
  return (
    <div className={"relative w-8 h-8 rounded-full flex items-center " + color}>
      <div className='text-center font-bold text-gray-900 w-full opacity-70'>{username[0]}</div>
      {online && (
        <div className='bg-green-400 w-3 h-3 right-0 bottom-0 absolute rounded-full border border-white'></div>
      )}
    </div>
  )
}

export default Avatar
