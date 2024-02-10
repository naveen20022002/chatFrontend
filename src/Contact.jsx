import React from 'react'
import Avatar from './Avatar'

const Contact = ({id, onClick, selected, username, online, classname}) => {
  let className = null;
  if(classname !== null){
    className = classname + ' border-t border-gray-400 flex items-center gap-2 cursor-pointer';
  }
  else{
    className = "border-b border-gray-900 flex items-center gap-2 cursor-pointer " + (selected ? 'bg-gray-600' : 'bg-gray-800') 
  }
  return (
    <div key={id} onClick={() => onClick(id)} className={className}>
            {selected && (
              <div className='w-1 sm:bg-gray-200 h-12 rounded-r-md'></div>
            )}
            {!selected && (
              <div className='w-1 bg-gray-800 h-12 rounded-r-md'></div>
            )}
            <div className='flex gap-2 py-2 pl-4 items-center'>
              <Avatar online={online} username={username} userId={id}/>
              <span className='text-gray-100'>{username}</span>
            </div>
    </div>
  )
}

export default Contact
