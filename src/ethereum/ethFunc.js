import detectEthereumProvider from '@metamask/detect-provider'
import { ethers, BigNumber} from "ethers"; //BigNumber
import Web3 from "web3";
import { config } from "../ethereum/config";
//import ERC20Token from "./ERC20Token.json";
import NFT721Creature from "./NFT721Creature.json";
import NFT721Sales from "./NFT721Sales.json";
//import ERC20TokenFR from "./ERC20TokenFR.json";

//import { rewardsCtrtIdxes, dbSelections } from "./config";
// const instance = new web3.eth.Contract(
//     JSON.parse(NFTokenMetadataEnumerable.interface),
//     '0xe6Da20c6F3ba3ac86C7FA3da155E5847F3cDE7e6'
// );
// export default instance;
//--------------------------== utils
export const log1 = console.log;
//const bigNum = (item) => BigNumber.from(item);

//const dp = 18;
//const base = bigNum(10).pow(dp);
//const SECONDS_IN_A_DAY = 86400;
//const one1 = constants.One;
//const bnOne = bigNum(one1);
//const MAX_INTEGER = new bigNum(2).pow(new bigNum(256)).sub(new bigNum(1));
//const OptionType = { Put: 1, Call: 2 };
export const addr0 = "0x0000000000000000000000000000000000000000";

//const amp = 1000000;
export const GWEI = 1000000000;

export const fromWeiE = (weiAmount, dp = 18) => {
  try {
    return ethers.utils.formatUnits(weiAmount, parseInt(dp));
  } catch (err) {
    console.error("fromWeiE() failed:", err);
    return -1;
  }
}//input: BN or string, dp = 6 or 18 number, output: string

export const toWeiE = (amount, dp = 18) => {
  try {
    return ethers.utils.parseUnits(amount, parseInt(dp));
  } catch (err) {
    console.error("toWeiE() failed:", err);
    return -1;
  }
}//input: string, output: Bn

export const fromWei = (weiAmount) => fromWeiE(weiAmount);
//web3.utils.fromWei(weiAmount.toString(), "ether");

export const toWei = (amount) => toWeiE(amount);
//web3.utils.toWei(amount.toString(), "ether");

//--------------------------== 
export const getTokenBalance = async (compo, userAddr) =>
new Promise(async (resolve, reject) => {
  console.log("---------== getTokenBalance()");
  const [instERC20TokenFR, acct0] = await extractCompo(compo, 2, 0);

  if (instERC20TokenFR === undefined || acct0 === undefined) {
    resolve(-1);
    return false;
  }

  if (userAddr === undefined || userAddr === "") {
    userAddr = acct0;
    console.log("using default accounts[0]");
  }
  console.log("userAddr:", userAddr);
  try {
    const data = await instERC20TokenFR.methods.balanceOf(userAddr).call();
    console.log("data:", data);
      resolve(data);
  } catch (err) {
    console.error("getTokenBalance() failed.", err);
    reject(-1);
  }
});
//--------------------------==
export const extractCompo = async(compo, ctrtNum, acctIdx) => {
  //log1("compo:", compo);
  if (compo === undefined) {
    console.error("compo is undefined");
    return [-1];
  }
  if (ctrtNum === undefined) {
    console.error("ctrtNum is undefined");
    return [-1];
  }
  if(compo.length < 2){
    console.error("compo is not complete");
    return [-1];
  }
  const instContracts = compo[3];
  if(instContracts === undefined){
    console.error("instContracts undefined")
  } else if(instContracts.length < 2){
    console.error("instContracts length is less than 3")
  }
  const instNFT721Creature = instContracts[0];
  const instNFT721Sales = instContracts[1];
  const instTokenFR = "";//instContracts[2];
  if(Number.isInteger(acctIdx) && parseInt(Number(acctIdx)) >= 0) {
    //const addr1 = await getAccounts(compo[0]);
    const acct0 = compo[1][acctIdx];
    //console.log("acct0:", acct0);

    if(ctrtNum === 2) {
      return [instTokenFR, acct0];
    } else if(ctrtNum === 1) {
      return [instNFT721Sales, acct0];
    } else {
      return [instNFT721Creature, acct0];
    }
  } else {
    if(ctrtNum === 2) {
      return [instTokenFR];
    } else if(ctrtNum === 1) {
      return [instNFT721Sales];
    } else {
      return [instNFT721Creature];
    }
  }
}

export const func = async (compo) =>
new Promise(async (resolve, reject) => {
resolve(-1);
});

//let stakedAmount  = fromWeiE(weiAmount, dp);

// const err1 = checkDropdown(network1, rewardsCtrtIndex);
  // if (err1) {
  //   reject(err1);
  // }

