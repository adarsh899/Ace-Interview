import React from 'react';
import './HomePage.scss';
//import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import Header from '../../components/Header';

export default function HomePage({ history }) {
  return (
    <div className='home-page'>

      {/* <Logo className='logo' /> */}
      {/* <Header /> */}
      <div className='info-wrapper'>
        <div className='app-title'>Ace Interview</div>
        <p className='info'>
          Make A lasting impression so you get that dream job, with the power of AI and Machine learning
        </p>
      </div>
      <Link to="/step/1" className='animated-button1'>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Assess
        {/* <Button variant='contained' color='secondary' onClick={() => { history.push('/assesment') }}>
          Assesment
        </Button> */}
      </Link>
    </div>
  );
}
