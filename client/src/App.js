import Web3 from 'web3'
import { useState, useEffect } from 'react'
import ProductManagement from './contracts/ProductManagement.json'
import Manufacturer from './contracts/Manufacturer.json'
import Seller from './contracts/Seller.json'
import Consumer from './contracts/Consumer.json'
import Navbar from './components/Navbar/Navbar'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import HomeCategory from './pages/HomeCategory'
import Product from './pages/Product'
import Verify from './pages/Verify'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import LoginSignup from './pages/LoginSignup'

function App() {

  const [sellerId, setSellerId] = useState('')

  // async function querySeller() {
  //   const {manageContract} = state

  //   let res = await manageContract.methods.sellers(sellerId).call()
  //   if (!res[2]) { // res[2] is isSeller
  //     window.alert("Seller does not exist...")
  //     return;
  //   }
  //   else {
  //     window.alert("The seller exist!")
  //     return;
  //   }
  // }


  return (
    <div>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/Product' element={<Product category="Product"/>}/>
          <Route path='/Verify' element={<Verify category="Verify"/>}/>
          <Route path='/About' element={<About category="About"/>}/>
          <Route path='/Contact' element={<Contact category="Contact"/>}/>
          <Route path="/product" element={<Product/>}>
            <Route path=':productId' element={<Product/>}/>
          </Route>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/login' element={<LoginSignup/>}/>
      
      
        </Routes>
      </BrowserRouter>

      {/* QUERY SELLER */}

      {/* <h2> QUERY SELLER </h2>
      <label> Input Seller Id: </label>
      <input 
        type = "text"  
        value = {sellerId}
        onChange = {(e) => setSellerId(e.target.value)}>
      </input> <span></span>
      <button onClick = {querySeller}> check </button> */} 
    </div>
  );
}

export default App;
