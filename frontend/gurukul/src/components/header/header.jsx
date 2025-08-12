import React, { useEffect } from "react";
import './header.css';
// import cartIcon from '../../assets/cart.png';
import { Link, matchPath, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { apiConnector } from '../../service/apiconnector'
import { categories } from '../../service/apis'
import { useState } from "react";
function Header() {
    const cartIcon = "https://res.cloudinary.com/dwwwmae9x/image/upload/v1755000031/cart_qs1nbo.png";
    const [Catalog, setCatalog] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const fetchCategories = async () => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API)
            console.log("print result catalog", result)
            if (result?.data?.tags) {
                setCatalog(result.data.tags);
            } else {
                setCatalog([]);
            }
        } catch (err) {
            console.log("could not fetch the lists", err);
        }
    };
    useEffect(() => {
        fetchCategories();
        
        // Listen for category updates
        const handleCategoriesUpdated = () => {
            fetchCategories();
        };
        
        window.addEventListener('categoriesUpdated', handleCategoriesUpdated);
        
        // Cleanup event listener
        return () => {
            window.removeEventListener('categoriesUpdated', handleCategoriesUpdated);
        };
    }, []);
    const token = useSelector((state) => state.auth?.token)
    const user = useSelector((state) => state.profile?.user);
    const totalItems = useSelector((state) => state.cart?.totalItems)
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }
    const handleClickProfile = () => {
        navigate('/dashboard')
    }
    // const [tagname, setTagname] = useState("");
    // const [tagID, setTagID] = useState("");
    const handleTagPage = (id) => {
       navigate(`/tag/${id}`); 
    }
    return (<>
        <div className="header-container">
            <Link to={"/"} >
                <button className="header-logo">
                    <h1>GuruKul</h1>
                </button>
            </Link>
            <div className="header-menu">
                <Link to={'/'} >
                    <button className="header-menu-item" style={matchRoute('/') ? { color: "#facc15" } : {}}>Home</button>
                </Link>
                <div className="header-menu-item header-Catalog"  >
                    <div >Catalog</div>
                    <div className="Ctaegories">
                        {
                            Catalog.length > 0 ? (
                                Catalog.map((element, index) =>

                                    <div key={element._id || element.name || index} className="categoriestags" onClick={() => handleTagPage(element._id)}>
                                        {element.name}
                                    </div>
                                )
                            ) : (<div className="categoriestags" ></div>)
                        }

                    </div>

                </div>
                <Link to={'/aboutus'} >
                    <button className="header-menu-item" style={matchRoute('/aboutus') ? { color: "#facc15" } : {}}>
                        About Us
                    </button>
                </Link>
                <Link to={'/contactus'} >
                    <button className="header-menu-item" style={matchRoute('/contactus') ? { color: "#facc15" } : {}} >
                        Contact Us
                    </button>
                </Link>
            </div>
            <div className="header-icons">
                {user && user.accountType !== "Instructor" && user.accountType !== "Admin" && (
                    <Link to="/dashboard/cart" className="cart-wrapper">
                        <div className="header-cartIcon">
                            <img src={cartIcon} alt="Cart" />

                            {totalItems > 0 && (
                                <div className="itemincart">
                                    {totalItems}
                                </div>
                            )}
                        </div>
                    </Link>
                )}

                {
                    !user && (
                        <>

                            <Link to={"/login"} >
                                <div className="header-signupIconbutton loginBtnHeader " >
                                    <button style={matchRoute('/login') ? { color: "#facc15" } : {}} >Log In</button>
                                </div>
                            </Link>


                            <Link to={"/signup"} >
                                <div className="header-signupIconbutton" >
                                    <button style={matchRoute('/signup') ? { color: "#facc15" } : {}} >Sign Up</button>
                                </div>
                            </Link>
                        </>
                    )
                }
                {
                    user && (
                        <>
                            <div className="profileDiv" onClick={handleClickProfile} >
                                <img src={user.image} alt="profile" />
                            </div>
                        </>
                    )
                }

            </div>
        </div>
    </>)
}
export default Header;