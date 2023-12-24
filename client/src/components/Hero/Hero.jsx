import React from 'react'
import './Hero.css'
import img_1 from '../assets/img_1.png'
import cart from '../assets/cart.png'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-left">
            <h2></h2>
            <div>
                <div className="hand-hand-icon">
                    <p>NEW</p>
                    <img src={img_1} alt="" />
                </div>
                <p>Collection</p>
                <p>For Eveyone</p>
            </div>
            <div className="hero-latest-btn">
                <div>Lastest Collection</div>
                <img src={cart} alt="" />
            </div>
        </div>
        <div className="hero-right">
           
        </div>
    </div>

  )
}
export default Hero
