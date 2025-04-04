import { NavLink, useNavigate } from "react-router-dom"
import { assets } from "../assets/assets_frontend/assets"
import { useState } from "react"
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false);

    const { token, setToken, userData } = useContext(AppContext)

    const navigate = useNavigate()


    //logout user
    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
        navigate('/')
    }

    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
            <img src={assets.logo} alt="" className="w-44 cursor-pointer " onClick={() => navigate('/')} />
            <ul className="hidden md:flex items-start  gap-5 font-medium">
                <NavLink to={'/'}>
                    <li className="py-1">HOME</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to='/doctors'>
                    <li className="py-1">ALL DOCTORS</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to='/about'>
                    <li className="py-1">ABOUT</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to='/contact'>
                    <li className="py-1">CONTACT</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
            </ul>
            <div className="flex items-center gap-4">
                {
                    token ?
                        <div className="flex items-center gap-2 cursor-pointer group relative">
                            <img src={userData.image} alt="" className="w-8 rounded-full" />
                            <img src={assets.dropdown_icon} alt="" className="w-2.5" />
                            <div>
                                <div className="absolute top- right-0 pt-14 text-base text-gray-600 z-20 hidden group-hover:block">
                                    <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                                        <p onClick={() => navigate('my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
                                        <p onClick={() => navigate('my-appointments')} className="hover:text-black cursor-pointer">My Appointements </p>
                                        <p onClick={() => logout()} className="hover:text-black cursor-pointer">Logout</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <button onClick={() => navigate('/login')} className="bg-primary text-white px-10 py-3 rounded-full font-light hidden md:block">Sign In</button>
                }
                <img src={assets.menu_icon} alt="" className="w-6 md:hidden" onClick={() => setShowMenu(true)} />
                {/* ------mobile menu------ */}
                <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                    <div className="flex items-center justify-between px-5 py-6">
                        <img src={assets.logo} alt="" className="w-36 " />
                        <img src={assets.cross_icon} alt="" onClick={() => setShowMenu(false)} className="w-7" />
                    </div>
                    <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
                        <NavLink className="px-4 py-2 rounded inline-block" to="/" onClick={() => setShowMenu(false)}>Home</NavLink>
                        <NavLink className="px-4 py-2 rounded inline-block" to="/doctors" onClick={() => setShowMenu(false)}>All Doctors</NavLink>
                        <NavLink className="px-4 py-2 rounded inline-block" to="/about" onClick={() => setShowMenu(false)}>About</NavLink>
                        <NavLink className="px-4 py-2 rounded inline-block" to="/contact" onClick={() => setShowMenu(false)}>Contact</NavLink>
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default Navbar