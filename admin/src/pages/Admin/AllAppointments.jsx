import { useContext } from "react"
import { AdminContext } from "../../context/AdminContext"
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {

  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, currency } = useContext(AppContext)

  const months = ["jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  //format date

  const formatDate = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  }

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken])

  return (
    <div className="w-full max-w-6xl m-5 ">

      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => (
          <div key={index} className="flex flex-wrap justify-between mx-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50">
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img src={item.userData.image} className="w-8 rounded-full" />
              <p>{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>{formatDate(item.slotDate)} , {item.slotTime}</p>
            <div className="flex items-center gap-2">
              <img src={item.docData.image} className="w-8 rounded-full bg-gray-200" />
              <p>{item.docData.name}</p>
            </div>
            <p>{currency}{item.amount}</p>

            {item.cancelled ?
              <p className="text-red-400 text-xs font-medium">Cancelled</p> : <img src={assets.cancel_icon} className="w-10 cursor-pointer" onClick={() => cancelAppointment(item._id)} />
            }
          </div>
        ))}

      </div>
    </div>
  )
}

export default AllAppointments