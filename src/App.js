import "./App.scss";
import "semantic-ui-css/semantic.min.css";
import React, { useState, useEffect } from "react";
import { Form, Button, Label, Dropdown, Grid, } from "semantic-ui-react";//Input, 
//Card, Header, Segment, GridRow, Message,

//import { DropDownRewardsCtrts } from "./dropdown";
import {init, log1, fromWei,} from "./ethereum/ethFunc";//getGasData, getERC20Balance,  checkNetwork, getNFTBalance, 
import { config, assetSelections} from "./ethereum/config"; 
import {BalanceOf, CheckUser, CheckAvailable, GetSalePrices} from "./ethereum/store";

import Directory from './components/directory/directory';
//import Header from './components/header/header';

/**
To add a function: duplicate App function, errMsg, UI, store function(Ethereum function), replace from red part in App.js
*/
import EthereumContext from "./ethereumContext"; //no {}
//import ChildComponent from "./ChildComponent";

function App() {
  if(window.ethereum) window.ethereum.autoRefreshOnNetworkChange = false;

  //const gasPriceDefault = config.gasPriceDefault;//1 GWei
  //const gasLimitDefault = config.gasLimitDefault;//1000000
  const [compo, setCompo] = useState([]);

  //const [gasPrice, setGasPrice] = useState(gasPriceDefault);
  //const [gasLimit, setGasLimit] = useState(gasLimitDefault);
  //const [loading, setLoading] = useState(false);
  //const [errMsg, setErrMsg] = useState("");
  const userChoice = config.defaultUserChoice;
  let userAddrDefault;
  if(userChoice === 1) {
    userAddrDefault = config.user1;
  } else {
    userAddrDefault = config.user2;
  }
  //const [userAddr, userAddrSet] = useState(userAddrDefault);

  const [nftBalance, nftBalanceSet] = useState(-1);
  //const [tokenIDs, tokenIDsSet] = useState([]);
  const [tokenIDsForSales, tokenIDsForSalesSet] = useState([]);
  const [tokenIDsString, tokenIDsStringSet] = useState("");
  const [salePrices, salePricesSet] = useState("");
  //const [tokenIDsStrSold, tokenIDsStrSoldSet] = useState("");

  useEffect(() => {
    //cannot add async here, so make async below
    const initAction = async () => {
      const compo1 = await init().catch((err) => {
        console.error(`initAction failed: ${err}`);
        //alert(`initialization failed`);
        return;
      });
      log1("compo1:", compo1)
      if(compo1){
        setCompo([...compo1, assetSelections[0].value]);
      }

      let provider, isMetaMask2;
      if(!window.ethereum){
        //console.warn("window.ethereum does not exist")
      } else {
        log1("window.ethereum is valid")
        provider = window.ethereum;
        isMetaMask2 = provider.isMetaMask;
        log1("isMetaMask2:", isMetaMask2);
        
        provider.on('accountsChanged', (accounts) =>{
          log1("accountsChanged:", accounts);
          if(accounts.length === 0){
            console.error("accounts are empty");
          }
          setCompo(prevCompo => [prevCompo[0], accounts, prevCompo[2], prevCompo[3], prevCompo[4], prevCompo[5]]);
        });
        
        provider.on('chainChanged', (chainId) => {
          log1("App chainId:", chainId);
          // Handle the new chain.
          // Correctly handling chain changes can be complicated.
          // We recommend reloading the page unless you have good reason not to.
          window.location.reload();
        });
      }
    };
    initAction();
  }, []); //[] for running once

  //wait for all requirements are populated: load initial conditions
  useEffect(() => {
    const run = async () => {
      log1("useEffect2: good")
      await BalanceOf1();
      await CheckUser1();
      await CheckAvailable1();
      await GetSalePrices1();
    };
    if (!Array.isArray(compo) || !compo.length) {
      log1("useEffect2: is not an array, or is empty")
    } else {
      run();
    }
  }, [compo]);

  //const delayInMilliseconds = 5000; //1 second
  // const showErrForDuration = async () => {
  //   setTimeout(function () {
  //     //your code to be executed after 1 second
  //   }, delayInMilliseconds);
  // };

  const GetSalePrices1 = async (event) => {
    if(event) event.preventDefault();
    log1("---------== GetSalePrices1()");
    // setLoading(true);
    // setErrMsg("");
    const data1 = await GetSalePrices(compo).catch((err) => {
      console.error("err@GetSalePrices:", err);
      salePricesSet("?");
      //setErrMsg("GetSalePrice1 failed");
      return false;
    });
    salePricesSet(data1);
  }

  const BalanceOf1 = async (event) => {
    if(event) event.preventDefault();
    log1("---------== BalanceOf1()");
    // setLoading(true);
    // setErrMsg("");
    const data1 = await BalanceOf(compo).catch((err) => {
      console.error("err@BalanceOf:", err);
      nftBalanceSet(-2);
      //setErrMsg("BalanceOf1 failed");
      return false;
    });
    nftBalanceSet(data1);
  }

  const CheckUser1 = async (event) => {
    if(event) event.preventDefault();
    log1("---------== CheckUser1()");
    // setLoading(true);
    // setErrMsg("");
    const data1 = await CheckUser(compo).catch((err) => {
      //setErrMsg("CheckUser1 failed");
      return false;
    });
    log1("CheckUser:", data1);
    const tokenIds = [];
    let tokenIdsString1 = "tokenIds: ";
    let tokenId = 0;
    if (!Array.isArray(data1) || !data1.length) {
      log1("is not an array, or is empty")
    } else {
      data1.forEach((item,idx) => {
        if(item) {
          //log1(idx);
          tokenId = idx + 1;
          tokenIds.push(tokenId);
          if(hasNumber(tokenIdsString1)){
            tokenIdsString1 += ", "+tokenId.toString();
          } else {
            tokenIdsString1 += tokenId.toString();
          }
        } else {
          
        }
      });
    }
    log1("tokenIds:", tokenIds, tokenIdsString1);
    //tokenIDsSet(tokenIds);
    tokenIDsStringSet(tokenIdsString1);
  }

  const CheckAvailable1 = async (event) => {
    if(event) event.preventDefault();
    log1("---------== CheckAvailable1()");
    // setLoading(true);
    // setErrMsg("");
    const data1 = await CheckAvailable(compo).catch((err) => {
      //setErrMsg("CheckUser1 failed");
      return false;
    });
    log1("CheckAvailable:", data1);
    const tokenIds = [];
    let tokenIdsString1 = "tokenIds: ";
    let tokenId = 0;
    if (!Array.isArray(data1) || !data1.length) {
      // array does not exist, is not an array, or is empty
    } else {
      data1.forEach((item,idx) => {
        if(item) {
          //log1(idx);
          tokenId = idx + 1;
          tokenIds.push(tokenId);
          if(hasNumber(tokenIdsString1)){
            tokenIdsString1 += ", "+tokenId.toString();
          } else {
            tokenIdsString1 += tokenId.toString();
          }
        } else {
          
        }
      });
    }
    log1("tokenIdsAvailable:", tokenIds, ", tokenIdsString1:", tokenIdsString1);
    tokenIDsForSalesSet(tokenIds);
    //tokenIDsStrSoldSet(tokenIdsString1);
  }

  function hasNumber(myString) {
    return /\d/.test(myString);
  }

  const paymentTypeHandleDropdown = (e, { value }) => {
    log1("paymentType:", value);
    //paymentTypeSet(value);
    setCompo(prevCompo => [prevCompo[0], prevCompo[1], prevCompo[2], prevCompo[3], prevCompo[4], value]);
  };

  let networkId = 0;
  if(compo === undefined || compo.length !== 6) {
    console.warn("compo failed in App.js:", compo);
    networkId = 0
  } else {
    networkId = compo[2];
  }

  let networkStatus = "";
  if(compo[4] === false){
    networkStatus = "Please install a wallet like MetaMask and switch to a correct network";
  } else if(networkId !== Number(config.contractPair)){
    networkStatus = "Incorrect Network. Please change your MetaMask network to Ethereum Mainnet"
  } else {
    networkStatus = "Good";
  }

  return (
    <div className="App">
      <EthereumContext.Provider value={compo}>
      <h1>Freedom Reserve Limited Edition Coins</h1>
        <h3>Connected Network ID: {networkId === 0? "Please use WEB3 browser and choose correct network":networkId}, Network Status: {networkStatus}</h3>
        <h3>Connected address: {compo[1]}</h3>
        <h3>Sale Price: {fromWei(salePrices[0])} ETH or {fromWei(salePrices[1])} Freedom Reserve coin per NFT</h3>

        <br></br>
        <Form onSubmit={BalanceOf1} >
          <Button
            content="BalanceOf"
            color='green'
          />
          <Label size={'huge'}>{nftBalance} Freedom Reserve NFT</Label>
        </Form>

        <br></br>
        <Form onSubmit={CheckUser1} >
          <Button
            content="Check User's Token IDs"
            color='green'
          />
          <Label size={'huge'}>{tokenIDsString}</Label>
        </Form>

        <Grid columns={1}>
            <Grid.Row centered columns={3}>
              <Grid.Column>
                <Dropdown
                  placeholder="Pay with Ether"
                  scrolling
                  wrapSelection={false}
                  selection
                  options={assetSelections}
                  onChange={paymentTypeHandleDropdown}
                />
              </Grid.Column>
            </Grid.Row>
        </Grid>
        <br></br>

        <br></br>
        <Directory rowNum={1} tokenIDs={tokenIDsForSales} />
        <Directory rowNum={2} tokenIDs={tokenIDsForSales} />

        <br></br>
        <div className="para2" >
        <h3>These coins commemorate the founding of Freedom Reserve.</h3>
        <h3>The special powers they confer on their holders will be revealed soon.</h3>

        <h3>(All funds raised go towards an exchange listing for Freedom Reserve.)
        </h3>
        <br></br>
        <h3>Copyright 2021 Freedom Reserve. All rights reserved</h3>
        </div>

      </EthereumContext.Provider>
    </div>
  );
  
}

