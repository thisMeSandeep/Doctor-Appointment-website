import { createContext, useEffect, useState } from "react";
// import { doctors } from "../assets/assets_frontend/assets";
import axios from "axios"
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
    const [userData, setUserData] = useState(false);

    const currencySymbol = '$';

    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    //get all doctors
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`)

            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message)
            }

        } catch (err) {
            if (err.response?.message?.data) {
                toast.error(err.response.message.data);
            } else {
                toast.error(err.message)
            }
        }
    }


    //get user data

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, { headers: { token } });
            console.log('user data : ' + data);
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.error("Error fetching user data:", err.message);
            toast.error(err.response?.data?.message || "Failed to fetch user data");
            setUserData(false); 
        }
    }


    useEffect(() => {
        getDoctorsData();
    }, [])


    useEffect(() => {
        if (token) {
            getUserData();
        } else {
            setUserData(false)
        }
    }, [token])


    const value = {
        doctors,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}

export default AppContextProvider