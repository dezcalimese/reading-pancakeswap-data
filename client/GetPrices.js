const ethers = require("ethers")

const { addressFactory, addressRouter, addressFrom, addressTo } = require("./AddressList")

const { erc20ABI, factoryABI, pairABI, routerABI } = require("./AbiList")

// Standard Provider
const provider = new ethers.providers.JsonRpcProvider(
    "https://bsc-dataseed.binance.org/"
)

// Connect to factory
const contractFactory = new ethers.Contract(
    addressFactory, 
    factoryABI, 
    provider
)

// Connect to router
const contractRouter = new ethers.Contract(
    addressRouter, 
    routerABI, 
    provider
)

// Call the blockchain
const getPrices = async (readableAmount) => {
    // Convert amount in
    const contractToken = new ethers.Contract(addressFrom, erc20ABI, provider)
    const decimals = await contractToken.decimals()
    const amountIn = ethers.utils.parseUnits(readableAmount, decimals).toString() // Getting something computer readable using ethers.parseUnits
    
    // Get amounts out
    const amountsOut = await contractRouter.getAmountsOut(amountIn, [addressFrom, addressTo])

    // Convert amount out (in decimals)
    const contractToken2 = new ethers.Contract(addressTo, erc20ABI, provider)
    const decimals2 = await contractToken2.decimals()
    
    // Convert amount out (human readable)
    const amountsOutHuman = ethers.utils.formatUnits(amountsOut[1].toString(), decimals2) // Getting something human readable using ethers.formatUnits
    console.log(amountsOutHuman)
}

const readableAmount = "500"
getPrices(readableAmount)