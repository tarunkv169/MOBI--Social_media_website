import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from "axios"
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  
  // intial empty inputs
  const [input,setinput] = useState({      //here input is object with empty values----as default in usestate...so setinput also need to object
   username:"",
   email:"",
   password:""
  })

  // to show loading while req is sent to server
  const [loading,setloading] = useState(false);
  
  const navigate = useNavigate();

  // empty input filled with user data
  const ChangeEventHandler=(e)=>{
   setinput({...input,[e.target.name]:e.target.value})  // inserting values to make it object as input is object
  }
  
  // storing data in dbs using "axios" by making api call ,,,"sooner->toast" is used to show message
  const SignUpHandler=async(e)=>{
    e.preventDefault();
    console.log(input);
    try{
         setloading(true);
         const res = await axios.post("http://localhost:8000/api/v1/user/signup",input,{
                                 headers:{
                                    'Content-Type':'application/json'
                                 },
                                 withCredentials:true
        })


        if(res.data.success)
        {
           navigate("/login")
          toast.success(res.data.message);
          setinput({
            username:"",
             email:"",
             password:""
            }
          )
        }
        
    }catch(error){
       console.log(error);
       toast.error(error.response?.data?.message || 'Signup failed');
    }finally{
      setloading(false);
    }
    
  }
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
        <form onSubmit={SignUpHandler} className='shadow-lg flex flex-col gap-5 p-8'>
          <div className='my-4'>
             <h1 className='font-bold text-center text-xl'>MOBI</h1>
             <p className='text-center text-sm'>Signup to see photos and videos of your friends</p>
          </div>
          <div>
             <span className='font-medium'>Username</span>
             <Input
             type="text"
             name='username'
             value={input.username}
             onChange={ChangeEventHandler}
             className='focus-visible:ring-transparent my-2'/>
          </div>
          <div>       
             <span  className='font-medium'>Email</span>
             <Input
             type="Email"
             name='email'
             value={input.email}
             onChange={ChangeEventHandler}
             className='focus-visible:ring-transparent my-2'/>
          </div>
          <div>
             <span  className='font-medium'>Password</span>
             <Input
             type="Password"
             name='password'
             value={input.password}
             onChange={ChangeEventHandler}
             className='focus-visible:ring-transparent my-2'/>
          </div>
          {
            loading ?(
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                Please wait
              </Button>
            ):(
              <Button type="submit">Signup</Button>
            )
          }
           
           <span className='text-center'>Already have an account? <Link to='/login' className='text-blue-600'>Login</Link></span>
        </form>
        
    </div>
    
  )
  
}

export default Signup