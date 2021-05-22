import { ethers, BigNumber} from "ethers"; //BigNumber
//import { config } from "./config";
import {extractCompo, toWei, fromWei, GWEI, addr0, getCtrtAddresses, getGasData, fromWeiE, log1} from "./ethFunc";
import { config } from "./config";

//--------------------------==
//--------------------------== Sale Contract
export const getSalePrice = async (compo) => new Promise(async (resolve, reject) => {
  log1("---------== getSalePrice()");
  const [instNFT721Sales, addrFrom] = await extractCompo(compo, 1, 0);
  try {
    if (instNFT721Sales !== undefined && addrFrom !== "") {
      const priceInWeiETH = await instNFT721Sales.methods.priceInWeiETH().call();
      const priceInETHETH = fromWei(priceInWeiETH);
      resolve(priceInETHETH);
    } else {
      log1("addr:", addrFrom);
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
  log1("---------== ReadFunc()");
  const [instNFT721Creature, addrFrom] = await extractCompo(compo, 0, 0);
  if (instNFT721Creature === undefined) {
    resolve(-1);
  }
  try {
    const data = await instNFT721Creature.methods.name().call();
    log1("data:", data);
    resolve(data);
  } catch (err) {
    console.error("ReadFunc() failed.", err);
    reject(-1);
  }
});

export const BalanceOf = async (compo) =>
new Promise(async (resolve, reject) => {
  log1("---------== BalanceOf()");
  const [instNFT721Creature, addrFrom] = await extractCompo(compo, 0, 0);
  if (instNFT721Creature === undefined) {
    resolve(-1);
  }
  try {
    const balance = await instNFT721Creature.methods.balanceOf(addrFrom).call();
    log1("balance:", balance);
    resolve(balance);
  } catch (err) {
    console.error("BalanceOf() failed.", err);
    reject(-1);
  }
});

export const CheckUser = async (compo) =>
new Promise(async (resolve, reject) => {
  log1("---------== CheckUser()");
  const [instNFT721Creature, addrFrom] = await extractCompo(compo, 0, 0);
  if (instNFT721Creature === undefined) {
    resolve(-1);
  }

  try {
    const CheckUserResult = await instNFT721Creature.methods.checkOwner(addrFrom).call();
    log1("CheckUserResult:", CheckUserResult);
    resolve(CheckUserResult);
  } catch (err) {
    console.error("CheckUser() failed.", err);
    reject(-1);
  }
});

export const CheckAvailable = async (compo) =>
new Promise(async (resolve, reject) => {
  log1("---------== CheckAvailable()");
  const [instNFT721Creature, addrFrom] = await extractCompo(compo, 0, 0);
  if (instNFT721Creature === undefined) {
    resolve(-1);
  }
  const [addrNFT721Creature, addrNFT721Sales]= await getCtrtAddresses();
  log1("addrNFT721Creature:", addrNFT721Creature, "\naddrNFT721Sales:", addrNFT721Sales);
  try {
    const checkAvailableResult = await instNFT721Creature.methods.checkOwner(addrNFT721Sales).call();
    log1("checkAvailableResult:", checkAvailableResult);
    resolve(checkAvailableResult);
  } catch (err) {
    console.error("CheckAvailable() failed.", err);
    reject(-1);
  }
});


export const GetXYZ = async (compo, userAddr, option) =>
new Promise(async (resolve, reject) => {
  log1("---------== GetXYZ()");
  const [instNFT721Creature, addrFrom] = await extractCompo(compo, 0, 0);
  if (instNFT721Creature === undefined || addrFrom === undefined) {
    resolve(-1);
    return false;
  }

  if (userAddr === undefined || userAddr === "") {
    userAddr = addrFrom;
    log1("using default accounts[0]");
  }
  log1("userAddr:", userAddr);
  try {
    const data = await instNFT721Creature.methods.betters(userAddr).call();
    log1("data:", data);
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
  log1("---------== isTokenAvailable()");
  const [instNFT721Creature, addrFrom] = await extractCompo(compo, 0, 0);
  try {
    if (instNFT721Creature !== undefined && addrFrom !== "") {
      const isExisting = await instNFT721Creature.methods.exists(tokenId).call();
      const tokenOwner = await instNFT721Creature.methods.ownerOf(tokenId).call();
      const isNotOwned = tokenOwner !== addrFrom;
      log1("isExisting:", isExisting, ", isNotOwned:", isNotOwned);
      resolve(isExisting && isNotOwned);
    } 
  }catch (err) {
    console.error(err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});

export const buyNFTViaETH = async (compo, gasPrice, gasLimit, tokenId) => new Promise(async (resolve, reject) => {
  log1("---------== buyNFTViaETH()");
  const [instNFT721Sales, addrFrom] = await extractCompo(compo, 1, 0);

  try {
    if (instNFT721Sales !== undefined && addrFrom !== "") {
      // const addrNFTContract = await instNFT721Sales.methods.addrNFTContract().call();
      // log1("addrNFTContract:",addrNFTContract );
      const isAvailable = await isTokenAvailable(compo, tokenId);
      if(!isAvailable){
        log1("tokenId not available");
        reject("tokenId not available");
        return false;
      }

      const priceInWeiETH = await instNFT721Sales.methods.priceInWeiETH().call();
      //const value1= web3.utils.toWei('0.1', "ether");

      log1("addrFrom:", addrFrom, ", gasPrice:", gasPrice, ", gasLimit:", gasLimit, ", tokenId:", tokenId, priceInWeiETH, typeof priceInWeiETH );
    
      await instNFT721Sales.methods
        .buyNFTViaETH(tokenId)
        .send({
          from: addrFrom,
          value: priceInWeiETH,
          gasPrice: gasPrice * GWEI,
          gas: gasLimit,
        })
        .on("receipt", (receipt) => {
          log1(`receipt: ${JSON.stringify(receipt, null, 4)}`);
          resolve(receipt.transactionHash);
        })
        .on("error", async(err, receipt) => {
          console.error("err@buyNFTViaETH:", err);
          const result = await buyNFTViaETHCheck(compo, gasPrice, gasLimit, tokenId).catch((err) => {
            console.error("err@buyNFTViaETHCheck:", err)
            reject(err);
            return false;
          });;
          log1("buyNFTViaETHCheck result:", result);
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


/**
 * @param {*} compo 
 * @param {*} amount 
 */
 export const Allowance = async (compo, amount = "0") => new Promise(async (resolve, reject) => {
  console.log("---------== Allowance()");
  const [instNFT721Sales, instERC20Token, addrFrom] = await extractCompo(compo, 3, 0);
  if (amount === "") amount = "0";
  let amountWei  = toWei(amount);
  const addrsCtrt = await getCtrtAddresses();
  console.log("addrFrom:", addrFrom, ", amount:", amount, amountWei.toString());
  try {
    if (instERC20Token !== undefined && addrFrom !== "") {
      const result = await instERC20Token.methods
        .allowance(addrFrom, addrsCtrt[1]).call();
      const isAllowed = parseInt(result) !== 0 && parseInt(result) >= parseInt(amountWei);
        resolve([isAllowed, fromWei(result), amountWei]);
    }
    resolve("contract instance not existing");
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

export const buyNFTViaToken = async (compo, gasPrice, gasLimit, tokenId) => new Promise(async (resolve, reject) => {
  log1("---------== buyNFTViaToken()");
  const [instNFT721Sales, instERC20Token, addrFrom] = await extractCompo(compo, 3, 0);

  try {
    if (instNFT721Sales !== undefined && instERC20Token !== undefined && addrFrom !== "") {
      log1("addrFrom:", addrFrom, ", gasPrice:", gasPrice, ", gasLimit:", gasLimit, ", tokenId:", tokenId);

      //-------------==
      const isAvailable = await isTokenAvailable(compo, tokenId);
      if(!isAvailable){
        log1("tokenId not available");
        reject("tokenId not available");
        return false;
      }
      //-------------== check ERC20 allowance
      const priceInWeiToken = await instNFT721Sales.methods.priceInWeiToken().call().catch((err) => {
        console.warn("err@ instNFT721Sales.methods.priceInWeiToken", err);
        //setErrMsg("buyNFTViaToken1 failed");
        return false;
      });
      //const value1= web3.utils.toWei('0.1', "ether");
      log1("priceInWeiToken:", priceInWeiToken);

      const [addrNFT721Creature, addrNFT721Sales]= await getCtrtAddresses();
      log1("addrNFT721Sales:", addrNFT721Sales, ", addrFrom:", addrFrom);

      const allowance = await instERC20Token.methods.allowance(addrFrom, addrNFT721Sales).call().catch((err) => {
        console.warn("err@ instERC20Token.methods.allowance", err);
        //setErrMsg("buyNFTViaToken1 failed");
        return false;
      });

      const isAllowed = parseInt(allowance) >= parseInt(priceInWeiToken);
      log1("allowance:", allowance, ", isAllowed:", isAllowed);

      if(isAllowed){
        log1("the user has enough allowance");

      } else {
        log1("needs to approve more allowance");
        await instERC20Token.methods
        .approve(addrNFT721Sales, priceInWeiToken)
        .send({
          from: addrFrom,
          gasPrice: gasPrice * GWEI,
        })
        .on("receipt", (receipt) => {
          console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
          //resolve(receipt.transactionHash);
        })
        .on("error", (err, receipt) => {
          console.error("txn failed:", err);
          reject(err);
          return false;
        });
      }

      //-------------==
      log1("addrFrom:", addrFrom, ", gasPrice:", gasPrice, ", gasLimit:", gasLimit, tokenId, priceInWeiToken, typeof priceInWeiToken );

      await instNFT721Sales.methods
        .buyNFTViaERC20(tokenId)
        .send({
          from: addrFrom,
          gasPrice: gasPrice * GWEI,
          gas: gasLimit,
        })
        .on("receipt", (receipt) => {
          log1(`receipt: ${JSON.stringify(receipt, null, 4)}`);
          resolve(receipt.transactionHash);
        })
        .on("error", async(err, receipt) => {
          console.error("err@buyNFTViaToken:", err);
          // const result = await buyNFTViaTokenCheck(compo, gasPrice, gasLimit, tokenId).catch((err) => {
          //   console.error("err@buyNFTViaTokenCheck:", err)
          //   reject(err);
          //   return false;
          // });;
          // log1("buyNFTViaTokenCheck result:", result);
          reject(err);
          return false;
        });
    } else {
      resolve("contract instance or addrFrom invalid");
    }
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

export const buyNFTViaETHCheck = async (compo, gasPrice, gasLimit, tokenId) => new Promise(async (resolve, reject) => {
  log1("---------== buyNFTViaETHCheck()");
  const [instNFT721Sales, addrFrom] = await extractCompo(compo, 1, 0);

  log1("addrFrom:", addrFrom, gasPrice, gasLimit, tokenId);
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

//-----------------------== ERC20Token Functions
export const Approve = async (compo, gasPrice, gasLimit, amount = '100000') => new Promise(async (resolve, reject) => {
  console.log("---------== Approve()");
  const [instNFT721Sales, instERC20Token, addrFrom] = await extractCompo(compo, 3, 0);

  const amountWei  = toWei(amount);
  const addrsCtrt = await getCtrtAddresses();
  console.log("addrFrom:", addrFrom,  ", amount:", amount, amountWei.toString());
  try {
    if (instERC20Token !== undefined && addrFrom !== "") {
      await instERC20Token.methods
        .approve(addrsCtrt[1], amountWei)
        .send({
          from: addrFrom,
          gasPrice: gasPrice * GWEI,
        })
        .on("receipt", (receipt) => {
          console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
          resolve(receipt.transactionHash);
        })
        .on("error", (err, receipt) => {
          console.error("txn failed:", err);
          reject(err);
          return false;
        });
    }
    resolve("contract instance not existing");
  } catch (err) {
    console.error(err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});

