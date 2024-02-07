import React from 'react'
import './Hero.css'
import img_1 from '../assets/img_1.png'
import cart from '../assets/cart.png'

const Hero = () => {
  return (

    <div className="hero-container">
        
        <div className="hero-item">
                <img src={img_1} alt="" />
        </div>
        
        <div className='hero-item'>
            <p>Combating product counterfeiting with serial numbers
                by implementing blockchain technology with smart
                contracts, specifically for clothing products.
            </p>

            <br></br>
            
            <h1>Motivation</h1>
            <p>
            A real life example between small online clothing shops,
            where limited consumer knowledge of counterfeiting makes it
            challenging for them to distinguish between real and
            counterfeit products. We are motivated to establish a blockchain-based
            system and focus on prioritizing consumer trust and empowering small
            businesses (in the clothing industry).
            </p>
            <br></br>
            <h1>Why Blockchain?</h1>
            <p>
            Security and transparency features.
            Blockchain provides an immutable and decentralized ledger 
            that ensures the authenticity of product infor
            mation, making it resistant to tampering or manipulation.
            </p> 
        </div>
    </div>

  )
}
export default Hero
