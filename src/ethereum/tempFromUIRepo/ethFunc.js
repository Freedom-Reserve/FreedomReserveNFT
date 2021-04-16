import detectEthereumProvider from "@metamask/detect-provider";
import { ethers, BigNumber, Contract } from "ethers"; //BigNumber
import Web3 from "web3";
import { config } from "../ethereum/config";
//import ERC20Token from "./ERC20Token.json";
//-----------------------==
import PriceBettingT1S2 from "./priceBettingT1S2_BSC.json";
import RoundIdCtrt from "./RoundIdCtrt_BSC.json";
import ERC20Token from "./ERC20_BSC.json";
import ChainlinkPF_BTCUSD_BSC from "./ChainlinkPF_BTCUSD_BSC.json";
import ChainlinkPF_ETHUSD_BSC from "./ChainlinkPF_ETHUSD_BSC.json";

//import { rewardsCtrtIdxes, dbSelections } from "./config";
// const instance = new web3.eth.Contract(
//     JSON.parse(NFTokenMetadataEnumerable.interface),
//     '0xe6Da20c6F3ba3ac86C7FA3da155E5847F3cDE7e6'
// );
// export default instance;
//--------------------------== utils
export const log1 = console.log;
export const bigNum = (item) => BigNumber.from(item);

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

//--------------------------== toWei & fromWei
export const fromWeiE = (weiAmount, dp = 18) => {
  try {
    return ethers.utils.formatUnits(weiAmount.toString(), parseInt(dp));
  } catch (err) {
    console.error("fromWeiE() failed:", err);
    return -1;
  }
}; //input: BN or string, dp = 6 or 18 number, output: string

export const toWeiE = (amount, dp = 18) => {
  try {
    return ethers.utils.parseUnits(amount.toString(), parseInt(dp));
  } catch (err) {
    console.error("toWeiE() failed:", err);
    return -1;
  }
}; //input: string, output: Bn

export const fromWei = (weiAmount) => fromWeiE(weiAmount);
//web3.utils.fromWei(weiAmount.toString(), "ether");

export const toWei = (amount) => toWeiE(amount);
//web3.utils.toWei(amount.toString(), "ether");

//--------------------------==
export const showLocalTime = (unixEpoch) => {
  const t1 = new Date(Number(unixEpoch) * 1000);
  const yyyymmdd = t1.toLocaleDateString('fr-CA');
  const hhmmss = t1.toLocaleTimeString('en-GB');
  return yyyymmdd + " "+ hhmmss;
  // const time = new Date(Number(data.settledAt) * 1000);
  // const fullYear = String(time.getFullYear()).padStart(4, '0');
  // const month = String(time.getMonth() + 1).padStart(2, '0');
  // const date = String(time.getDate()).padStart(2, '0');
  // const hours = String(time.getHours()).padStart(2, '0');
  // const minutes = String(time.getMinutes()).padStart(2, '0');
  // const seconds = String(time.getSeconds()).padStart(2, '0');
  // return `${fullYear}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}
//--------------------------==
export const getERC20Balance = async (compo, userAddr) =>
  new Promise(async (resolve, reject) => {
    log1("---------== getERC20Balance()");
    const [instERC20ERC20, acct0] = extractCompo(compo, "tokenERC20", 0);
    if (instERC20ERC20 === undefined || acct0 === undefined) {
      resolve(-1);
      return false;
    }

    if (userAddr === undefined || userAddr === "") {
      userAddr = acct0;
      log1("using default accounts[0]");
    }
    log1("userAddr:", userAddr);
    try {
      const data = await instERC20ERC20.methods.balanceOf(userAddr).call();
      log1("data:", data);
      resolve(data);
    } catch (err) {
      console.error("getERC20Balance() failed.", err);
      reject(-1);
    }
  });
//--------------------------==
// const [instPriceBetting, acct0] = extractCompo(compo, "pricebetting", 0);
export const extractCompo = (compo, ctrtName, acctIdx) => {
  //log1("compo:", compo);
  if (compo === undefined) {
    console.error("compo is undefined");
    return [-1];
  }
  if (ctrtName === undefined) {
    console.error("ctrtName is undefined");
    return [-1];
  }
  /**const instContracts = [
        0 instTokenERC20, 
        1 instPriceBetting, 
        2 instRoundIdCtrt, 
        3 instChainlinkPF_BTCUSD,
        4 instChainlinkPF_ETHUSD
       ] */
  const instContracts = compo[3];
  let instCtrt = -1;

  if (ctrtName === "tokenERC20") {
    instCtrt = instContracts[0];
  } else if (ctrtName === "pricebetting") {
      instCtrt = instContracts[1];
  } else if (ctrtName === "roundidctrt") {
      instCtrt = instContracts[2];
  } else if (ctrtName === "chainlinkPF_btcusd") {
      instCtrt = instContracts[3];
  } else if (ctrtName === "chainlinkPF_ethusd") {
      instCtrt = instContracts[4];
  } else {
    console.error("ctrtName invalid");
  }

  if (Number.isInteger(acctIdx) && parseInt(Number(acctIdx)) >= 0) {
    //const addr1 = await getAccounts(compo[0]);
    const addrUser = compo[1][acctIdx];
    //log1("addrUser:", addrUser);
    return [instCtrt, addrUser];
  } else {
    return [instCtrt];
  }
};

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
    if (config.ethNodeNumber === 0) {
      resolve(config.ethNodeURL0);
    } else if (config.ethNodeNumber === 1) {
      resolve(config.ethNodeURL1);
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
      return false;
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
      log1("data:", data);
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
        const signerAddr = await signer.getAddress();
        // import Token from '....';
        // const token = new Contract(Token.address, Token.abi, signer);
        resolve(provider, signerAddr);
      } else {
        const ethNodeURL = await getEthNodeURL().catch((err) => {
          reject(err);
          return false;
        });
        log1("using ethNodeURL:", ethNodeURL);
        const provider = new ethers.providers.JsonRpcProvider(ethNodeURL);
        log1("no ethereum injected. Use infura endpoint");
        const signer = provider.getSigner();
        const signerAddr = await signer.getAddress();
        resolve(provider, signerAddr);
      }
    });
  });

export const getCtrtAddresses = async () =>
  new Promise(async (resolve, reject) => {
    const num = config.contractPair;
    let ctrtAddrs;
    if (num === 0) {
      ctrtAddrs = [
        config.TokenERC20_xDAI_0,
        config.priceBettingT1S2_xDAI_0,
        config.RoundIdCtrt_xDAI_0,
      ];
      resolve(ctrtAddrs);
    } else if (num === 100) {
      //xDAI network
      ctrtAddrs = [
        config.TokenERC20_xDAI_1,
        config.priceBettingT1S2_xDAI_1,
        config.RoundIdCtrt_xDAI_1,
      ];
      resolve(ctrtAddrs);
    } else if (num === 56) {//BSC Mainnet
      ctrtAddrs = [
        config.TokenERC20_BSC_1,
        config.priceBetting_BSC_1,
        config.RoundIdCtrt_BSC_1,
        config.ChainlinkPF_BTCUSD_BSC_1,
        config.ChainlinkPF_ETHUSD_BSC_1
      ];
      resolve(ctrtAddrs);
    } else if (num === 97) {//BSC Testnet
      ctrtAddrs = [
        config.TokenERC20_BSC_0,
        config.priceBetting_BSC_0,
        config.RoundIdCtrt_BSC_0,
        config.ChainlinkPF_BTCUSD_BSC_0,
        config.ChainlinkPF_ETHUSD_BSC_0
      ];
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

      const provider = await detectEthereumProvider();
      if (provider) {
        //new version of MetaMask exists
        log1("newer ehereum detected");
        // From now on, this should always be true:
        // provider === window.ethereum
        // Access the decentralized web!
        // Legacy providers may only have ethereum.sendAsync

        const web3 = new Web3(provider);
        //has provider inside
        await provider
          .request({
            method: "eth_requestAccounts",
          })
          .catch((err) => {
            console.warn(
              "User denied account access or error occurred @ provider.request:",
              err
            );
            reject(err);
            return false;
          });
        log1(
          "Acccounts now exposed",
          "ethereum.selectedAddress",
          provider.selectedAddress
        );
        resolve(web3);
      } else if (window.web3) {
        //other wallet or older web3
        const web3 = window.web3;
        //const web3 = new Web3(window.web3.currentProvider);
        log1("older web3 detected");
        resolve(web3);
      } else {
        // if the provider is not detected, detectEthereumProvider resolves to null
        console.error("Please install MetaMask!");

        const ethNodeURL = await getEthNodeURL().catch((err) => {
          reject(err);
          return false;
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
  new Promise(async (resolve, reject) => {
    //window.addEventListener("load", async () => {
    // wait for loading completion to avoid race condition with web3 injecting timing

    const provider = await detectEthereumProvider();
    if (provider) {
      //new version of MetaMask exists
      log1("newer ehereum detected");
      // From now on, this should always be true:
      // provider === window.ethereum
      // Access the decentralized web!
      // Legacy providers may only have ethereum.sendAsync

      const web3 = new Web3(provider);
      await provider
        .request({
          method: "eth_requestAccounts",
        })
        .catch((err) => {
          console.warn(
            "User denied account access or error occurred @ provider.request:",
            err
          );
          reject(err);
          return false;
        });
      log1(
        "Acccounts now exposed",
        "ethereum.selectedAddress",
        provider.selectedAddress
      );
      resolve(web3);
    } else if (window.web3) {
      //other wallet or older web3
      const web3 = window.web3;
      //const web3 = new Web3(window.web3.currentProvider);
      log1("older web3 detected");
      resolve(web3);
    } else {
      // if the provider is not detected, detectEthereumProvider resolves to null
      console.error("Please install MetaMask!");

      const ethNodeURL = await getEthNodeURL().catch((err) => {
        reject(err);
        return false;
      });
      log1("using ethNodeURL:", ethNodeURL);
      const provider = new Web3.providers.HttpProvider(ethNodeURL);
      const web3 = new Web3(provider);
      log1("no web3 injected. Use infura endpoint");
      resolve(web3);
    }
    //});
  });

export const checkNetwork = () => {
    const chainIdHex = window.ethereum.chainId;
    const chainId = parseInt(chainIdHex, 16);
    log1("chainId:", chainId, ", chainId:", chainId);
    let mesg = "";
    if (chainIdHex === "0x38") {
      mesg = "chainIdHex 0x38 56 for BSC Mainnet detected";
    } else if (chainIdHex === "0x61") {
      mesg = "chainIdHex 0x61 97 for BSC Testnet detected";
    }
    log1(mesg);
    if(chainId === config.contractPair){
      log1("Matched network");
      return {isOk: true, chainId, mesg};
    } else {
      console.error("Unmatched network! Either change config contractPair or change MetaMask network");
      return {isOk: false, chainId, mesg};
    }
  };

export const init = async () =>
  new Promise(async (resolve, reject) => {
    let mesg;
    log1("init()");
    try {
      const web3 = await getWeb3().catch((err) => {
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
      log1("accounts:", accounts);

      const [
        addrTokenERC20,
        addrPriceBetting,
        addrRoundIdCtrt,
        addrPricefeed_BTCUSD,
        addrPricefeed_ETHUSD
      ] = await getCtrtAddresses();

      log1("\naddrTokenERC20:", addrTokenERC20,
        "addrPriceBetting:", addrPriceBetting,
        "\naddrRoundIdCtrt:", addrRoundIdCtrt,
        "\naddrPricefeed_BTCUSD:", addrPricefeed_BTCUSD,
        "\naddrPricefeed_ETHUSD:", addrPricefeed_ETHUSD,
      );

      let instTokenERC20;
      const chainIdHex = window.ethereum.chainId;
      log1("chainIdHex:", chainIdHex);
      if (chainIdHex === "0x38") {
        log1("chainIdHex 0x38 56 for BSC Mainnet detected");
        instTokenERC20 =  new web3.eth.Contract(
          ERC20Token.abi,
          addrTokenERC20
        );
      } else if (chainIdHex === "0x61") {
        log1("chainIdHex 0x61 97 for BSC Testnet detected");
        instTokenERC20 =  new web3.eth.Contract(
          ERC20Token.abi,
          addrTokenERC20
        );
      } else if (chainIdHex === "0x64") {
        log1("chainIdHex 0x64 100 for xDAI detected");
      } else {
        mesg = "chainIdHex invalid";
        reject(mesg);
        return false;
      }
      /**
        config.TokenERC20_BSC_1,
        config.priceBetting_BSC1,
        config.RoundIdCtrt_BSC1,
 */


      if (typeof instTokenERC20 === "undefined") {
        log1("missing instTokenERC20:", instTokenERC20);
        reject("missing instTokenERC20");
        return false;
      }

      const instPriceBetting = new web3.eth.Contract(
        PriceBettingT1S2.abi,
        addrPriceBetting
      );
      if (typeof instPriceBetting === "undefined") {
        log1("missing instPriceBetting:", instPriceBetting);
        reject("missing instPriceBetting");
        return false;
      }

      const instRoundIdCtrt = new web3.eth.Contract(
        RoundIdCtrt.abi,
        addrRoundIdCtrt
      );
      if (typeof instRoundIdCtrt === "undefined") {
        log1("missing instRoundIdCtrt:", instRoundIdCtrt);
        reject("missing instRoundIdCtrt");
        return false;
      }

      const instChainlinkPF_BTCUSD = new web3.eth.Contract(
        ChainlinkPF_BTCUSD_BSC.abi,
        addrPricefeed_BTCUSD
      );
      if (typeof instChainlinkPF_BTCUSD === "undefined") {
        log1("missing instChainlinkPF_BTCUSD:", instChainlinkPF_BTCUSD);
        reject("missing instChainlinkPF_BTCUSD");
        return false;
      }

      const instChainlinkPF_ETHUSD = new web3.eth.Contract(
        ChainlinkPF_ETHUSD_BSC.abi,
        addrPricefeed_ETHUSD
      );
      if (typeof instChainlinkPF_ETHUSD === "undefined") {
        log1("missing instChainlinkPF_ETHUSD:", instChainlinkPF_ETHUSD);
        reject("missing instChainlinkPF_ETHUSD");
        return false;
      }

      const instContracts = [
        instTokenERC20,
        instPriceBetting,
        instRoundIdCtrt,
        instChainlinkPF_BTCUSD,
        instChainlinkPF_ETHUSD
      ];

      log1("init is successful");
      resolve([web3, accounts, chainIdHex, instContracts]);
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
