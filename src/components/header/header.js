import React from 'react';
//import {Link} from 'react-router-dom';
//import { ReactComponent as Logo } from '../../assets/crown.svg';
import './header.scss';

const Header = ({ hidden }) => (
  <div className='header'>

    <div className='options'>
      <a className='option' href="https://freedomreserv.eth.link" target="_blank" rel="noreferrer">
        HOME PAGE
      </a>

    </div>
  </div>
);

//{user: {curentUser}, cart: {hidden}}

export default Header;
/**
    <div className='options'>
    <Link className='logo-container' to="/">
      <Logo className='logo' />
    </Link>

    <Link className='option' to='https://freedomreserv.eth.link'>
        HOME PAGE
      </Link>

    </div>



    */