//---------------------== utility function
const getEthNodeURL = async () =>
  new Promise(async (resolve, reject) => {
    const ctrtNum = config.contractPair;
    if (ctrtNum === 1) {
      resolve(config.ethNodeURL1);
    } else if (ctrtNum === 4) {
      resolve(config.ethNodeURL4);
    } else if (ctrtNum === 42) {
      resolve(config.ethNodeURL42);
    } else {
      console.error("ethNodeNumber is invalid");
      reject("ethNodeNumber is invalid");
    }
  });

export const getGasData = async () =>
  new Promise(async (resolve, reject) => {
    log1("---------== getGasData()");
    const url = config.gasDataSource;
    const isToAcceptOpaqueRes = false;
    const response = await fetch(url).catch((err) => {
      log1("err@ fetch:", err);
      reject(false);
    });
    log1("response:", response);
    if (response && response.ok) {
      let resObj = await response.json();
      log1("resObj:", resObj);
      const gasPriceNew = resObj.result.ProposeGasPrice;
      log1("ProposeGasPrice:", gasPriceNew);
      resolve(gasPriceNew);
    } else if (isToAcceptOpaqueRes) {
      let data = await response.text();
      log1("ProposeGasPrice:", data);
      resolve(data ? JSON.parse(data) : {});
    } else {
      reject(false);
    }
  });


  //--------------------------==
export const getProviderSigner = async () => 
new Promise((resolve, reject) => {
  window.addEventListener("load", async () => {
    // wait for loading completion to avoid race condition with web3 injecting timing
    if (window.ethereum) {
      //new version of MetaMask exists
      log1("newer ehereum detected");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      resolve(provider, signer);
    } else {
      const ethNodeURL = await getEthNodeURL().catch((err) => {
        reject(err);
      });
      log1("using ethNodeURL:", ethNodeURL);
      const provider = new ethers.providers.JsonRpcProvider(ethNodeURL);
      log1("no ethereum injected. Use infura endpoint");
      const signer = provider.getSigner();
      resolve(provider, signer);
    }
  });
});

export const getCtrtAddresses = async () =>
new Promise(async (resolve, reject) => {
  const ctrtNum = config.contractPair;
  let ctrtAddrs;
  if (ctrtNum === 77) {
    ctrtAddrs = [config.NFT721Creature_xDAI_0, config.NFT721Sales_xDAI_0];
    resolve(ctrtAddrs);
  } else if (ctrtNum === 100) {
    ctrtAddrs = [config.NFT721Creature_xDAI_1, config.NFT721Sales_xDAI_1];
    resolve(ctrtAddrs);
  } else if (ctrtNum === 4) {
    ctrtAddrs = [config.NFT721Creature_rinkeby, config.NFT721Sales_rinkeby];
    resolve(ctrtAddrs);
  } else if (ctrtNum === 1) {
    ctrtAddrs = [config.NFT721Creature_ethMainnet, config.NFT721Sales_ethMainnet];
    resolve(ctrtAddrs);
  } else {
    console.error("contractPair is invalid");
    reject("contractPair is invalid");
  }
});

export const getInitWeb3 = async () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      // this addEventListener is only needed if you run this getInitWeb3 when the website loads up... wait for loading completion to avoid race condition with web3 injecting timing

      const provider = await detectEthereumProvider()
      if (provider) {
        //new version of MetaMask exists
        log1("newer ehereum detected");
        // From now on, this should always be true:
        // provider === window.ethereum
        // Access the decentralized web!
        // Legacy providers may only have ethereum.sendAsync

        const web3 = new Web3(provider);
        //has provider inside
        await provider.request({
          method: 'eth_requestAccounts',
        }).catch((err)=> {
          console.warn("User denied account access or error occurred @ provider.request:", err);
          reject(err);
        });
        log1("Acccounts now exposed", "ethereum.selectedAddress", provider.selectedAddress);
        resolve(web3);

      } else if (window.web3) {
        //other wallet or older web3
        const web3 = window.web3;
        //const web3 = new Web3(window.web3.currentProvider);
        log1("older web3 detected");
        resolve(web3);
      } else {
        // if the provider is not detected, detectEthereumProvider resolves to null
        console.error('Please install MetaMask!');

        const ethNodeURL = await getEthNodeURL().catch((err) => {
          reject(err);
        });
        log1("using ethNodeURL:", ethNodeURL);
        const provider = new Web3.providers.HttpProvider(ethNodeURL);
        const web3 = new Web3(provider);
        log1("no web3 injected. Use infura endpoint");
        resolve(web3);
      }
    });
  });
  
