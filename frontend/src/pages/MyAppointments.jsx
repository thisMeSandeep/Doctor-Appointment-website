import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"


const MyAppointments = () => {

  const { backendUrl, token } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();


  const months = ["jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  //format date

  const formatDate = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  }

  // get appointments list

  const getAppointmentsList = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message)
      }

    } catch (err) {
      toast.error(err.message);
    }
  }




  // cancel appoitment

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token } });
      if (data.success) {
        toast.success(data.message)
        getAppointmentsList();
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appoitment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(`${backendUrl}/api/user/verifyRazorpay`, response, { headers: { token } })
          if (data.success) {
            getAppointmentsList();
            navigate('/my-appointments')
          }
        } catch (err) {
          console.log(err);
          toast.error(err.message)
        }
      }
    }
    const rzp = new Razorpay(options);
    rzp.open()
  }

  const appointmentRazorpay = async (appointmentId) => {
    try {

      const { data } = await axios.post(`${backendUrl}/api/user/payment-razorpay`, { appointmentId }, { headers: { token } });
      if (data.success) {
        console.log(data.order)
        initPay(data.order)
      }

    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    if (token) {
      getAppointmentsList();
    }
  }, [token]);



  if (appointments.length === 0) {
    return <p className="text-lg font-medium">No appoitments yet !</p>
  }

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b ">
            <div>
              <img src={item.docData.image} alt="" className="w-32 bg-indigo-50" />
            </div>
            <div className="flex-1 text-sm text-zinc-600 ">
              <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address</p>
              <p className="text-xs">{item.docData.address.address1}</p>
              <p className="text-xs">{item.docData.address.address2}</p>
              <p className="text-xs mt-1"><span className="text-sm text-neutral-700 font-medium">Date & Time:</span>{formatDate(item.slotDate)}| {item.slotTime}</p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">

              {!item.cancelled && item.payment && <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-500">Paid</button>}

              {!item.cancelled && !item.payment && <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300" onClick={() => appointmentRazorpay(item._id)}>Pay Online</button>}

              <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-red-600 hover:text-white transition-all duration-300" onClick={() => cancelAppointment(item._id)}>Cancel appointment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments