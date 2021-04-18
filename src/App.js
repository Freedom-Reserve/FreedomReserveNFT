import "./App.scss";
import "semantic-ui-css/semantic.min.css";
import React, { useState, useEffect } from "react";
import { Form, Button, Input, Label, Message, } from "semantic-ui-react";
//Card, Header, Segment, GridRow, Dropdown, Grid, 

//import { DropDownRewardsCtrts } from "./dropdown";
import {init, log1, } from "./ethereum/ethFunc";//getGasData, getERC20Balance, fromWei, checkNetwork, getNFTBalance, 
import { config } from "./ethereum/config";//rewardsCtrtIdxes, dbSelections, assetNames, outcomes, 
import {BalanceOf, CheckUser, CheckAvailable } from "./ethereum/store";

import Directory from './components/directory/directory';
import Header from './components/header/header';

/**
To add a function: duplicate App function, errMsg, UI, store function(Ethereum function), replace from red part in App.js
*/
import EthereumContext from "./ethereumContext"; //no {}
//import ChildComponent from "./ChildComponent";

function App() {
  if(window.ethereum) window.ethereum.autoRefreshOnNetworkChange = false;

  const gasPriceDefault = config.gasPriceDefault;//1 GWei
  const gasLimitDefault = config.gasLimitDefault;//1000000
  const [compo, setCompo] = useState([]);

  const [gasPrice, setGasPrice] = useState(gasPriceDefault);
  const [gasLimit, setGasLimit] = useState(gasLimitDefault);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const userChoice = config.defaultUserChoice;
  let userAddrDefault;
  if(userChoice === 1) {
    userAddrDefault = config.user1;
  } else {
    userAddrDefault = config.user2;
  }
  const [userAddr, userAddrSet] = useState(userAddrDefault);

  const [nftBalance, nftBalanceSet] = useState(-1);
  const [tokenIDs, tokenIDsSet] = useState([]);
  const [tokenIDsForSales, tokenIDsForSalesSet] = useState([]);
  const [tokenIDsString, tokenIDsStringSet] = useState("");
  const [tokenIDsStrSold, tokenIDsStrSoldSet] = useState("");

  useEffect(() => {
    //cannot add async here, so make async below
    const initAction = async () => {
      const compo1 = await init().catch((err) => {
        console.error(`initAction failed: ${err}`);
        //alert(`initialization failed`);
        return;
      });
      //log1("compo1 length:", compo1.length)
      // await BalanceOf1();
      // await CheckUser1();
      // await CheckAvailable1();
      setCompo(compo1);

      if(!window.ethereum){
        console.error("window.ethereum does not exist")
        return;
      }
      const provider = window.ethereum;
      const isMetaMask2 = provider.isMetaMask;
      log1("isMetaMask2:", isMetaMask2);
      
      provider.on('accountsChanged', (accounts) =>{
        log1("accountsChanged:", accounts);
        if(accounts.length === 0){
          console.error("accounts are empty");
        }
        setCompo(prevCompo => [prevCompo[0], accounts, prevCompo[2], prevCompo[3]]);
      });
      
      provider.on('chainChanged', (chainId) => {
        log1("App chainId:", chainId);
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload();
      });
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

  const BalanceOf1 = async (event) => {
    if(event) event.preventDefault();
    log1("---------== BalanceOf1()");
    // setLoading(true);
    // setErrMsg("");
    const data1 = await BalanceOf(compo).catch((err) => {
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
    tokenIDsSet(tokenIds);
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
    tokenIDsStrSoldSet(tokenIdsString1);
  }
  function hasNumber(myString) {
    return /\d/.test(myString);
  }

  let networkId = 0;
  if (compo === undefined || compo.length !== 4) {
    log1("compo failed", compo);
    networkId = 0
  } else {
    networkId = compo[2];
  }
    // if (typeof rewardsStates !== "undefined") {
    //   //checking reading from smart contracts
    // }

  return (
    <div className="App">
      <EthereumContext.Provider value={compo}>
      <h1>Freedom Reserve Limited Edition Coins</h1>
        <h3>current network: {networkId === 0? "Please use WEB3 browser and choose correct network":networkId}, Network ID: {networkId===Number(config.contractPair)?"Ok":"Incorrect Network"}</h3>
        <h3>current address: {compo[1]}</h3>

        <br></br>
        <Form onSubmit={BalanceOf1} >
          <Button
            content="BalanceOf"
            primary
          />
          <Label size={'huge'}>{nftBalance} Freedom Reserve NFT</Label>
        </Form>

        <br></br>
        <Form onSubmit={CheckUser1} >
          <Button
            content="Check User's Token IDs"
            primary
          />
          <Label size={'huge'}>{tokenIDsString}</Label>
        </Form>

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
        <h3>Copyright 2021 Freedom Reseve. All rights reserved</h3>
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

  // const handleDropdownAssetName = (e, { value }) => {
  //   log1("assetNameDropdown value:", value);
  //   //assetNameSet(value);
  // };
  // const handleDBDropdown = (e, { value }) => {
  //   log1("DBDropdown value:", value);
  //   //outcomeSet(value);
  // };