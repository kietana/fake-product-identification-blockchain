import { useRef } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import React from 'react'
import "../styles/main.css"

function Navbar() {

    const navRef = useRef();

    const showNavBar = () => {
      navRef.current.classList.toggle("responsive_nav")
    }

    return (
      <React.Fragment>
        <header>
          <h3><a href="/home">LOGO</a></h3>
          <nav ref={navRef}>
            <a href="/home">Home</a>
            <a href="/seller">Seller</a>
            <a href="/manuf">Manufacturer</a>
            <a href="/consumer">Consumer</a>
            <a href="/browse">Browse Product</a>
            <button className='nav-btn nav-close-btn' onClick={showNavBar}> <FaTimes/> </button>
          </nav>
          <button className='nav-btn' onClick={showNavBar}> <FaBars/> </button>
        </header>
      </React.Fragment>
    )
}

export default Navbar