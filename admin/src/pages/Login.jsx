import { useState, useContext } from "react"
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";


const Login = () => {

  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('admin@prescripto.com');
  const [password, setPassword] = useState('admin123');

  const { setAToken, backendUrl } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {

      //checking the state of the login
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
        console.log(data);
        //handling success and error 
        if (data.success) {
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
          toast.success(data.message);
        } else {
          toast.error(data.message)
        }

      } else {
        console.log('Doctor login');
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
      else {
        toast.error('Network Error');
      }
    }
  }




  return (
    <form className="min-h-[80vh] flex items-center justify-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5e5e5e] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto"><span className="text-primary">{state}</span>Login</p>
        <div className="w-full">
          <p>Email</p>
          <input type="email" value={email} required className="border border-[#dadada] rounded w-full p-2 mt-1" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input type="password" value={password} required className="border border-[#dadada] rounded w-full p-2 mt-1" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="bg-primary text-white w-full py-2 rounded-md text-base">Login</button>
        {
          state === 'Admin'
            ? <p>Doctor Login <span className="text-primary underline cursor-pointer" onClick={() => setState('Doctor')}>Click here</span></p>
            : <p>Admin Login <span className="text-primary underline cursor-pointer" onClick={() => setState('Admin')}>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login