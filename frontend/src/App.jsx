import { useEffect } from 'react'
import './App.css'
import Chatpage from './components/Chatpage'
import EditProfile from './components/EditProfile'
import Home from './components/Home'

import Login from './components/Login'
import MainLayot from './components/MainLayot'
import Profile from './components/Profile'
import Signup from './components/Signup'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { io} from 'socket.io-client'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'

const browserRouter = createBrowserRouter([
  { 
    path:"/",
    element:<MainLayot/>,
    children:[
      {
        path:"/",
        element:<Home/>     
      },
      {
        path:`/profile/:id`,
        element:<Profile/>     
      },
      {
        path:`/account/edit`,
        element:<EditProfile/>     
      },
      {
        path:`/chatpage`,
        element:<Chatpage/>     
      }
    ]
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/Signup",
    element:<Signup/>
  }
])


function App() {
  const user = useSelector(store=>store.auth.user);
  const socket = useSelector(store=>store.socketio.socket)
  const dispatch = useDispatch();
  useEffect(()=>{
    
    if(user)
    {
      const socketio = io('http://localhost:8000',{
                        query:{
                          userId:user?._id
                        },

                        transports:['websocket']
                      })
       dispatch(setSocket(socketio));




       // get onlineusers from socket(backend)---send-->to redux(chatSlice)
       socketio.on("getOnlineUsers",(onlineUsers)=>{
           dispatch(setOnlineUsers(onlineUsers))
       })  // go to chatpage.jsx to set onlineusers(from redux u set)



       socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
        });


       return ()=>{
        socketio.close();
        dispatch(setSocket(null));
       }
      
    }else if(socket){
      socket.close();
      dispatch(setSocket(null));
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user,dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