export const getWeb3 = async () =>
  new Promise(async(resolve, reject) => {
    //window.addEventListener("load", async () => {
      // wait for loading completion to avoid race condition with web3 injecting timing

      const provider = await detectEthereumProvider()
      if (provider) {
        //new version of MetaMask exists
        log1("newer ehereum detected");
        // From now on, this should always be true:
        // provider === window.ethereum
        // Access the decentralized web!
        // Legacy providers may only have ethereum.sendAsync

        const web3 = new Web3(provider);
        //has provider inside
        await provider.request({
          method: 'eth_requestAccounts',
        }).catch((err)=> {
          console.warn("User denied account access or error occurred @ provider.request:", err);
          reject(err);
        });
        log1("Acccounts now exposed", "ethereum.selectedAddress", provider.selectedAddress);
        resolve(web3);

      } else if (window.web3) {
        //other wallet or older web3
        const web3 = window.web3;
        //const web3 = new Web3(window.web3.currentProvider);
        log1("older web3 detected");
        resolve(web3);
      } else {
        // if the provider is not detected, detectEthereumProvider resolves to null
        console.error('Please install MetaMask!');

        const ethNodeURL = await getEthNodeURL().catch((err) => {
          reject(err);
        });
        log1("using ethNodeURL:", ethNodeURL);
        const provider = new Web3.providers.HttpProvider(ethNodeURL);
        const web3 = new Web3(provider);
        log1("no web3 injected. Use infura endpoint");
        resolve(web3);
      }
    //});
  });

export const init = async () =>
  new Promise(async (resolve, reject) => {
    let mesg;
    console.log("init()");
    try {
      //const web3 = await getInitWeb3().
      const web3 = await getInitWeb3().catch((err) => {
        reject(err);
        return false;
      });
      if (typeof web3 === "undefined") {
        log1("missing web3:", web3, typeof web3);
        reject("missing web3");
        return false;
      }
      log1("web3 version:", web3.version);

      const isMetaMask = await web3.currentProvider.isMetaMask;
      log1("isMetaMask", isMetaMask);
      if (!isMetaMask) {
        mesg = "Please install MetaMask browser extension";
        log1(mesg);
        reject(mesg);
        return false;
      }

      const accounts = await web3.eth.getAccounts();
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = ctrtX.networks[networkId];
      if (!Array.isArray(accounts) || accounts.length === 0) {
        mesg = "missing accounts";
        log1(
          "missing accounts:",
          accounts,
          Array.isArray(accounts),
          accounts.length
        );
        reject(mesg);
        return false;
      }
      if (accounts[0] === undefined) {
        mesg = "Please login to MetaMask(ETH wallet)";
        log1(mesg);
        reject(mesg);
        return false;
      }
      console.log("accounts:", accounts);

      const chainId = parseInt(window.ethereum.chainId, 16);
      console.log("chainId:", chainId);
      if(chainId === 77){
        log1("chainId 77 for xDai Testnet detected");
      } else if(chainId === 1){
        log1("chainId 1 for Ethereum Mainnet detected");
      } else if(chainId === 4){
        log1("chainId 4 for Ethereum Rinkeby detected");
      } else {
        mesg = "chainId invalid";
        reject(mesg);
        return false;
      }

      const [addrNFT721Creature, addrNFT721Sales]= await getCtrtAddresses();
      console.log("addrNFT721Creature:", addrNFT721Creature, "\naddrNFT721Sales:", addrNFT721Sales);

      const instNFT721Creature = new web3.eth.Contract(
        NFT721Creature.abi,
        addrNFT721Creature
      );
      if (typeof instNFT721Creature === "undefined") {
        log1("missing instNFT721Creature:", instNFT721Creature);
        reject("missing instNFT721Creature");
        return false;
      }

      const instNFT721Sales = new web3.eth.Contract(
        NFT721Sales.abi,
        addrNFT721Sales
      );
      if (typeof instNFT721Sales === "undefined") {
        log1("missing instNFT721Sales:", instNFT721Sales);
        reject("missing instNFT721Sales");
        return false;
      }

      const instContracts = [
        instNFT721Creature, instNFT721Sales
      ];

      log1("init is successful");
      resolve([web3, accounts, chainId, instContracts]);
    } catch (error) {
      log1(error);
      reject("init failed");
    }
  });


/**
      const instERC20 = new web3.eth.Contract(
        ERC20Token.abi,
        config.erc20TokenAddress
      ); //deployedNetwork && deployedNetwork.address,
      if (typeof instERC20 === "undefined") {
        log1("missing instERC20:", instERC20);
        reject("missing instERC20");
      }

const getERC20CtrtStates = async (web3, addr, instERC20) =>
  new Promise(async (resolve, reject) => {
    try {
      log1("instERC20:", instERC20);
      const name = ""; //await instERC20.methods.name().call();
      const symbol = ""; //await instERC20.methods.symbol().call();
      const decimals = ""; //await instERC20.methods.decimals().call();
      const version = ""; //await instERC20.methods.version().call();
      const totalSupply = ""; //await instERC20.methods.totalSupply().call();

      const weiAmount = await instERC20.methods.balanceOf(addr).call();
      const usrAmount = web3.utils.fromWei(weiAmount, "ether");
      log1("addr balance:", usrAmount);
      resolve([usrAmount, name, symbol, decimals, version, totalSupply]);
    } catch (error) {
      log1(error);
      reject("getERC20CtrtStates failed");
    }
  });

  */
