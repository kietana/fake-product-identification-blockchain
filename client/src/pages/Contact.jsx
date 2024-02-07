import React from 'react'
import './Contact.css'

const Contact = () => {
  return (
    <div className="contact-container">
        
        <div className='contact-item'>
            <h1>Contact Information </h1>
            <br></br>
            <p> Email: smartshopper@mail.bs.com </p>
            <p> Phone: +886 123456789</p> 
             <p>Address: HappyStreet HappyAlley No. 1, HappyLand </p>
        </div>

        <div className='contact-item'>
            <h1>Any issues or inquiries? </h1>
            <br></br>
            <p>
              Contact us through the email below.
              whysmartshopper@mail.bs.com
            </p>
        </div>
    </div>
  )
}

export default Contact