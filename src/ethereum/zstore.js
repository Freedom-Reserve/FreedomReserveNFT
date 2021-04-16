//import { ethers, BigNumber} from "ethers"; //BigNumber
import { assetNames, config } from "./config";
import {extractCompo, toWei, fromWei, GWEI, getCtrtAddresses, getERC20Balance, log1, bigNum} from "./ethFunc";
import Decimal from "decimal.js";
//import getGasPriceBSC from "../../../../../../stores/functions/getGasPriceBSC";
//--------------------------==
let option = 0, bool1 = false, uintNum = 0;

//--------------------------== initAction()
/** should be run once and save compo1 into a state variable for all other functions to use

*/
//--------------------------==
export const getAssetId = (assetName) =>
{
  if (assetName === "bitcoin") {
    return '0';
  } else if (assetName === "ethereum") {
    return '1';
  } else {
    console.warn("assetName invalid. use default");
    return '0';
  }
}

export const getGasPriceBSC = async () => {
  const url = "https://bsc-dataseed2.binance.org";
  const gasFee = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({"jsonrpc":"2.0", "id":1, "method":"eth_gasPrice", "params": []}) // body data type must match "Content-Type" header
  }).then(response => response.json()).then(r => r.result);
  return gasFee;
};

export const GetCurrentPrice = async (compo, assetName) =>
  new Promise(async (resolve, reject) => {
    console.log("---------== GetCurrentPrice()");
    console.log("assetName:", assetName);
    let instPricefeed;
    let assetPair = getAssetId(assetName);
    if(assetPair === '-1') {
      console.warn("GetCurrentPrice assetName invalid. use default bitcoin");
      assetPair = '0';
    }
    if(assetPair === '0'){
      [instPricefeed] = extractCompo(compo, "chainlinkPF_btcusd");
      if (instPricefeed === undefined) {
        reject(-1);
        return false;
      }
    } else if(assetPair === '1'){
      [instPricefeed] = extractCompo(compo, "chainlinkPF_ethusd");
      if (instPricefeed === undefined) {
        reject(-1);
        return false;
      }
    } else {
      console.error("assetName invalid");
      reject(-1);
      return false;
    }
    try {
      const data = await instPricefeed.methods.latestRoundData().call();
      //console.log("GetCurrentPrice:", data);
      resolve([data[3], data[1]]);
    } catch (err) {
      console.error("GetCurrentPrice() failed.", err);
      reject(-1);
    }
  });

export const GetMaxBetLimit = async (compo) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetMaxBetLimit()");
  const [instPriceBetting] = extractCompo(compo, "pricebetting");
  if (instPriceBetting === undefined) {
    reject(-1);
    return false;
  }
  try {
    const data = await instPriceBetting.methods.maxBetAmt().call();
    resolve(data);
  } catch (err) {
    console.error("GetMaxBetLimit() failed.", err);
    reject(-1);
  }
});

export const GetTotalUnclaimed = async (compo) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetTotalUnclaimed()");
  const [instPriceBetting] = extractCompo(compo, "pricebetting");
  if (instPriceBetting === undefined) {
    reject(-1);
    return false;
  }
  try {
    const data = await instPriceBetting.methods.totalUnclaimed().call();
    resolve(data);
  } catch (err) {
    console.error("GetTotalUnclaimed() failed.", err);
    reject(-1);
  }
});

export const GetStakingPoolBalance = async (compo) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetStakingPoolBalance()");
  const [instPriceBetting] = extractCompo(compo, "pricebetting");
  if (instPriceBetting === undefined) {
    reject(-1);
    return false;
  }

  try {
    const data = await instPriceBetting.methods.poolBalance().call();
    resolve(data);
  } catch (err) {
    console.error("GetStakingPoolBalance() failed.", err);
    reject(-1);
  }
});

export const GetSharePrice = async (compo) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetSharePrice()");
  const [instPriceBetting] = extractCompo(compo, "pricebetting");
  if (instPriceBetting === undefined) {
    reject(-1);
    return false;
  }

  try {
    const data = await instPriceBetting.methods.sharePrice().call();
    console.log("data:", data);
    resolve(data);
    //resolve(Number(data.toString())/1000);
  } catch (err) {
    console.error("GetSharePrice() failed.", err);
    reject(-1);
  }
});

