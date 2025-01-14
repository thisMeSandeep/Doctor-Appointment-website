import { createContext, useEffect, useState } from "react";
// import { doctors } from "../assets/assets_frontend/assets";
import axios from "axios"
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);

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

    useEffect(() => {
        getDoctorsData();
    }, [])

    const value = {
        doctors,
        currencySymbol,
        token,
        setToken,
        backendUrl
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}

export default AppContextProvider