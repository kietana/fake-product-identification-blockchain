import React, { useEffect, useState } from 'react';
import './Navbar.css'
import logo from '../assets/logo.png'
import cart from '../assets/cart.png'

const Navbar = () => {

    const [menu, setMenu] = useState("home");

  return (
    <div className='navbar'>
        <div className="nav-logo">
            <img src={logo} alt=""/>
            <p>SC</p>
        </div>
      <ul className='nav-menu'>
        <li onClick={()=>{setMenu("home")}}>Home{menu==="home"?<h/>:<></>}</li>
        <li onClick={()=>{setMenu("product")}}>Products{menu==="product"?<h/>:<></>}</li>
        <li onClick={()=>{setMenu("verify")}}>Verify Products{menu==="verify"?<h/>:<></>}</li>
        <li onClick={()=>{setMenu("about")}}>About Us{menu==="about"?<h/>:<></>}</li>
        <li onClick={()=>{setMenu("contact")}}>Contact{menu==="contact"?<h/>:<></>}</li>
      </ul>
      <div className='nav-login-cart'>
        <button>Login</button>
        <img src={cart} alt=""/>
        <div className="nav-cart-count">0</div>
      </div>
    </div>
  )
}

export default Navbar