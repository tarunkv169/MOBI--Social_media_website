import './App.css'
import Home from './components/home'
import Login from './components/Login'
import MainLayot from './components/MainLayot'
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
