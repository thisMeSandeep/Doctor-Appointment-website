import { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    //get all docotrs
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/all-doctors`, { headers: { aToken } });

            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(err.message);
            }
        }
    };

    //change availability
    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { docId }, { headers: { aToken } });

            if (data.success) {
                toast.success(data.message);
                getAllDoctors()
            } else {
                toast.error(data.message)
            }

        } catch (err) {
            if (err.response?.data?.success) {
                toast.error(err.response.data.success)
            } else {
                toast.error(err.message)
            }
        }
    }

    //get appointments
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
                headers: { aToken }
            });

            if (data.success) {
                setAppointments(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(err.message);
            }
        }
    };


    //cancel appoitment

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/cancelAppointment`, { appointmentId }, { headers: { aToken } });
            if (data.success) {
                toast.success(data.message);
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(err.message);
            }
        }
    }


    //get dashboard data

    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, { headers: { aToken } });
            if (data.success) {
                console.log(data.dashData)
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(err.message);
            }
        }
    }

    const value = {
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData,
        getDashData
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}

export default AdminContextProvider;