export default App;
/**
          <br></br>
          <Form error={!!errMsg}>
            <Message error header="Error" content={errMsg} />
            <Button color="orange" loading={loading} content="setGasPrice" />
            <Input
              label="unit in GWei"
              labelPosition="right"
              placeholder="gas price"
              value={gasPrice}
              onChange={(event) => {
                setGasPrice(event.target.value);
                //checkNumeric(event.target.value, "gasPrice");
              }}
            />
          </Form>

          <br></br>
          <Form error={!!errMsg}>
            <Button color="orange" loading={loading} content="setGasLimit" />
            <Input
              label="unit in Wei"
              labelPosition="right"
              placeholder="gas limit"
              value={gasLimit}
              onChange={(event) => {
                setGasLimit(event.target.value);
                //checkNumeric(event.target.value, "gasLimit");
              }}
            />
          </Form>

          <br></br>
          <Form error={!!errMsg}>
            <Button color="orange" loading={loading} content="userAddr" />
            <Input
              label=""
              labelPosition="right"
              placeholder="0x..."
              value={userAddr}
              onChange={(event) => {
                userAddrSet(event.target.value);
              }}
            />
          </Form>

          <Label>gasPrice: {0}</Label>


<div>
    <ArrayObjects arrayInputs={rewardsDB} />
  </div> 

  <br></br>
  <Header />
  <Label size={'huge'}> Under Construction </Label>
*/
  // const getCurrentAccount = async (event) => {
  //   event.preventDefault();
  //   log1("---------== getCurrentAccount()");
  //   log1("account[0]:", compo[1]);
  //   const out = checkNetwork(); 
  //   log1("out:", out.isOk, out.chainId)
  //   return true;
  // };

  //-------------------==
  //const [Approve1Va1, Approve1SetVa1] = useState("");
  //const [Approve1ErrMsg, Approve1SetErrMsg]= useState("");


  // const ArrayObjects = ({ arrayInputs }) => (
  //   <div>
  //     {arrayInputs.map((item) => (
  //       <div className="item" key={item.id}>
  //         id:{item.id}, rewards: {item.reward}, timestamp: {item.updatedAt}
  //       </div>
  //     ))}
  //   </div>
  // );
  //-------------------==
  // const checkNumeric = (inputValue, inputSource) => {
  //   log1("checkNumeric", inputValue);
  //   if (inputValue === "" || inputValue < 0 || isNaN(inputValue)) {
  //     const errMsg =
  //       "input error@ " +
  //       inputSource +
  //       ": amount cannot be empty, zero, negative, or non-numeric";
  //     console.warn(errMsg);
  //     showErr(inputSource, errMsg);
  //     return false;
  //   } else {
  //     log1("checkNumeric Ok");
  //     clearErr(inputSource);
  //     return true;
  //   }
  // };
  // const showErr = (inputSource, errMsg) => {
  //   switch (inputSource) {
  //     case "gasPrice":
  //       setErrMsg(errMsg);
  //       break;
  //     case "gasLimit":
  //       setErrMsg(errMsg);
  //       break;
  //     default:
  //       console.warn("showErr: no matched inputSource");
  //   }
  // };
  // const clearErr = (inputSource) => {
  //   switch (inputSource) {
  //     case "gasPrice":
  //       setErrMsg("");
  //       break;
  //     case "gasLimit":
  //       setErrMsg("");
  //       break;
  //     default:
  //       console.warn("clearErr: no matched inputSource");
  //   }
  // };