export const GetGovBalance = async (compo) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetGovBalance()");
  const [instPriceBetting] = extractCompo(compo, "pricebetting");
  if (instPriceBetting === undefined) {
    reject(-1);
    return false;
  }

  try {
    const data = await instPriceBetting.methods.govBalance().call();
    resolve(data);
  } catch (err) {
    console.error("GetGovBalance() failed.", err);
    reject(-1);
  }
});

export const GetTotalPoolShare = async (compo) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetTotalPoolShare()");
  const [instPriceBetting] = extractCompo(compo, "pricebetting");
  if (instPriceBetting === undefined) {
    reject(-1);
    return false;
  }

  try {
    const data = await instPriceBetting.methods.totalShares().call();
    resolve(data);
  } catch (err) {
    console.error("GetTotalPoolShare() failed.", err);
    reject(-1);
  }
});

//-------------==
export const GetBetterBalance = async (compo, userAddr) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetBetterBalance()");

  try {
    const data = await GetBetter(compo, userAddr, 0);
    resolve(data);
  } catch (err) {
    console.error("GetBetterBalance() failed.", err);
    reject(-1);
  }
});

export const GetBetterProfit = async (compo, userAddr) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetBetterProfit()");

  try {
    const data = await GetBetter(compo, userAddr, 1);
    resolve(data);
  } catch (err) {
    console.error("GetBetterProfit() failed.", err);
    reject(-1);
  }
});


export const GetBetter = async (compo, userAddr, option) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetBetter()");
  const [instPriceBetting, acct0] = extractCompo(compo, "pricebetting",  0);
  if (instPriceBetting === undefined || acct0 === undefined) {
    reject(-1);
    return false;
  }

  if (userAddr === undefined || userAddr === "") {
    userAddr = acct0;
    console.log("using default accounts[0]");
  }
  console.log("userAddr:", userAddr);

  try {
    const data = await instPriceBetting.methods.betters(userAddr).call();
    //console.log("data:", data);
    if(option === 0){
      resolve(data.balance);
    } else if(option === 1){
      resolve(data.winloss);
    } else {
      resolve(data);
    }
  } catch (err) {
    console.error("GetBetter() failed.", err);
    reject(-1);
  }
});

//-------------==
export const GetPoolerShare = async (compo, userAddr) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetPoolerShare()");

  try {
    const data = await GetPooler(compo, userAddr, 0);
    resolve(data);
  } catch (err) {
    console.error("GetPoolerShare() failed.", err);
    reject(-1);
  }
});

export const GetPoolerStakeBalance = async (compo, userAddr) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetPoolerStakeBalance()");

  try {
    const data = await GetPooler(compo, userAddr, 1);
    resolve(data);
  } catch (err) {
    console.error("GetPoolerStakeBalance() failed.", err);
    reject(-1);
  }
});

export const GetPooler = async (compo, userAddr, option) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetPooler()");
  const [instPriceBetting, acct0] = extractCompo(compo, "pricebetting",  0);
  if (instPriceBetting === undefined || acct0 === undefined) {
    reject(-1);
    return false;
  }
  if (userAddr === undefined || userAddr === "") {
    userAddr = acct0;
    console.log("using default accounts[0]");
  }

  try {
    const data = await instPriceBetting.methods.poolers(acct0).call();
    if(option === 0){
      resolve(data.shares);
    } else if(option === 1){
      resolve(data.staking);
    } else {
      resolve(data);
    }
  } catch (err) {
    console.error("GetPooler() failed.", err);
    reject(-1);
  }
});

