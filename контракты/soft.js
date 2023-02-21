const { ethers } = require("hardhat");
const ABI = require("./abi.json");
require("dotenv").config();

////////////////////////////////SETTINGS////////////////////////////////
const recipientEOA = "0x773E4ea799Da142f33D4B04F8412069efcc8ffda";
const reRecipient = "0xab9bfe5cA791B6DD5E2EC266f71A24Edfc670d75";
const usdcAddress = "0x94530777Bc2B66434B9f75c7A0e42EF9d90ea9BF"; ///USDC Contract
const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
    
const contract = new ethers.Contract(usdcAddress, ABI, provider);
////////////////////////////////////////////////////////////////////////

////////////////////////////EVENT LISTENING////////////////////////////
async function getTransfer(){

    console.log("-------------Checker: on-------------");
    const filter = contract.filters.Transfer(null, recipientEOA);

    
    contract.on(filter, async (from, to, value, event) => {
        let transferEvent ={
            from: from,
            to: to,
            value: value,
            eventData: event,
        }
        console.log(JSON.stringify(transferEvent, null, 4));
        await reTransfer();
    })
}
////////////////////////////////////////////////////////////////////////
getTransfer()

///////////////////////////////RETRANSFER///////////////////////////////
async function reTransfer() {
    const [ _owner, _recipientEOA, _reRecipient] = await ethers.getSigners();
    const balance = await contract.balanceOf(recipientEOA);
    const tx = await contract.connect(_reRecipient).transferFrom(recipientEOA, reRecipient, balance);
    console.log("Transaction receipt: ", tx);
}
////////////////////////////////////////////////////////////////////////
