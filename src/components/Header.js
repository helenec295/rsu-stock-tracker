import "./Header.css"
import React from 'react'
import Stock from '../images/stock.jpg';

function Header() {
  return (
    <div className='header' style={{ backgroundImage: `url(${Stock})` }}>
        <h1>RSU Price Tracker</h1>
    </div>
  )
}

export default Header