export const GetDataStaking = async (compo, userAddr) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetDataStaking()");
  const [instPriceBetting] = extractCompo(compo, "pricebetting");
  if (instPriceBetting === undefined) {
    reject(-1);
    return false;
  }
  try {
    const data = await instPriceBetting.methods.getDataStaking(userAddr).call();
    //bigNum(data[1]).mul(bigNum(data[4]).div(bigNum(1000)));log1("totalLiquidity:", totalLiquidity.toString());
    log1("poolBalance == totalLiquidity:", data[0]);
    const totalLiquidity = data[0];
    // log1("totalShares:", data[1]);
    // log1("ctrtTokenBalance:", data[2]);
    log1("poolerShares:", data[3][0]);
    // log1("poolerStaking:", data[3][1]);
    log1("sharePrice x1000:", data[4]);
    const poolerUiBalance = bigNum(data[3][0]).mul(bigNum(data[4])).div(bigNum(1000));
    log1("poolerUiBalance:", poolerUiBalance.toString());
    log1("effPoolerBalance:", data[5]);
    resolve([data[0], data[1], data[2], data[3], data[4], totalLiquidity, poolerUiBalance.toString()]);
  } catch (err) {
    console.error("GetDataStaking() failed.", err);
    reject(-1);
  }
});

export const GetDataBetIndexes = async (compo, userAddr) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetDataBetIndexes()");
  const [instPriceBetting, acct0] = extractCompo(compo, "pricebetting",  0);
  if (instPriceBetting === undefined || acct0 === undefined) {
    reject(-1);
    return false;
  }
  if (userAddr === undefined || userAddr === "") {
    userAddr = acct0;
    console.log("using default accounts[0]");
  }

  //var ts = Math.round((new Date()).getTime() / 1000);
  //log1("unix time:", ts);

  try {
    const data = await instPriceBetting.methods.getDataBetIndexes(userAddr).call();
    const blocktime = data[0].toString();
    const idxU = data[1].toString();
    const idxC = data[2].toString();
    log1("blocktime:", blocktime);
    log1("idxU:", idxU,", idxC:", idxC);
    resolve(data);
  } catch (err) {
    console.error("GetDataBetIndexes() failed.", err);
    reject(-1);
  }
});
//-------------==
/**
#1 active or historical ( 1 or 0)
#2 current page number
return pagingnum
*/


export const GetAccountIndexes = async (compo, userAddr) =>
new Promise(async (resolve, reject) => {
  console.log("---------== getAccountIndexes()");
  const [instPricebetting, acct0] = extractCompo(compo, "pricebetting",  0);
  if (instPricebetting === undefined || acct0 === undefined) {
    reject(-1);
    return false;
  }

  if (userAddr === undefined || userAddr === "") {
    userAddr = acct0;
    console.log("using default accounts[0]");
  }
  console.log("userAddr:", userAddr);
  let result;

  try {
    result = await instPricebetting.methods.getAccountIndexes(userAddr).call();
  } catch (err) {
    console.error("getAccountIndexes() failed.", err);
    reject(-1);
    return false;
  }
  console.log("idxU:", result[0],", idxC:", result[1]);
  resolve([instPricebetting, userAddr, result[0], result[1]]);
});

//----------------------==
/**
idxPage   indexRange
	1		1 ~ 20 ... 
	2		21 ~ 40 ... 1 + (idxPage-1)*outLength ~  
  3		41 ~ 1800 ... 

GetActiveTrade and GetHistoricalTrade
NextPage and PrevPage
call both 1800 and 900 period, sort: lastest 20 first
*/
export const NextPage = async (compo, userAddr, option, idxPageCurrent) =>
new Promise(async (resolve, reject) => {
  console.log("---------== NextPage()");
  if(isNaN(idxPageCurrent)){
    console.log("idxPageCurrent invalid", idxPageCurrent);
    reject(-1); return false;
  }
  // if(idxPageCurrent > 1){
  //   console.log("no previousPage");
  //   resolve({bets: [], recordOption: option, idxPage: idxPageCurrent});
  //   return true;
  // }

  const idxPage = idxPageCurrent + 1;
  console.log("newIdxPage:", idxPage);

  const outLength = config.recordsPerPage;
  const result = await GetTrade(compo, userAddr,  idxPage, outLength, option).catch((err)=>{
    reject(-1); return false;
  });
  console.log("GetTrade:", result);

  if(result[0].length === 0) {
    console.log("output is empty: no nextPage");
    resolve({bets: result[0], recordOption: option, idxPage: idxPageCurrent});
    return true;
  }
  resolve({bets: result[0], recordOption: option, idxPage: idxPage});
});

