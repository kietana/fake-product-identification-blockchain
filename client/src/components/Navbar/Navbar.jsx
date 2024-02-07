import React, { useEffect, useState } from 'react';
import './Navbar.css'
import logo from '../assets/logo.png'
import cart from '../assets/cart.png'
import { Link } from 'react-router-dom';

const Navbar = () => {

    const [menu, setMenu] = useState("home");

  return (
    <div className='navbar'>
        <div className="nav-logo">
            <img src={logo} alt=""/>
            <div>
              <p>SMART</p>
              <br></br>
              <p>SHOPPER</p>
            </div>
        </div>
      <ul className='nav-menu'>
        <li onClick={()=>{setMenu("home")}}><Link to='/'>Home</Link>{menu==="home"?<h/>:<></>}</li>
        <li onClick={()=>{setMenu("products")}}><Link to='/Product'>Products</Link>{menu==="product"?<h/>:<></>}</li>
        <li onClick={()=>{setMenu("verify")}}><Link to='/Verify'>Verify</Link>{menu==="verify"?<h/>:<></>}</li>
        <li onClick={()=>{setMenu("about")}}><Link to='/About'>About</Link>{menu==="about"?<h/>:<></>}</li>
        <li onClick={()=>{setMenu("contact")}}><Link to='/Contact'>Contact</Link>{menu==="contact"?<h/>:<></>}</li>
      </ul>
      <div className='nav-login-cart'>
        <Link to='/login'><button>Login</button></Link>
        <Link to='/cart'><img src={cart} alt=""/></Link>
        <div className="nav-cart-count">0</div>
      </div>
    </div>
  )
}

export default Navbar