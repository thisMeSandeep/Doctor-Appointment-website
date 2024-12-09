import { specialityData } from "../assets/assets_frontend/assets"
import { Link } from "react-router-dom"

const SpecialityMenu = () => {
    return (
        <div id="speciality" className="flex flex-col items-center gap-4 py-16 text-center">
            <h1 className="text-3xl font-medium ">Find by Speciality </h1>
            <p className="sm:w-1/3 text-sm">Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
            <div className="flex sm:justify-center gap-4 w-full overflow-scroll pt-5">
                {
                    specialityData.map((item, index) => (
                        <Link onClick={()=>scrollTo(0 , 0)} to={`/doctors/${item.speciality}`} key={index} className="flex items-center flex-col  text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500">
                            <img src={item.image} alt="" className="w-16 sm:w-24 mb-2" />
                            <p>{item.speciality}</p>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default SpecialityMenu