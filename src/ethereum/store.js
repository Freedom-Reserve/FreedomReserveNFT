import { ethers, BigNumber} from "ethers"; //BigNumber
//import { config } from "./config";
import {extractCompo, toWei, fromWei, GWEI, addr0, getCtrtAddresses, getGasData, fromWeiE} from "./ethFunc";

//--------------------------==
//--------------------------== Sale Contract
export const getSalePrice = async (compo) => new Promise(async (resolve, reject) => {
  console.log("---------== getSalePrice()");
  const [instNFT721Sales, addrFrom] = await extractCompo(compo, 1, 0);
  try {
    if (instNFT721Sales !== undefined && addrFrom !== "") {
      const priceInWeiETH = await instNFT721Sales.methods.priceInWeiETH().call();
      const priceInETHETH = fromWei(priceInWeiETH);
      resolve(priceInETHETH);
    } else {
      console.log("addr:", addrFrom);
      console.error("instNFT721Sales or addrFrom invalid")
    }
  } catch (err) {
    console.error("err@getSalePrice:", err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});

//--------------------------== ERC721 Contract
export const ReadFunc = async (compo) =>
new Promise(async (resolve, reject) => {
  console.log("---------== ReadFunc()");
  const [instNFT721Creature, acct0] = await extractCompo(compo, 0, 0);
  if (instNFT721Creature === undefined) {
    resolve(-1);
  }
  try {
    const data = await instNFT721Creature.methods.name().call();
    console.log("data:", data);
    resolve(data);
  } catch (err) {
    console.error("ReadFunc() failed.", err);
    reject(-1);
  }
});

export const BalanceOf = async (compo) =>
new Promise(async (resolve, reject) => {
  console.log("---------== BalanceOf()");
  const [instNFT721Creature, acct0] = await extractCompo(compo, 0, 0);
  if (instNFT721Creature === undefined) {
    resolve(-1);
  }
  try {
    const balance = await instNFT721Creature.methods.balanceOf(acct0).call();
    console.log("balance:", balance);
    resolve(balance);
  } catch (err) {
    console.error("BalanceOf() failed.", err);
    reject(-1);
  }
});

export const CheckUser = async (compo) =>
new Promise(async (resolve, reject) => {
  console.log("---------== CheckUser()");
  const [instNFT721Creature, acct0] = await extractCompo(compo, 0, 0);
  if (instNFT721Creature === undefined) {
    resolve(-1);
  }

  try {
    const CheckUserResult = await instNFT721Creature.methods.checkOwner(acct0).call();
    console.log("CheckUserResult:", CheckUserResult);
    resolve(CheckUserResult);
  } catch (err) {
    console.error("CheckUser() failed.", err);
    reject(-1);
  }
});

export const CheckAvailable = async (compo) =>
new Promise(async (resolve, reject) => {
  console.log("---------== CheckAvailable()");
  const [instNFT721Creature, acct0] = await extractCompo(compo, 0, 0);
  if (instNFT721Creature === undefined) {
    resolve(-1);
  }
  const [addrNFT721Creature, addrNFT721Sales]= await getCtrtAddresses();
  console.log("addrNFT721Creature:", addrNFT721Creature, "\naddrNFT721Sales:", addrNFT721Sales);
  try {
    const checkAvailableResult = await instNFT721Creature.methods.checkOwner(addrNFT721Sales).call();
    console.log("checkAvailableResult:", checkAvailableResult);
    resolve(checkAvailableResult);
  } catch (err) {
    console.error("CheckAvailable() failed.", err);
    reject(-1);
  }
});


export const GetXYZ = async (compo, userAddr, option) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetXYZ()");
  const [instNFT721Creature, acct0] = await extractCompo(compo, 0, 0);
  if (instNFT721Creature === undefined || acct0 === undefined) {
    resolve(-1);
    return false;
  }

  if (userAddr === undefined || userAddr === "") {
    userAddr = acct0;
    console.log("using default accounts[0]");
  }
  console.log("userAddr:", userAddr);
  try {
    const data = await instNFT721Creature.methods.betters(userAddr).call();
    console.log("data:", data);
    if(option === 0){
      resolve(data.deposit);
    } else if(option === 1){
      resolve(data.balance);
    } else if(option === 2){
      resolve(data.winloss);
    } else {
      resolve(data);
    }
  } catch (err) {
    console.error("GetXYZ() failed.", err);
    reject(-1);
  }
});


