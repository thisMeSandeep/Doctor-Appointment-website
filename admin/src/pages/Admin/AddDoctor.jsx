import { useContext, useState } from "react";
import { assets } from "../../assets/assets"
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";



const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!docImg) {
        return toast.error("Please upload doctor image");
      }

      const formData = new FormData();

      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ address1, address2 }));



      //post data to backend
      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, { headers: { aToken } });

      if (data.success) {
        toast.success(data.message);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("1 Year");
        setFees("");
        setAbout("");
        setSpeciality("General physician");
        setDegree("");
        setAddress1("");
        setAddress2("");
        setDocImg(false);
      } else {
        toast.error(data.message);
      }


    } catch (err) {
      err.response ? toast.error(err.response.data.message) : toast.error("Something went wrong");
      console.log(err);
    }

  }


  return (
    <form className="m-5 w-full" onSubmit={onSubmitHandler}>

      <p className="mb-3 textlg font-medium">Add Doctos</p>

      <div className="bg-white py-8 px-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500 ">
          <label htmlFor="doc-img">
            <img src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" className="w-16 bg-gray-100 rounded-full cursor-pointer" />
          </label>
          <input type="file" id="doc-img" hidden onChange={(e) => setDocImg(e.target.files[0])} />
          <p>Upload Doctor Picture</p>
        </div>


        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">


          <div className="w-full lg:flex-1 flex flex-col gap-4">



            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Name</p>
              <input type="text" placeholder="Name" required className="border rounded py-2 px-3" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input type="email" placeholder="Email" required className="border rounded py-2 px-3" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input type="password" placeholder="Password" required className="border rounded py-2 px-3" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select className="border rounded py-2 px-3" value={experience} onChange={(e) => setExperience(e.target.value)}>
                <option value="1">1 Year</option>
                <option value="2">2 Year</option>
                <option value="3">3 Year</option>
                <option value="4">4 Year</option>
                <option value="5">5 Year</option>
                <option value="6">6 Year</option>
                <option value="7">7 Year</option>
                <option value="8">8 Year</option>
                <option value="9">9 Year</option>
                <option value="10">10 Year</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input type="number" placeholder="Fees" required className="border rounded py-2 px-3" value={fees} onChange={(e) => setFees(e.target.value)} />
            </div>

          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select name="" id="" className="border rounded py-2 px-3" value={speciality} onChange={(e) => setSpeciality(e.target.value)} >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Education</p>
              <input type="text" placeholder="Education" required className="border rounded py-2 px-3" value={degree} onChange={(e) => setDegree(e.target.value)} />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input type="text" placeholder="address 1" required className="border rounded py-2 px-3" value={address1} onChange={(e) => setAddress1(e.target.value)} />
              <input type="text" placeholder="address 2" required className="border rounded py-2 px-3" value={address2} onChange={(e) => setAddress2(e.target.value)} />
            </div>

          </div>
        </div>

        <div >
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea name="" id="" placeholder="write about doctor" rows={5} className="w-full px-4 pt-2 border rounded" value={about} onChange={(e) => setAbout(e.target.value)} ></textarea>
        </div>

        <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full">Add Doctor</button>

      </div>




    </form>
  )
}

export default AddDoctor