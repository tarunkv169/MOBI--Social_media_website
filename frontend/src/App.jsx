import './App.css'
import EditProfile from './components/EditProfile'
import Home from './components/Home'

import Login from './components/Login'
import MainLayot from './components/MainLayot'
import Profile from './components/Profile'
import Signup from './components/Signup'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'

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
  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
