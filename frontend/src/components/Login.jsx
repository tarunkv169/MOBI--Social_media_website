import { useState } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";


const Login = () => {

    const [input,setinput] = useState({
        email:"",
        password:""
    })

    const [loading,setloading] = useState(false);
    
    const navigate = useNavigate();
    
    const dispatch = useDispatch();

    const changeEventHandler=(e)=>{
        setinput({...input,[e.target.name]:e.target.value})
    }
    
    const loginHandler=async(e)=>{
        e.preventDefault();
        try {
            setloading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/login',input,{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            })
            
            if(res.data.success)
            {  
                console.log(res.data.userDetail);
                dispatch(setAuthUser(res.data.userDetail))
                navigate("/")
                toast.success(res.data.message);
                setinput({
                    email:"",
                    password:""
                })
            }
    
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }finally{
            setloading(false);
        }
    }
    
  return (
    <div className="flex items-center w-screen h-screen justify-center">
        <form onSubmit={loginHandler} className="shadow-lg flex flex-col gap-5 p-8">
            <div className="my-4">
                <h1 className="text-center text-xl font-bold">MOBI</h1>
                <p className="text-center text-sml">Login to see photos and videos of your friends</p>
            </div>
            <div>
                <span className='font-medium'>Email</span>
                <Input
                type="email" 
                name="email"
                value={input.email} 
                onChange={changeEventHandler}
                />
            </div>
            <div>
                <span className='font-medium'>Password</span>
                <Input 
                type="password"
                name="password"
                value={input.password} 
                onChange={changeEventHandler}
                 />
            </div>
            {
                loading?(
                    <Button>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Please wait
                    </Button>
                ):(
                    <Button type="submit">Login</Button>
                )
            }

            <span className="text-center">Does&apos;nt have an account? <Link to='/signup' className="text-blue-600">Signup</Link></span>
            
        </form>
    </div>  
  )
};

export default Login;