export const PreviousPage = async (compo, userAddr, option, idxPageCurrent) =>
new Promise(async (resolve, reject) => {
  console.log("---------== PreviousPage()");
  if(isNaN(idxPageCurrent)){
    console.log("idxPageCurrent invalid");
    reject(-1);
    return false;
  }
  if(idxPageCurrent <= 1){
    console.log("no previousPage");
    resolve({bets: [], recordOption: option, idxPage: idxPageCurrent});
    return true;
  }

  const idxPage = idxPageCurrent - 1;
  if(idxPage <= 0) {
    console.warn("no previous page");
    reject(-1);
    return false;
  }
  const outLength = config.recordsPerPage;
  const result = await GetTrade(compo, userAddr,  idxPage, outLength, option).catch((err)=>{
    reject(-1); return false;
  });
  console.log("GetTrade:", result);
  if(result[0].length === 0) {
    console.log("output is empty");
  }
  resolve({bets: result[0], recordOption: option, idxPage: idxPage});
});

//-------------==
export const compareLastestFirst = ( a, b ) => {
  const a1 = Number(a.betAt);
  const b1 = Number(b.betAt);
  if ( a1 < b1 ){
    return 1;
  }
  if ( a1 > b1 ){
    return -1;
  }
  return 0;
}//objs.sort( compareLastestFirst );
/**
-------------== Historical Trades
compo array from init() function
target address,  or empty string for selected address from MetaMask
idxPage = 
outLength = how many bet records to show

-------------== ActoveTrade
compo array from init() function
target address, or empty string for selected address from MetaMask
idxPage = 
outLength = how many bet records to show
 */

//------------------== V3
export const ReadBet = async (compo, userAddr, assetPair, index) =>
new Promise(async (resolve, reject) => {
  console.log("---------== ReadBet()");
  const [instPricebetting, acct0] = extractCompo(compo, "pricebetting",  0);
  if (instPricebetting === undefined || acct0 === undefined) {
    resolve([-1]); return false;
  }
  if (userAddr === undefined || userAddr === "") {
    userAddr = acct0;
    console.log("using default accounts[0]");
  }
  log1(userAddr, assetPair, index)
  try {
    let data = await instPricebetting.methods.readBet(userAddr, assetPair, index).call();
    // data.forEach((item,idx) => {
    //   console.log(`out idx = ${idx}, item = ${item}`);
    // });
    resolve(data);
  } catch (err) {
    console.error("ReadBet() failed.", err);
    reject(-1);
  }
});


export const GetBets = async (compo,  assetPair) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetBets()");
  const [instPricebetting, acct0] = extractCompo(compo, "pricebetting",  0);
  if (instPricebetting === undefined || acct0 === undefined) {
    resolve([-1]); return false;
  }
  log1(assetPair)
  try {
    let data = await instPricebetting.methods.getBets(assetPair).call();
    // data.forEach((item,idx) => {
    //   console.log(`out idx = ${idx}, item = ${item}`);
    // });
    resolve(data);
  } catch (err) {
    console.error("GetBets() failed.", err);
    reject(-1);
  }
});

export const GetLatestBetIndex = async (compo,  assetPair) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetLatestBetIndex()");
  const [instPricebetting, acct0] = extractCompo(compo, "pricebetting",  0);
  if (instPricebetting === undefined || acct0 === undefined) {
    resolve([-1]); return false;
  }
  log1(assetPair)
  try {
    let data = await instPricebetting.methods.getLatestBetIndex(assetPair).call();
    // data.forEach((item,idx) => {
    //   console.log(`out idx = ${idx}, item = ${item}`);
    // });
    resolve(data);
  } catch (err) {
    console.error("GetLatestBetIndex() failed.", err);
    reject(-1);
  }
});



