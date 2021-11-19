import React from 'react';
import { ReactComponent as Logo } from '../assets/images/logo3.svg';
import "./Header.css";

function Header() {
    return (
        <div class="header">
            <div className="header__logo">
                <Logo />
            </div>

        </div>
    )
}

export default Header;
