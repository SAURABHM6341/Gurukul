import React from "react";
import './header.css';
import searchIcon from '../../assets/search.png';
import cartIcon from '../../assets/cart.png';
import { Link } from 'react-router-dom'
function Header() {
    return (<>
        <div className="header-container">
            <Link to={"/"} >
                <button className="header-logo">
                    <h1>GuruKul</h1>
                </button>
            </Link>
            <div className="header-menu">
                <Link to={'/'} >
                    <button className="header-menu-item">Home</button>
                </Link>
                <div className="header-menu-item">   
                        <div value="">Catalog</div>
                </div>
                <Link to={'/aboutus'} >
                    <button className="header-menu-item">
                        About Us
                    </button>
                </Link>
                <Link to={'/contactus'} >
                    <button className="header-menu-item">
                        Contact Us
                    </button>
                </Link>
            </div>
            <div className="header-icons">
                <div className="header-searchIcon">
                    <img src={searchIcon} alt="" />
                </div>
                <div className="header-cartIcon">
                    <img src={cartIcon} alt="" />
                </div>
                <div className="header-signupIconbutton">
                    <Link to={"/signup"} >
                        <button>Sign Up</button>
                    </Link>
                </div>
            </div>
        </div>
    </>)
}
export default Header;