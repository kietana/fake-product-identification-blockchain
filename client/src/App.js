import Web3 from 'web3'
import { useState, useEffect } from 'react'
import ProductManagement from './contracts/ProductManagement.json'
import Manufacturer from './contracts/Manufacturer.json'
import Seller from './contracts/Seller.json'
import Consumer from './contracts/Consumer.json'
import Navbar from './components/Navbar/Navbar'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {

  const [accounts, setAccounts] = useState(null)
  const [totalProduct, setTotalProduct] = useState('nil')
  const [currentAcc, setCurrentAcc] = useState('nil')

  const [inputSN, setInputSN] = useState('')
  const [outputSN, setOutputSN] = useState('')
  const [auth, setAuth] = useState('')

  const [productId, setProductId] = useState('')
  const [sellerId, setSellerId] = useState('')

  // Add products
  const [addName, setAddName] = useState('') // product name
  const [addSize, setAddSize] = useState('')
  const [addOrigin, setAddOrigin] = useState('')
  const [addPrice, setAddPrice] = useState('')

  // Show Product info
  const [nameInfo, setNameInfo] = useState('') // product name
  const [sizeInfo, setSizeInfo] = useState('')
  const [originInfo, setOriginInfo] = useState('')
  const [priceInfo, setPriceInfo] = useState('')
  const [yearInfo, setYearInfo] = useState('')
  const [monthInfo, setMonthInfo] = useState('')
  const [dateInfo, setDateInfo] = useState('')
  const [ownerInfo, setOwnerInfo] = useState('')

  // Add Seller
  const [addSellerId, setAddSellerId] = useState('')
  const [addShopName, setAddShopName] = useState('')
  const [addSellerAddr, setAddSellerAddr] = useState('')

  // Top Up
  const [sellerTopUpId, setSellerTopUpId] = useState('')
  const [sellerTopUpAmt, setSellerTopUpAmt] = useState('')

  const [consumerTopUpAmt, setConsumerTopUpAmt] = useState('')

  // Balance
  const [sellerBalance, setSellerBalance] = useState('')
  const [sellerBalanceId, setSellerBalanceId] = useState('')
  const [sellerContractBalance, setSellerContractBalance] = useState('')

  const [consumerBalance, setConsumerBalance] = useState('')
  const [consumerContractBalance, setConsumerContractBalance] = useState('')

  // Buy Product
  const [sellerBuyId, setSellerBuyId] = useState('')
  const [sellerBuyPId, setSellerBuyPId] = useState('')

  const [consumerBuyPId, setConsumerBuyPId] = useState('')

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

  useEffect(() => {
    const { manageContract } = state
    async function getTotalProduct() {
      const totalProduct = await manageContract.methods.getTotalProduct().call()
      setTotalProduct(totalProduct.toString())
    }
    manageContract && getTotalProduct()
  }, [state])


  async function isOwner() {
    const { manufContract } = state
    const manuf = await manufContract.methods.owner().call()
    return accounts[0].toLowerCase() === manuf.toLowerCase()
  }

  async function addProduct() {

    if (!await isOwner()) {
      window.alert("Hey, you are not the manufacturer!")
      return;
    }

    try{
      const { manufContract } = state
      await manufContract.methods.addProduct(addName, addSize, addOrigin, addPrice).send({ from: accounts[0], gas: 3000000 })
      window.location.reload()
    } 
    catch(error) {
      if (error.code == 4001) {
        console.log("User rejected the transaction")
      }
    }
  }

  async function addSeller() {
    const {consumerContract, manageContract, manufContract} = state

    if (!await isOwner()) {
      window.alert("Hey, you are not the manufacturer!")
      return;
    }
    
    if (accounts[0].toLowerCase() === addSellerAddr.toLowerCase()) {
      window.alert("You are manufacturer and cannot be seller with the same account.")
      return;
    }

    if (await consumerContract.methods.isConsumer(addSellerAddr).call()) {
      window.alert("This is a consumer.")
      return;
    }

    let res = await manageContract.methods.getSellerData(addSellerId).call()

    if (res[1] || await manageContract.methods.isSellerAddr(addSellerAddr).call()) {
      window.alert("Seller already exist")
      return;
    }

    try{
      await manufContract.methods.addSeller(addSellerId, addShopName, addSellerAddr).send({ from: accounts[0], gas: 3000000 })
      window.location.reload()
    } 
    catch(error) {
      if (error.code == 4001) {
        console.log("User rejected the transaction")
      }
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

  async function querySeller() {
    const {manageContract} = state

    let res = await manageContract.methods.sellers(sellerId).call()
    if (!res[2]) { // res[2] is isSeller
      window.alert("Seller does not exist...")
      return;
    }
    else {
      window.alert("The seller exist!")
      return;
    }
  }

  function ethToWei(amt) {
    const { web3 } = state
    return web3.utils.toWei(amt, 'ether')
  }

  function weiToEth(amt) {
    const { web3 } = state
    return web3.utils.fromWei(amt, 'ether')
  }
  
  async function sellerTopUp() {
    const { manageContract, sellerContract } = state
    let res = await manageContract.methods.sellers(sellerTopUpId).call()

    if (!res[2] || accounts[0].toLowerCase() !== res[3].toString().toLowerCase()) {
      window.alert('Oops, you are not a seller!')
      return;
    }

    try {
      await sellerContract.methods.topUp(sellerTopUpId).send({from: accounts[0], gas: 3000000, value: ethToWei(sellerTopUpAmt)})
    }
    catch (error) {
      console.error('ERROR_SELLER_TOP_UP:', error)
    }
  }

  async function checkSellerBalance() {
    const { manageContract, sellerContract, web3 } = state
    let res = await manageContract.methods.sellers(sellerBalanceId).call()

    if (!res[2] || accounts[0].toLowerCase() !== res[3].toString().toLowerCase()) {
      window.alert('Oops, you are not a seller!')
      return;
    }

    try {
      const balance = await sellerContract.methods.checkBalance(sellerBalanceId).call()
      const contractBalance = await web3.eth.getBalance(sellerContract.options.address)
      setSellerBalance(weiToEth(balance).toString())
      setSellerContractBalance(weiToEth(contractBalance).toString())
    }
    catch (error) {
      console.error('ERROR_SELLER_CHECK_BALANCE:', error)
    }
  }

  async function sellerBuy() {
    const { manageContract, sellerContract } = state
    let res = await manageContract.methods.sellers(sellerBuyId).call()

    if (!res[2] || accounts[0].toLowerCase() !== res[3].toString().toLowerCase()) {
      window.alert('Oops, you are not a seller!')
      return;
    }

    try {
      await sellerContract.methods.buyFromManufacturer(sellerBuyId, sellerBuyPId).send({from: accounts[0], gas: 3000000})
    }
    catch (error) {
      console.error('ERROR_SELLER_BUY_PRODUCT:', error)
    }
  }

  async function joinAsConsumer() {
    const {consumerContract, manageContract} = state

    if (await consumerContract.methods.isConsumer(accounts[0]).call()) {
      window.alert("You already join the network as a consumer")
      return;
    }

    if (await isOwner()) {
      window.alert("You cannot be consumer with the same account.")
      return;
    }

    let res = await manageContract.methods.isSellerAddr(accounts[0]).call()
    if (res) {
      window.alert("Seller cannot be consumer with the same account")
      return;
    }

    try {
      await consumerContract.methods.registerConsumer(accounts[0]).send({from: accounts[0], gas: 3000000})
    }
    catch (error) {
      console.error('ERROR_JOIN_AS_CONSUMER:', error)
    }
  }

  async function consumerTopUp() {

    const {consumerContract} = state
    const consumer = await consumerContract.methods.isConsumer(accounts[0]).call()
    if (!consumer) {
      window.alert('Hm, you are not a registered consumer :(')
      return;
    }

    try {
      await consumerContract.methods.topUp(accounts[0]).send({from: accounts[0], gas: 3000000, value: ethToWei(consumerTopUpAmt)})
    }
    catch (error) {
      console.error('ERROR_SELLER_TOP_UP:', error)
    }
  }

  async function checkConsumerBalance() {
    const { consumerContract, web3 } = state
    let consumer = await consumerContract.methods.isConsumer(accounts[0]).call()

    if (!consumer) {
      window.alert('Hm, you are not a registered consumer :(')
      return;
    }

    try {
      const balance = await consumerContract.methods.checkBalance(accounts[0]).call()
      const contractBalance = await web3.eth.getBalance(consumerContract.options.address)
      setConsumerBalance(weiToEth(balance).toString())
      setConsumerContractBalance(weiToEth(contractBalance).toString())
    }
    catch (error) {
      console.error('ERROR_SELLER_CHECK_BALANCE:', error)
    }
  }  

  async function consumerBuy() {
    const { consumerContract } = state
    let consumer = await consumerContract.methods.isConsumer(accounts[0]).call()

    if (!consumer) {
      window.alert('Hm, you are not a registered consumer :(')
      return;
    }

    try {
      await consumerContract.methods.buyFromSeller(accounts[0], consumerBuyPId).send({from: accounts[0], gas: 3000000})
    }
    catch (error) {
      console.error('ERROR_CONSUMER_BUY_PRODUCT:', error)
    }
  }

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/' element={<Home/>}/>
     
      <Navbar/>
      


      <p>Total Product = { totalProduct } </p>
      <p>Current metamask account = { currentAcc } </p>

      {/* ADD PRODUCT */}

      <h2>ADD PRODUCT</h2>

      <label> Product Name: </label>
      <br></br>
      <input 
        type = "text"
        value = { addName }
        onChange = {(e) => setAddName(e.target.value)}>
      </input>

      <br></br>
      <label> Product Size: </label>
      <br></br>
      <input 
        type = "text"
        value = { addSize }
        onChange = {(e) => setAddSize(e.target.value)}>
      </input>

      <br></br>
      <label> Product Origin: </label>
      <br></br>
      <input 
        type = "text"
        value = { addOrigin }
        onChange = {(e) => setAddOrigin(e.target.value)}>
      </input>

      <br></br>
      <label> Product Price: </label>
      <br></br>
      <input 
        type = "text"
        value = { addPrice }
        onChange = {(e) => setAddPrice(e.target.value)}>
      </input>

      <br></br><br></br>
      <button onClick = { addProduct }> Add </button>

      {/* ADD SELLER  */}

      <h2>ADD SELLER</h2>
      <label> Seller Id: </label>
      <br></br>
      <input 
        type = "text"
        value = { addSellerId }
        onChange = {(e) => setAddSellerId(e.target.value)}>
      </input>

      <br></br>
      <label> Shop Name: </label>
      <br></br>
      <input 
        type = "text"
        value = { addShopName }
        onChange = {(e) => setAddShopName(e.target.value)}>
      </input>

      <br></br>
      <label> Seller Wallet Addr: </label>
      <br></br>
      <input 
        type = "text"
        value = { addSellerAddr }
        onChange = {(e) => setAddSellerAddr(e.target.value)}>
      </input>

      <br></br> <br></br>
      <button onClick = { addSeller }> Add </button>


      {/* SHOW SN */}

      <h2> SHOW SERIAL NUMBER (FOR MANUFACTURER) </h2>
      <label> Input product Id: </label>
      <input
        type = "number"
        value = { productId } 
        onChange = {(e) => setProductId(e.target.value)}>
      </input> <span></span>
      <button onClick = { showSerialNumber }> Show Serial Number </button>
      <p> Serial number of product id {productId} = {outputSN} </p>


      {/* VERIFY PRODUCT */}

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
           </BrowserRouter>
        </div>
      )}

      {/* QUERY SELLER */}

      <h2> QUERY SELLER </h2>
      <label> Input Seller Id: </label>
      <input 
        type = "text"  
        value = {sellerId}
        onChange = {(e) => setSellerId(e.target.value)}>
      </input> <span></span>
      <button onClick = {querySeller}> check </button>

      {/* SELLER TOP UP */}

      <h2> SELLER TOP UP BALANCE </h2>
      <label> Seller Id: </label>
      <input 
        type = "text"  
        value = {sellerTopUpId}
        onChange = {(e) => setSellerTopUpId(e.target.value)}>
      </input> <br></br>
      <label> Input amount: </label>
      <input 
        type = "number"  
        value = {sellerTopUpAmt}
        onChange = {(e) => setSellerTopUpAmt(e.target.value)}>
      </input> <br></br>
      <button onClick = {sellerTopUp}> Top up </button>

      {/* SELLER CHECK BALANCE */}

      <h2> SELLER CHECK BALANCE </h2>
      <label> Seller Id: </label>
      <input 
        type = "text"  
        value = {sellerBalanceId}
        onChange = {(e) => setSellerBalanceId(e.target.value)}>
      </input> <br></br>
      <button onClick = {checkSellerBalance}> Check </button>
      <p>Your balance is = {sellerBalance}</p>

      {/* SELLER CONTRACT BALANCE */}

      <h2> SELLER CONTRACT BALANCE </h2>
      <p>Seller contract balance is = {sellerContractBalance}</p>

      {/* SELLER BUY  FROM MANUFACTURER */}

      <h2> SELLER BUY PRODUCT </h2>
      <label> Seller Id: </label>
      <input 
        type = "text"  
        value = { sellerBuyId }
        onChange = {(e) => setSellerBuyId(e.target.value)}>
      </input> <br></br>
      <label> Product Id: </label>
      <input 
        type = "number"  
        value = { sellerBuyPId }
        onChange = {(e) => setSellerBuyPId(e.target.value)}>
      </input> <br></br>
      <button onClick = {sellerBuy}> Buy </button>

      {/* CONSUMER REGISTER THEMSELVES */}
          
      <h2> JOIN AS CONSUMER </h2>
      <button onClick = { joinAsConsumer }> JOIN </button>

      {/* CONSUMER TOP UP  */}
      
      <h2> CONSUMER TOP UP BALANCE </h2>
      <label> Input amount: </label>
      <input 
        type = "number"  
        value = {consumerTopUpAmt}
        onChange = {(e) => setConsumerTopUpAmt(e.target.value)}>
      </input> <br></br>
      <button onClick = {consumerTopUp}> Top up </button>

      {/* CONSUMER CHECK BALANCE */}

      <h2> CONSUMER CHECK BALANCE </h2>
      <button onClick = {checkConsumerBalance}> Check </button>
      <p>Your balance is = {consumerBalance}</p>

      {/* CONSUMER CONTRACT BALANCE */}
          
      <h2> CONSUMER CONTRACT BALANCE </h2>
      <p>Consumer contract balance is = {consumerContractBalance}</p>

      {/* CONSUMER BUY PRODUCT */}

      <h2> CONSUMER BUY PRODUCT </h2>
      <label> Product Id: </label>
      <input 
        type = "number"  
        value = { consumerBuyPId }
        onChange = {(e) => setConsumerBuyPId(e.target.value)}>
      </input> <br></br>
      <button onClick = {consumerBuy}> Buy </button>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
