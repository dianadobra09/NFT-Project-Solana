import React from 'react';
import logo from '../assets/logo.png';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTwitter} from '@fortawesome/free-brands-svg-icons/faTwitter';
import {faDiscord} from '@fortawesome/free-brands-svg-icons/faDiscord';
import {faInstagram} from '@fortawesome/free-brands-svg-icons';
import {faCopyright} from '@fortawesome/pro-light-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

const Footer: React.FC<any> = () => {

    const renderContent = (): JSX.Element => {
        return (
            <div className={"footer-container page-width"}>
                <div className="footer-logo-container scrollTo">
                    <img className="logo" src={logo} alt="Logo"/>
                </div>
                <div className={"footer-section-container"}>
                    <div className={"footer-section"}>
                        <div className={"footer-title"}>contact us</div>
                        <div className={"footer-text"}>contact@houseofdracula.io</div>
                    </div>
                    <div className={"footer-section"}>
                        <div className={"footer-title"}>follow us</div>
                        <div className={"footer-text"}>
                            <FontAwesomeIcon className={"footer-icon"} icon={faInstagram as IconProp}
                                             onClick={() => window.open("https://www.instagram.com/wearehod/", "_blank")}/>
                            <FontAwesomeIcon className={"footer-icon"} icon={faDiscord as IconProp}
                                             onClick={() => window.open("https://discord.com/invite/SjjqTm76mv", "_blank")}/>
                            <FontAwesomeIcon className={"footer-icon"} icon={faTwitter as IconProp}
                                             onClick={() => window.open("https://twitter.com/wearehod", "_blank")}/>
                        </div>
                    </div>
                </div>
                <div className={"copyright"}>
                    <FontAwesomeIcon className={"footer-icon"}
                                     icon={faCopyright as IconProp}/>2021 HouseOfDracula. All rights reserved.
                </div>
            </div>
        )
    }
    return renderContent()
}

export default Footer