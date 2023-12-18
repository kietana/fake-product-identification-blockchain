import Navbar from '../components/Navbar'

import React from 'react'

function Seller() {
  return (
    <>
        <Navbar/>
        <h2>This is Seller only!</h2>
        <p>
            1. topup amount
            2. checkBalance
        </p>
    </>
  )
}

export default Seller