//------------------== V2
export const GetTrade = async (compo, userAddr, idxPage, outLength, option) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetTrade()");
  const [instPricebetting, acct0] = extractCompo(compo, "pricebetting",  0);
  if (instPricebetting === undefined || acct0 === undefined) {
    resolve([-1]); return false;
  }
  if (userAddr === undefined || userAddr === "") {
    userAddr = acct0;
    console.log("using default accounts[0]");
  }
  const assetPair = 1;// 0: bitcoin, 1: ethereum
  log1(userAddr, assetPair, idxPage, outLength, option);
  try {
    let data = await instPricebetting.methods.getBetterBets(userAddr, assetPair, idxPage, outLength, option).call();
    // data.forEach((item,idx) => {
    //   console.log(`out idx = ${idx}, item = ${item}`);
    // });
    resolve(data);
  } catch (err) {
    console.error("GetTrade() failed.", err);
    reject(-1);
  }
});

export const GetHistoricalTrade = async (compo, userAddr, assetName) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetHistoricalTrade()");
  const option = 0;
  const idxPage = 1; 
  const outLength = config.recordsPerPage;
  log1(idxPage, outLength, option)
  const result = await GetTrade(compo, userAddr,  idxPage, outLength, option).catch((err)=>{
    reject(-1); return false;
  });
  console.log("GetTrade:", result);
  if(Array.isArray(result[0])){
    if(result[0].length === 0) {
      console.log("Historical record is empty");
      resolve({bets: [], recordOption: option, idxPage: idxPage});
      return true;
    }
    const assetId = getAssetId(assetName);
    const betsArray3 = result[0].filter((item) => {
      return item.assetPair === assetId;
    });
    resolve({bets: betsArray3, recordOption: option, idxPage: idxPage});

  } else {
    console.warn("result[0] invalid array:", result[0]);
    resolve({bets: [], recordOption: option, idxPage: idxPage});
  }
});

export const GetActiveTrade = async (compo, userAddr, assetName) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetActiveTrade()");
  const option = 1;
  const idxPage = 1;
  const outLength = config.recordsPerPage;
  const result = await GetTrade(compo, userAddr,  idxPage, outLength, option).catch((err)=>{
    reject(-1); return false;
  });
  console.log("GetTrade:", result);
  if(Array.isArray(result[0])){
    if(result[0].length === 0) {
      console.log("Active record is empty");
      resolve({bets: [], recordOption: option, idxPage: idxPage});
      return true;
    }
    const assetId = getAssetId(assetName);
    const betsArray3 = result[0].filter((item) => {
      return item.assetPair === assetId;
    });
    resolve({bets: betsArray3, recordOption: option, idxPage: idxPage});

  } else {
    console.warn("result[0] invalid array:", result[0]);
    resolve({bets: [], recordOption: option, idxPage: idxPage});
  }
});

export const GetLatestActiveTrade = async (compo, userAddr) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetLatestActiveTrade()");
  const option = 1;
  const idxPage = 0;
  const outLength = 1;
  const result = await GetTrade(compo, userAddr,  idxPage, outLength, option).catch((err) => {
    console.error("GetTrade() failed.", err);
    reject(-1); return false;
    });
  console.log("GetTrade:", result);
  const betsArray = result[0];
  if(Array.isArray(betsArray)){
    if(betsArray.length === 0) {
      console.log("LatestActiveTrade is empty");
      resolve([]); return true;
    }
    log1("bet:", betsArray);
    log1("betAt:", betsArray[0][1]);

    resolve(betsArray[0]);
  } else {
    console.warn("result invalid array:", result);
    resolve(result);
  }
});

