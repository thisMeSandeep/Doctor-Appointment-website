import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext";
import axios from "axios"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Login = () => {


  const [state, setState] = useState('Login');

  const [userAuthDetails, setUserAuthDetails] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const { backendUrl, token, setToken } = useContext(AppContext);

  //on submit function

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, userAuthDetails);
        if (data.success) {
          setToken(data.token);
          localStorage.setItem('token', data.token);
          console.log(data.token)
          toast.success(data.message)
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, userAuthDetails);
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success(data.message);
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message);
      }
    }
  }

  //handle onChnage

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserAuthDetails(prev => ({ ...prev, [name]: value }));

    console.log(userAuthDetails)
  }



  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">

      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign Up' ? "Sign Up" : "Sign In"} to book appointment</p>

        {
          state === "Sign Up" ? <div className="w-full ">
            <p>Full Name</p>
            <input type="text" name="name" value={userAuthDetails.name} onChange={handleOnChange} autoComplete="true" required className="border border-zinc-300 rounded w-full mt-1 p-2" />
          </div> : ''
        }



        <div className="w-full ">
          <p>Email</p>
          <input type="email" name="email" value={userAuthDetails.email} onChange={handleOnChange} autoComplete="true" required className="border border-zinc-300 rounded w-full mt-1 p-2" />
        </div>

        <div className="w-full ">
          <p>Password</p>
          <input type="password" name="password" value={userAuthDetails.password} onChange={handleOnChange} autoComplete="true" required className="border border-zinc-300 rounded w-full mt-1 p-2" />
        </div>

        <button type="submit" className="bg-primary text-white w-full py-2 rounded-md text-base">{state === 'Sign Up' ? "Create Account" : "Login"}</button>

        {
          state === "Sign Up" ? <p>Already have an account? <span onClick={() => setState('Login')} className="text-primary underline cursor-pointer">Login here</span></p> : <p>Create a new account? <span onClick={() => setState('Sign Up')} className="text-primary underline cursor-pointer">click here</span></p>
        }

      </div>

    </form>
  )
}

export default Login