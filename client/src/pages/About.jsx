import React from 'react'
import './About.css'
// import img_1 from '../assets/img_1.png'

function About () {

  return (
    <div className="about-container">
        
        {/* <div className="about-item">
                <img src={img_1} alt="" />
        </div> */}
        
        <div className='about-item'>
            <h1>How does the system work? </h1>
            <br></br>
            <p>
              Every seller and consumer need to top up a certain amount of ETH.
              Don't worry. It is stored in the smart contract. Whenever they want
              to buy a product, the amount of ETH is automatically deducted from
              the smart contract balance. 
            </p>
        </div>

        <div className='about-item'>
            <h1>Want to be a trusted seller? </h1>
            <br></br>
            <p>
              Contact us through the contact information provided.
            </p>
        </div>
    </div>
  )
}

export default About