export const GetTradeCheck = async (compo, userAddr, period, idxPage, outLength, option) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetTradeCheck()");
  const [instPricebetting, acct0] = extractCompo(compo, "pricebetting",  0);
  if (instPricebetting === undefined || acct0 === undefined) {
    resolve([-1]);
    return false;
  }
  if (userAddr === undefined || userAddr === "") {
    userAddr = acct0;
    console.log("using default account[0]");
  }

  let data;
  try {
    data = await instPricebetting.methods.addrPriceBetting().call();
    console.log("addrPriceBetting:", data);

    data = await instPricebetting.methods.getAccountIndexes(userAddr).call();
    console.log("getAccountIndexes:", data);

    console.log(userAddr, period, idxPage, outLength, option);
    data = await instPricebetting.methods.getPageIndexes(userAddr, idxPage, outLength, option).call();

    // data = await instPricebetting.methods.getBetIndexes(userAddr, period, idxPage, outLength, option).call();
    // console.log("getBetIndexes:", data);

    resolve(data);
  } catch (err) {
    console.error("GetTradeCheck() failed.", err);
    reject(-1);
  }
});


//--------------------------== Feb2
      // const err1 = checkDropdown(network1, rewardsCtrtIndex);
      // if (err1) {
      //   reject(err1);
      // }
      //const weiAmount = toWei(amount);
