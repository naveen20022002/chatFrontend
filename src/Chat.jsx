import React, { useContext, useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import { UserContext } from './UserContext'
import {uniqBy} from 'lodash'
import axios from 'axios'
import Contact from './Contact'

const Chat = () => {
  const [ws, setWs] = useState(null)
  const [onlinePeople, setOnlinePeople] = useState({})
  const [offlinePeople, setOfflinePeople] = useState({})
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([])
  const [classs, setClasss] = useState("");
  const [classs2, setClasss2] = useState("")

  const divUnderMessages = useRef()

  const {username, id, setId, setUsername} = useContext(UserContext);

  useEffect(() => {
    connectToWs()
  }, []);

  function connectToWs(){
    //changed ws to wss for security due to err 
    const ws = new WebSocket('wss://chat-application-0bjs.onrender.com')
    setWs(ws)
    ws.addEventListener('message', handleMessage)
    ws.addEventListener('close', ()=>{
      setTimeout(()=>{
        console.log('reconnected')
        connectToWs()
      },1000)
    })//change if needed
  }

  function showOnlinePeople(peopleArray){
    const people = {}
    peopleArray.forEach(({username, userId})=>{
      people[userId] = username
    })
    // console.log(people)
    setOnlinePeople(people)
  }

  function handleMessage(ev){
    // console.log(ev)
    const messageData = JSON.parse(ev.data)
    if('online' in messageData){
      showOnlinePeople(messageData.online)
    }else if('text' in messageData){
      if(messageData.sender === selectedUserId){
        setMessages(prev => ([...prev, {...messageData}]))
      }
      
      // console.log(messageData)
      console.log(messages)
    }
  }
  function sendMessage(ev, file=null){
    if(ev) ev.preventDefault();
    ws.send(JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
        file,
    }));
    

    // console.log(messages)
    if(file){
      axios.get('/messages/' + selectedUserId).then(res =>{
        // console.log(res.data)
        setMessages(res.data)
      })
    }else{
      setNewMessageText('')
      setMessages(prev => ([...prev, {text: newMessageText, sender: id, recipient: selectedUserId, _id: Date.now()}]))
    }
  }
  function sendFile(ev){
    const reader = new FileReader()
    reader.readAsDataURL(ev.target.files[0])
    reader.onload = () =>{
      sendMessage(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      })
    }
  }  
  function logout(){
    axios.post('/logout').then(()=>{
      setWs(null);
      setId(null)
      setUsername(null)
    })
  }
  useEffect(()=>{
    const div = divUnderMessages.current;
    if(div){
      div.scrollIntoView({behavior:'smooth', block:'end'});
    }
  }, [messages])

  useEffect(()=>{
    axios.get('/people').then(res=>{
      const offlinePeopleArr = res.data
        .filter(p => p._id !== id)
        .filter(p => !Object.keys(onlinePeople)?.includes(p._id))
      
        const offlinePeople = {};
        offlinePeopleArr.forEach(p=>{
          offlinePeople[p._id] = p
        })
        // console.log(offlinePeople)
        setOfflinePeople(offlinePeople)
    })
  },[onlinePeople])
  function selectedUsernameFind(){
    // console.log(offlinePeople[selectedUserId].username || onlinePeopleExclOurUser[selectedUserId].username)
    return offlinePeople[selectedUserId]?.username || onlinePeopleExclOurUser[selectedUserId]?.username
  }

  useEffect(()=>{
    if(selectedUserId){
      axios.get('/messages/' + selectedUserId).then(res =>{
        // console.log(res.data)
        setMessages(res.data)
      })
      // setSelectedUsername(selectedUsernameFind())
    }
  },[selectedUserId])

  const onlinePeopleExclOurUser = {...onlinePeople};
  delete onlinePeopleExclOurUser[id];
  // console.log(onlinePeopleExclOurUser)

  const messageWithoutDupes = uniqBy(messages, '_id')

  return ( 
    <div className='flex h-screen'>
      <div className={'bg-gray-800 w-full sm:w-1/3 flex sm:flex flex-col ' + classs}>
        <div className='flex-grow'>
          <div className='flex justify-between border-b'>
          <Logo/>
          <span className='sm:hidden py-2 px-3 mb-2 rounded-lg gap-1 test-sm items-center text-gray-100 bg-gray-800 flex'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
          </svg>
          {username}
          </span>
          </div>
        {/* bracket change error '(' to '[' */}
        {Object.keys(onlinePeopleExclOurUser).map(userId => (
          <div onClick={()=>{setClasss("hidden sm:block"); setClasss2("")}}>
          <Contact classname={null} key={userId} id={userId} online={true} username={onlinePeopleExclOurUser[userId]} onClick={()=>setSelectedUserId(userId)} selected={userId === selectedUserId}/>
          </div>
          ))}
         {Object.keys(offlinePeople).map(userId => (
          <div onClick={()=>{setClasss("hidden sm:block"); setClasss2("")}}>
            <Contact classname={null} key={userId} id={userId} online={false} username={offlinePeople[userId].username} onClick={()=>setSelectedUserId(userId)} selected={userId === selectedUserId}/>
          </div>
          ))}
        </div>
        <div className='sm:p-2 sm:text-center flex sm:flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between'>
          <span className='hidden sm:block sm:flex sm:py-2 sm:px-3 mb-2 sm:rounded-lg gap-1 text-sm items-center text-gray-100 bg-gray-500'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
          </svg>
          <div>{username? username : "hi"}</div>
          </span>
          <button onClick={logout} className='text-sm text-white bg-gray-500 py-2 px-5 rounded-md'>Logout</button>
        </div>
      </div>
      <div className={'flex flex-col w-full bg-gray-600 sm:w-2/3 p-2 ' + classs2}>
        {/* altered code */}
        <div className='sm:hidden bg-gray-900'>
          {!!selectedUserId && (
            <div>
            <div className='flex '>
            <div onClick={()=>{setClasss(""); setClasss2("hidden sm:block")}} className='ml-2 text-white flex items-center justify-right text-bold text-xl '>
              &larr;
            </div>
            <Logo/>
          </div>
            <div className='bg-gray-900'>
              <Contact classname = 'bg-gray-900' key={selectedUserId} id={selectedUserId} online={true} username={selectedUsernameFind()} onClick={()=>setSelectedUserId(selectedUserId)} selected={selectedUserId === selectedUserId}/>
            </div>
            </div>
          )}
        </div>
        <div className='flex-grow'>
          {!selectedUserId && (
            <div className='flex h-full flex-grow items-center justify-center'>
              <div className='text-gray-500'>&larr; Select a person from the available contacts</div>
            </div>
          )}
          {!!selectedUserId && (
            <div className='relative h-full'>
              <div className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-2'>
              {messageWithoutDupes.map(message =>(
                <div key={message._id} className={(message.sender === id ? 'text-right':'text-left')}>
                    <div className={'text-right inline-block p-2 my-2 text-sm rounded-sm ' + (message.sender === id ? 'bg-gray-800 text-white':'bg-white text-gray-500')}>
                     {message.text}
                     {message.file && (
                      <div>
                        <a target='_blank' className='flex items-center border-b gap-1 text-sm' href={axios.defaults.baseURL + '/uploads/' + message.file}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                          </svg>
                          {message.file}
                        </a>
                      </div>
                     )}
                    </div>
                </div>
              ))}
              <div ref={divUnderMessages}></div>
            </div>
            </div>
            
          )}
        </div>
        {!!selectedUserId && (
          <form className='flex gap-2' onSubmit={sendMessage}>
          <input value={newMessageText} onChange={ev => setNewMessageText(ev.target.value)} type="text" placeholder='Type your message here' className='flex-grow bg-gray-300 border p-2 rounded-sm' />
          <label className='bg-gray-700 p-2 text-white cursor-pointer rounded-sm border border-gray-800'>
          <input type="file" className='hidden' onChange={sendFile}/>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
          </svg>
          </label>
          <button type='submit' className='bg-gray-900 p-2 text-white rounded-sm'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
          </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Chat
