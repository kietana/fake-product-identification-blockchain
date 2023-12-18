import Navbar from '../components/Navbar'

import React from 'react'

function Consumer() {
  return (
    <>
        <Navbar/>
        <h2>This is Consumer only!</h2>
        <p>
            1. topUp amount
            2. checkBalance
            3. verify product
        </p>
    </>
  )
}

export default Consumer