export const GetBettingStatus = async (compo) =>
new Promise(async (resolve, reject) => {
  console.log("---------== GetBettingStatus()");
  const [instPriceBetting] = extractCompo(compo, "pricebetting");
  if (instPriceBetting === undefined) {
    reject(-1);
    return false;
  }

  try {
    const data = await instPriceBetting.methods.bettingStatus().call();
      resolve(data);
  } catch (err) {
    console.error("readFunc call failed.", err);
    reject(-1);
  }
});
  
      
export const StopBettingOps = async (compo, gasPrice, gasLimit, isActive) => new Promise(async (resolve, reject) => {
      console.log("---------== StopBettingOps()");
      const [instPriceBetting, acct0] = extractCompo(compo, "pricebetting",  0);

      option = 102; bool1 = isActive;
      console.log("acct0:", acct0, option, bool1, uintNum);
      try {
        if (instPriceBetting !== undefined && acct0 !== "") {
          await instPriceBetting.methods
            .setSettings(option, acct0, bool1, uintNum)
            .send({
              from: acct0,
              gasPrice: await getGasPriceBSC(),
              // gasPrice: gasPrice * GWEI,
              // gas: gasLimit,
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

  
export const BetterWithdraw = async (compo, gasPrice, gasLimit, amount) => new Promise(async (resolve, reject) => {
  console.log("---------== BetterWithdraw()");
  const [instPriceBetting, acct0] = extractCompo(compo, "pricebetting",  0);

  let amountWei  = toWei(amount);
  console.log("acct0:", acct0, amount, amountWei.toString());
  try {
    if (instPriceBetting !== undefined && acct0 !== "") {
      await instPriceBetting.methods
        .withdraw(amountWei)
        .send({
          from: acct0,
          gasPrice: await getGasPriceBSC(),
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
  
export const PoolerStake = async (compo, gasPrice, gasLimit, amount) => new Promise(async (resolve, reject) => {
  console.log("---------== PoolerStake()");
  const [instPriceBetting, acct0] = extractCompo(compo, "pricebetting",  0);

  const result = await Allowance(compo, amount).catch((err) => {
    console.error("Allowance failed:", err);
    reject(err);
    return false;
  });
  if(result[0]){
    console.log("the user has enough allowance");
  } else {
    await Approve(compo, gasPrice, gasLimit, '100000').catch((err) => {
      console.error("Approve failed");
      reject(err);
      return false;
    });
  }

  const amountWei = result[2];
  console.log("acct0:", acct0, amount, amountWei.toString());
  try {
    if (instPriceBetting !== undefined && acct0 !== "") {
      await instPriceBetting.methods
        .stake(amountWei)
        .send({
          from: acct0,
          gasPrice: await getGasPriceBSC(),
        })
        .on("receipt", (receipt) => {
          console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
          resolve(receipt.transactionHash);
        })
        .on("error", async(err, receipt) => {
          console.error("txn failed:", err);

          const data1 = await getERC20Balance(compo, acct0).catch((err) => {
            console.error("getERC20Balance failed:", err);
            reject(err);
            return false;
          });
          console.log("getERC20Balance:", data1);
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

export const PoolerUnstake = async (compo, gasPrice, gasLimit, amount) => new Promise(async (resolve, reject) => {
  console.log("---------== PoolerUnstake()");
  const [instPriceBetting, acct0] = extractCompo(compo, "pricebetting",  0);

  let amountWei  = toWei(amount);
  console.log("acct0:", acct0, amount, amountWei.toString());
  try {
    if (instPriceBetting !== undefined && acct0 !== "") {
      await instPriceBetting.methods
        .unstake(amountWei)
        .send({
          from: acct0,
          gasPrice: await getGasPriceBSC(),
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

export const ClearBets = async (compo, gasPrice, gasLimit, userAddr, assetName) => new Promise(async (resolve, reject) => {
  console.log("---------== ClearBets()");
  const [instPriceBetting, acct0] = extractCompo(compo, "pricebetting",  0);
  if (userAddr === undefined || userAddr === "") {
    userAddr = acct0;
    console.log("using default accounts[0]");
  }
  console.log("userAddr:", userAddr);
  try {
    if (instPriceBetting !== undefined && acct0 !== "") {
      await instPriceBetting.methods
        .clearBets(userAddr, getAssetId(assetName))
        .send({
          from: acct0,
          gasPrice: await getGasPriceBSC(),
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

export const EnterBet = async (compo, gasPrice, gasLimit, amount, period, assetName, bettingOutcome, fundingSource) => new Promise(async (resolve, reject) => {
  console.log("---------== EnterBet()");
  const [instPriceBetting, acct0] = extractCompo(compo, "pricebetting",  0);

  const result = await Allowance(compo, amount).catch((err) => {
    console.error("Allowance failed:", err);
    reject(err);
    return false;
  });
  log1("Allowance result:", result);
  if(result[0]){
    console.log("the user has enough allowance");
  } else {

    await Approve(compo, gasPrice, gasLimit, '100000').catch((err) => {
      console.error("Approve failed, err:", err);
      reject(err);
      return false;
    });
  }
  const assetPair = getAssetId(assetName);
  if (assetPair === -1) {
    reject(-1);
    return false;
  }
  const amountWei = result[2];//toWei(amount);
  console.log("acct0:", acct0, amount, amountWei.toString());
  try {
    if (instPriceBetting !== undefined && acct0 !== "") {
      await instPriceBetting.methods
        .enterBet(amountWei, period, assetPair, bettingOutcome, fundingSource)
        .send({
          from: acct0,
          gasPrice: await getGasPriceBSC(),
        })
        .on("receipt", async(receipt) => {
          console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);

          // let data1 = await GetLatestActiveTrade(compo, "", period).catch((err) => {
          //   console.error(err);
          //   reject("err@GetLatestActiveTrade. txnHash: "+receipt.transactionHash);
          //   return false;
          // });
          // log1("betAt:", data1[1]);
          resolve(receipt.transactionHash);
        })
        .on("error", async(err, receipt) => {
          console.error("txn failed:", err);
          
          const data = await EnterBetCheck(compo, gasPrice, gasLimit, amount, period, assetName, bettingOutcome, fundingSource).catch((err) => {
              console.error("enterBetCheck failed:",err);
              reject(err);
              return false;
            });

          console.log("enterBetCheck:",data);
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

export const EnterBetCheck = async (compo, gasPrice, gasLimit, amount, period, assetName, bettingOutcome, fundingSource) => new Promise(async (resolve, reject) => {
  console.log("---------== EnterBetCheck()");
  const [instPriceBetting, acct0] = extractCompo(compo, "pricebetting",  0);
  if(isNaN(gasPrice) || parseInt(gasPrice) < 1){
    console.warn("gasPrice invalid:", gasPrice);
    resolve(0); return false;
  }
  if(isNaN(gasLimit) || parseInt(gasLimit) < 400000){
    console.warn("gasLimit invalid:", gasLimit);
    resolve(0); return false;
  }
  if(amount === "" || isNaN(amount) || parseFloat(amount) <= 0){
    console.warn("amount invalid:", amount);
    resolve(0); return false;
  }
  if(period !== config.period1 && period !== config.period2){
    console.warn("period invalid:", period);
    resolve(0); return false;
  }
  if(assetName !== "bitcoin" && assetName !== "ethereum"){
    console.warn("assetName invalid:", assetName);
    resolve(0); return false;
  }
  if(isNaN(bettingOutcome) || parseInt(bettingOutcome) > 1 || parseInt(bettingOutcome) < 0){
    console.warn("bettingOutcome invalid:", bettingOutcome);
    resolve(0); return false;
  }
  if(isNaN(fundingSource) || parseInt(fundingSource) > 1 || parseInt(fundingSource) < 0){
    console.warn("fundingSource invalid:", fundingSource);
    resolve(0); return false;
  }

  let amountWei  = toWei(amount);
  console.log("acct0:", acct0, amount, amountWei.toString());

  const assetPair = getAssetId(assetName);
  if (assetPair === -1) {
    reject(-1); return false;
  }
  try {
    if (instPriceBetting !== undefined && acct0 !== "") {
      const data = await instPriceBetting.methods.enterBetCheck(amountWei, period, assetPair, bettingOutcome, fundingSource)
      .call({from: acct0}).catch((err) => {
        console.error("enterBetCheck failed:",err);
        reject(err);
        return false;
      });
      //const bools = data[0]
      // const uints = data[1]
      // const uintInputs = data[2]
      //const boolOut = data[3];
      console.log(data);
      resolve(data);
    }
    resolve("contract instance not existing");
  } catch (err) {
    console.error(err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});

export const CheckStatus1 = async (compo, gasPrice, gasLimit) =>
new Promise(async (resolve, reject) => {
  console.log("---------== CheckStatus1()");
  const amount = bigNum(1);
  const period = config.period1;
  const assetName = assetNames[0].value;
  const bettingOutcome = 1;
  const fundingSource = 1;
  const data = await EnterBetCheck(compo, gasPrice, gasLimit, amount, period, assetName, bettingOutcome, fundingSource).catch((err) => {
    console.error("enterBetCheck failed:", err);
    reject(err);
    return false;
  });
  console.log("enterBetCheck:", data);
  const totalUnclaimed1 = data[0][4];
  //const bettingStatus = data[0][8]; && bettingStatus
  const poolBalance1 = data[0][10];
  const status1 = totalUnclaimed1 && poolBalance1;
  console.log("status1:", status1);
  resolve(status1);
});

//-----------------------== ERC20 Token Contract Functions
export const Approve = async (compo, gasPrice, gasLimit, amount = '100000') => new Promise(async (resolve, reject) => {
  console.log("---------== Approve()");
  const [instERC20, acct0] = extractCompo(compo, "token",  0);

  let amountWei  = new Decimal((999999999*10**18)).toFixed();
  const addrsCtrt = await getCtrtAddresses();
  console.log("acct0:", acct0,  ", amount:", amount, amountWei.toString());
  try {
    if (instERC20 !== undefined && acct0 !== "") {
      await instERC20.methods
        .approve(addrsCtrt[1], amountWei)
        .send({
          from: acct0,
          gasPrice: await getGasPriceBSC() * 2,
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

/**
 * @param {*} compo 
 * @param {*} amount 
 */
export const Allowance = async (compo, amount = "0") => new Promise(async (resolve, reject) => {
  console.log("---------== Allowance()");
  const [instERC20, acct0] = extractCompo(compo, "token",  0);
  if (amount === "") amount = "0";
  let amountWei  = toWei(amount);
  const addrsCtrt = await getCtrtAddresses();
  console.log("acct0:", acct0, ", amount:", amount, amountWei.toString());
  try {
    if (instERC20 !== undefined && acct0 !== "") {
      const result = await instERC20.methods
        .allowance(acct0, addrsCtrt[1]).call();
      const isAllowed = parseInt(result) !== 0 && parseInt(result) >= parseInt(amountWei);
        resolve([isAllowed, fromWei(result), amountWei]);
    }
    resolve("contract instance not existing");
  } catch (err) {
    console.error(err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});


