import React from 'react';
import {HashLink} from 'react-router-hash-link';
import logo from '../assets/logo.png'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDiscord} from '@fortawesome/free-brands-svg-icons/faDiscord';
import {useLocation} from "react-router-dom"
import {ROUTES} from '../config/routing';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

const Header: React.FC<any> = (props) => {

    const currentRoute = useLocation().pathname;

    const isWhiteBackground = () => {
        return currentRoute === ROUTES.WHITELIST
    }


    const renderContent = (): JSX.Element => {
        return (
            <header className={`header-bar ${props.minimized || isWhiteBackground() ? "minimized" : ""}`}>
                <div className="header-width header-content">

                    <div className="header-logo-container scrollTo">
                        <HashLink to="/#home">
                            <img className="logo" src={logo} alt="Logo"/>
                        </HashLink>
                    </div>
                    <div className={"menu-items-container"}>
                        <div className="menu-items">
                            <HashLink to="/#story">
                                <span className={`menu-item`}>Story</span>
                            </HashLink>
                            <HashLink to="/#roadmap">
                                <span className={"menu-item"}>Roadmap</span>
                            </HashLink>
                            <HashLink to="/#team">
                                <span className={"menu-item"}>Team</span>
                            </HashLink>
                            <HashLink to="/how-to-buy">
                                <span className={"menu-item"}>How to buy</span>
                            </HashLink>
                            <HashLink to="/rarity">
                                <span className={"menu-item"}>Rarity</span>
                            </HashLink>
                        </div>
                        <button className={`menu-item-btn red`}
                                onClick={() => window.open("https://discord.com/invite/SjjqTm76mv", "_blank")}>
                            <span className={"menu-item-btn-text"}>JOIN DISCORD</span>
                            <FontAwesomeIcon className={"menu-item-btn-img"} icon={faDiscord as IconProp} size="2x"/>
                        </button>
                    </div>
                </div>
            </header>
        )
    }
    return renderContent()
}

export default Header