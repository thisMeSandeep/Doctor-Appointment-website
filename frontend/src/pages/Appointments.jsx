import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Appointments = () => {
  const [docInfo, setDocInfo] = useState(null);
  const [docSlotes, setDocSlotes] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const navigate = useNavigate();


  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo)
  }



  //function to calculate available slots
  const getAvailableSlot = async () => {
    setDocSlotes([]);

    //getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      //getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i);
      //setting end time of the date
      let endTime = new Date()
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      //setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
      }
      else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        //increment time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlotes(prev => ([...prev, timeSlots]));

    }
  }


  //book appoitment

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment');
      return navigate('/login')
    }

    try {
      const date = docSlotes[slotIndex][0].datetime

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      console.log(slotDate);

      const { data } = await axios.post(`${backendUrl}/api/user/book-appointment`, { docId, slotDate, slotTime }, { headers: { token } })

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointment")
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      if (err.response?.data?.success) {
        toast.error(err.response.data.success);
      } else {
        toast.error(err.message)
      }
    }
  }


  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlot();
  }, [docInfo])

  useEffect(() => {
    console.log(docSlotes)
  }, [])



  return docInfo && (
    <div>
      {/* Doctor details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img src={docInfo.image} alt="" className="bg-primary w-full sm:max-w-72 rounded-lg" />
        </div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          {/* doctors details :name , degree ,ēxp*/}
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name}
            <img src={assets.verified_icon} alt="" className="w-5" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600 ">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className="py-0.5 px-0.5 border text-xs rounded-full ">{docInfo.experience}</button>
          </div>
          {/* Doctor about */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium   text-gray-900 mt-3">About <img src={assets.info_icon} alt="" /></p>
            <p className="text-sm text-gray-500 max-w-[700px]">{docInfo.about}</p>
          </div>
          <p className="text-gray-500 font-medium mt-4">
            Appointment fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* -----booking slotes------- */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {
            docSlotes.length && docSlotes.map((item, index) => (
              <div key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} onClick={() => setSlotIndex(index)}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>
                  {item[0] && item[0].datetime.getDate()}
                </p>
              </div>
            ))
          }
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-5">
          {
            docSlotes.length && docSlotes[slotIndex].map((item, index) => (
              <p key={index} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} onClick={() => setSlotTime(item.time)}>
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </div>

        {/* book appoitment button */}
        <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light py-3 px-14 rounded-full my-6">Book an appointment</button>

      </div>
      {/* Listing related doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

    </div>
  )
}

export default Appointments