import React, { useContext } from 'react';
import "semantic-ui-css/semantic.min.css";
//import { Form, Button, Input, Label, Message, Dropdown, Grid, } from "semantic-ui-react";
import EthereumContext from "../../ethereumContext"; //no {}
import { withRouter } from 'react-router-dom';
import './menu-item.scss';
import {config, assetSelections} from '../../ethereum/config';
import { buyNFTViaETH, buyNFTViaToken} from '../../ethereum/store';
import { getGasData} from "../../ethereum/ethFunc";

const log1 = console.log;

const MenuItem = ({title, imageUrl, size, history, tokenIDs, match}) => {
  log1("---------== MenuItem")
  const compo = useContext(EthereumContext);
  let data1, isAvailable = false;

  const tokenId = parseInt(title.replace("# ", ""));
  if(Array.isArray(tokenIDs) && tokenIDs.length > 0){
    log1("tokenIDs exist");
    isAvailable  = tokenIDs.includes(tokenId);
  }
  log1("tokenId:", tokenId, ", isAvailable:", isAvailable);
  
  const ItemLabel1 = (isAvailable)?"BUY NOW":"Sold Out";
  const ItemStyle = (isAvailable)?"BUYNOW":"SoldOut";

  if (config.isProduction !== 1) {
    imageUrl = "/img/3dgold1.png";
  }
  const buyNFTViaETH1 = async () => {
    log1("---------== buyNFTViaETH1():", title);
    // setLoading(true);
    // setErrMsg("");
    log1("compo[4]:", compo[4])
    if(compo[4] === false){
      console.warn("compo[4] invalid")
      window.alert("Please install a wallet like MetaMask and switch to a correct network")
      return false;
    } else if(isAvailable){
      const gasPrice = await getGasData();
      const gasLimit = config.gasLimit;
  
      data1 = await buyNFTViaETH(compo, gasPrice, gasLimit, tokenId).catch((err) => {
        //setErrMsg("buyNFTViaETH1 failed");
        return false;
      });
      log1("txHash:", data1);
      window.location.reload();
    } else {
      log1("already sold")
    }
  }

  const buyNFT = async (event) => {
    event.preventDefault();
    log1("---------== buyNFT():", title);
    if(compo[5] === assetSelections[0].value){
      await buyNFTViaETH1();
    } else {
      log1("buyNFTViaToken1, compo:", compo, ", isAvailable:", isAvailable);
      await buyNFTViaToken1();
    }
  }

  const buyNFTViaToken1 = async () => {
    log1("---------== buyNFTViaToken1():", title);
    // setLoading(true);
    // setErrMsg("");
    log1("compo[4]:", compo[4])
    if(compo[4] === false){
      console.warn("compo[4] invalid")
      window.alert("Please install a wallet like MetaMask and switch to a correct network")
      return false;
    } else if(isAvailable){
      const gasPrice = await getGasData();
      const gasLimit = config.gasLimit;
  
      data1 = await buyNFTViaToken(compo, gasPrice, gasLimit, tokenId).catch((err) => {
        //setErrMsg("buyNFTViaToken1 failed");
        return false;
      });
      log1("txHash:", data1);
      window.location.reload();
    } else {
      log1("already sold")
    }
  }
  
  return (
    <div 
      className={`${size} menu-item`} //dynamic classname
      onClick={(e)=> {
        buyNFT(e);
        }}
      >
      
      <div className='background-image' 
      style={{backgroundImage: `url(${imageUrl})`  }} />

      <div className='content'>
        <h1 className='title'>{title.toUpperCase()}</h1>
        <span className={`${ItemStyle} subtitle`} >{ItemLabel1}</span>
      </div>

    </div>
  );
}
//export default (MenuItem);
export default withRouter(MenuItem);
/**
  onClick={()=> history.push(`${match.url}${linkUrl}`)
  
      <CustomButton onClick={()=> log1("clicked")} inverted>
        Add to cart </CustomButton>

<div className='content'>
      <h1 className='title'>{title.toUpperCase()}</h1>
      <span className='subtitle'>SHOP NOW</span>
    </div>
 */