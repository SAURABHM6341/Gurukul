import React from "react";
import './header.css';
import searchIcon from '../../assets/search.png';
import cartIcon from '../../assets/cart.png';
function Header() {
    return (<>
    <div className="header-container">
        <div className="header-logo"><h1>GuruKul</h1></div>
        <div className="header-menu">
                <div className="header-menu-item">Home</div>
                <div className="header-menu-item">Catalog</div>
                <div className="header-menu-item">About Us</div>
                <div className="header-menu-item">Contact Us</div>
        </div>
        <div className="header-icons">
            <div className="header-searchIcon">
                <img src={searchIcon} alt="" />
            </div>
            <div className="header-cartIcon">
                <img src={cartIcon} alt="" />
            </div>
            <div className="header-signupIconbutton">
                <button>Sign Up</button>
            </div>
        </div>
    </div>
    </>)
}
export default Header;