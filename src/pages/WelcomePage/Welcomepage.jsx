import React from 'react'
import "./Welcomepage.css";
import Navigation from '../../components/Navbar/Navigation';
import Home from '../../components/Home/Home';
import Information from '../../components/Information/Information';
import Features from '../../components/Features/Features';
import Footer from '../../components/Footer/Footer';
function Welcomepage() {
  return (
    <div>
        <Navigation/>
        <Home/>
        <Information/>
        <Features/>
        <Footer/>
    </div>
  )
}

export default Welcomepage