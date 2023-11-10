import React from 'react';
import amberImg from '../assets/amberrose.png';
import danileighImg from '../assets/danileigh.png';
import theGameImg from '../assets/thegame.png';
import neyoImg from '../assets/neyo.png';
import summerImg from '../assets/summerwalker.png';
import shadmoss from '../assets/shadmoss.png';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInstagram} from '@fortawesome/free-brands-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core'

const Collaborations: React.FC<any> = () => {

    let celebrities = [
        {
            img: amberImg,
            socialId: "@amberrose",
            socialUrl: "https://www.instagram.com/amberrose/"
        },
        {
            img: danileighImg,
            socialId: "@iamdanileigh",
            socialUrl: "https://www.instagram.com/iamdanileigh/"
        },
        {
            img: theGameImg,
            socialId: "@losangelesconfidential",
            socialUrl: "https://www.instagram.com/losangelesconfidential/"
        },
        {
            img: neyoImg,
            socialId: "@neyo",
            socialUrl: "https://www.instagram.com/neyo/"
        },
        {
            img: summerImg,
            socialId: "@summerwalker",
            socialUrl: "https://www.instagram.com/summerwalker/"
        },
        {
            img: shadmoss,
            socialId: "@shadmoss",
            socialUrl: "https://www.instagram.com/shadmoss/"
        },
    ];


    const renderContent = (): JSX.Element => {
        return (
            <div className={"section"}>
                <div className={"page-width collaborations-container"}>
                    <div
                        className={"title medium uppercase bold mb-small centered"}>celebrity {'\n'}collaborations
                    </div>
                    <div
                        className={"text-basic centered mb-medium"}>One of the best worldwide known artists and celebrities JOINED our project!{'\n'}
                        If you are a celebrity, artist, or influencer and you understand HOD’s potential and {'\n'}vision, we are looking forward to hearing from you!
                    </div>
                    <button className={"btn wide colored mb-big"}
                            onClick={() => window.open("https://www.instagram.com/wearehod/", "_blank")}>
                        <FontAwesomeIcon icon={faInstagram as IconProp} size="2x"/>
                        DISCOVER US
                    </button>

                    <div className={"flex space-between"} style={{width: '100%', flexWrap: 'wrap'}}>
                        {celebrities.map((c, i) =>
                            <div key={i} className={"celebrity-container"}
                                 onClick={() => window.open(c.socialUrl, "_blank")}>
                                <img src={c.img} alt="House of Dracula"/>
                                <div className={"text-info small centered"}>{c.socialId}</div>
                            </div>)
                        }
                    </div>
                </div>
            </div>

        )
    }
    return renderContent()
}

export default Collaborations