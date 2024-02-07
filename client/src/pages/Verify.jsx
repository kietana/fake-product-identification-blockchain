import React from 'react'
import Web3 from 'web3'
import { useState, useEffect } from 'react'
import ProductManagement from '../contracts/ProductManagement.json'
import Manufacturer from '../contracts/Manufacturer.json'
import Seller from '../contracts/Seller.json'
import Consumer from '../contracts/Consumer.json'
import './Verify.css'

function Verify() {
  const [inputSN, setInputSN] = useState('')
  const [outputSN, setOutputSN] = useState('')
  const [auth, setAuth] = useState('')
  const [productId, setProductId] = useState('')

  const [accounts, setAccounts] = useState(null)
  const [currentAcc, setCurrentAcc] = useState('nil')

  // show product info
  const [nameInfo, setNameInfo] = useState('') // product name
  const [sizeInfo, setSizeInfo] = useState('')
  const [originInfo, setOriginInfo] = useState('')
  const [priceInfo, setPriceInfo] = useState('')
  const [yearInfo, setYearInfo] = useState('')
  const [monthInfo, setMonthInfo] = useState('')
  const [dateInfo, setDateInfo] = useState('')
  const [ownerInfo, setOwnerInfo] = useState('')

  // Web3 provider and contract instance
  const [state, setState] = useState({
    web3: null,
    manageContract: null,
    manufContract: null,
    sellerContract: null,
    consumerContract: null
  })

  useEffect(() => {
    let provider
    async function initProvider() {
      if (window.ethereum) {
        provider = window.ethereum
        try {
          const accounts = await provider.request({method: "eth_requestAccounts"})
          setAccounts(accounts)
          setCurrentAcc(accounts[0])
        }
        catch (error) {
          console.error("User denied account access")
        }
      }
      else if (window.web3) {
        provider = window.web3.currentProvider
      }
      else {
        provider = new Web3.providers.HttpProvider('http://localhost:7545')
      }
  }

  initProvider()

  async function initWeb3() {
    const web3 = new Web3(provider)
    const networkId = await web3.eth.net.getId()

    const manageNetwork = ProductManagement.networks[networkId]
    const manufNetwork = Manufacturer.networks[networkId]
    const sellerNetwork = Seller.networks[networkId]
    const consumerNetwork = Consumer.networks[networkId]

    // smart contract instances
    const manageContract = new web3.eth.Contract(ProductManagement.abi, manageNetwork.address)
    const manufContract = new web3.eth.Contract(Manufacturer.abi, manufNetwork.address)
    const sellerContract = new web3.eth.Contract(Seller.abi, sellerNetwork.address)
    const consumerContract = new web3.eth.Contract(Consumer.abi, consumerNetwork.address)

    setState({
      web3: web3,
      manageContract: manageContract,
      manufContract: manufContract,
      sellerContract: sellerContract,
      consumerContract: consumerContract
    })
  }
  provider && initWeb3()
  }, [])

  async function isOwner() {
    const { manufContract } = state
    const manuf = await manufContract.methods.owner().call()
    return accounts[0].toLowerCase() === manuf.toLowerCase()
  }

  async function showSerialNumber() {

    if (!await isOwner()) {
      window.alert("Hey, you are not the manufacturer!")
      return;
    }

    try {
      const { manufContract } = state
      const outputSN = await manufContract.methods.showSN(productId).call()
      setOutputSN(outputSN.toString())
    }
    catch (error) {
      console.error('ERROR_SHOW_SN:', error)
    }
  }

  async function verifyProduct() {
    try {
      const { manageContract } = state;
      const auth = await manageContract.methods.verifyProduct(inputSN).call()
      setAuth(auth)
      if (auth) {
        const id = await manageContract.methods.serialToProduct(inputSN).call()
        const productInfo = await manageContract.methods.products(id).call()
        const owner = await manageContract.methods.productToOwner(id).call()
        setNameInfo(productInfo[0])
        setSizeInfo(productInfo[1])
        setOriginInfo(productInfo[2])
        setPriceInfo(productInfo[3].toString())
        setYearInfo(productInfo[4].toString())
        setMonthInfo(productInfo[5].toString())
        setDateInfo(productInfo[6].toString())
        setOwnerInfo(owner)
      }
    } 
    catch (error) {
      console.error('ERROR VERIFY PRODUCT:', error)
    }
  }
  

  return (
    <div className='flex-containers'>
      {/* SHOW SN */}
      <div className='flex-items'>
        <h2> SHOW SERIAL NUMBER (FOR MANUFACTURER) </h2>
        <label> Input product Id: </label>
        <input
          type = "number"
          value = { productId } 
          onChange = {(e) => setProductId(e.target.value)}>
        </input> <span></span>
        <button onClick = { showSerialNumber }> Show Serial Number </button>
        <p> Serial number of product id {productId} = {outputSN} </p>
      </div>

      {/* VERIFY PRODUCT */}
      <div className='flex-items'>
        <h2 >VERIFY YOUR PRODUCT </h2>
        <label> Input Serial Number: </label>
        <input 
          type = "number"  
          value = {inputSN}
          onChange = {(e) => setInputSN(e.target.value)}>
        </input> <span></span>
        <button onClick = {verifyProduct}> Verify </button>

        {auth !== null && (
          <div>
            <p>Product is {auth ? 'authentic' : 'not authentic'}!</p>
            {auth && (
            <div>
              <p>Product name: {nameInfo}</p>
              <p>Product size: {sizeInfo}</p>
              <p>Product origin: {originInfo}</p>
              <p>Product price: {priceInfo}</p>
              <p>Manufacture date: {yearInfo}/{monthInfo}/{dateInfo}</p>
              <p>Owner: {ownerInfo}</p>
            </div>
            )}
          </div>
        )}
      </div>
        
    </div>
  )
}
export default Verify