//-------------==
export const isTokenAvailable = async (compo, tokenId) => new Promise(async (resolve, reject) => {
  console.log("---------== isTokenAvailable()");
  const [instNFT721Creature, addrFrom] = await extractCompo(compo, 0, 0);
  try {
    if (instNFT721Creature !== undefined && addrFrom !== "") {
      const isExisting = await instNFT721Creature.methods.exists(tokenId).call();
      const tokenOwner = await instNFT721Creature.methods.ownerOf(tokenId).call();
      const isNotOwned = tokenOwner !== addrFrom;
      console.log("isExisting:", isExisting, ", isNotOwned:", isNotOwned);
      resolve(isExisting && isNotOwned);
    } 
  }catch (err) {
    console.error(err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});

export const buyNFTViaETH = async (compo, gasPrice, gasLimit, tokenId) => new Promise(async (resolve, reject) => {
  console.log("---------== buyNFTViaETH()");
  const [instNFT721Sales, addrFrom] = await extractCompo(compo, 1, 0);

  try {
    if (instNFT721Sales !== undefined && addrFrom !== "") {
      // const addrNFTContract = await instNFT721Sales.methods.addrNFTContract().call();
      // console.log("addrNFTContract:",addrNFTContract );
      const isAvailable = await isTokenAvailable(compo, tokenId);
      if(!isAvailable){
        console.log("tokenId not available");
        reject("tokenId not available");
        return false;
      }

      const priceInWeiETH = await instNFT721Sales.methods.priceInWeiETH().call();
      //const value1= web3.utils.toWei('0.1', "ether");

      console.log("addrFrom:", addrFrom, ", gasPrice:", gasPrice, ", gasLimit:", gasLimit, tokenId, priceInWeiETH, typeof priceInWeiETH );
    
      await instNFT721Sales.methods
        .buyNFTViaETH(tokenId)
        .send({
          from: addrFrom,
          value: priceInWeiETH,
          gasPrice: gasPrice * GWEI,
          gas: gasLimit,
        })
        .on("receipt", (receipt) => {
          console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
          resolve(receipt.transactionHash);
        })
        .on("error", async(err, receipt) => {
          console.error("err@buyNFTViaETH:", err);
          const result = await buyNFTViaETHCheck(compo, gasPrice, gasLimit, tokenId).catch((err) => {
            console.error("err@buyNFTViaETHCheck:", err)
            reject(err);
            return false;
          });;
          console.log("buyNFTViaETHCheck result:", result);
          reject(err);
          return false;
        });
    } else {
      resolve("contract instance or addrFrom invalid");
    }
  } catch (err) {
    console.error(err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});

export const buyNFTViaETHCheck = async (compo, gasPrice, gasLimit, tokenId) => new Promise(async (resolve, reject) => {
  console.log("---------== buyNFTViaETHCheck()");
  const [instNFT721Sales, addrFrom] = await extractCompo(compo, 1, 0);

  console.log("addrFrom:", addrFrom, gasPrice, gasLimit, tokenId);
  try {
    if (instNFT721Sales !== undefined && addrFrom !== "") {
      const result = await instNFT721Sales.methods
        .BuyNFTViaETHCheck(tokenId)
        .call({from: addrFrom});
        resolve(result);
    } else {
      resolve("contract instance or addrFrom invalid");
    }
  } catch (err) {
    console.error(err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});

