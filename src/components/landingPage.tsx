import React from 'react';
import mainText from '../assets/hero-page-title.svg';
import mainTextMobile from '../assets/hero-page-title-mobile.svg';
import mainImage from '../assets/hero-page2.png';
import mainImageThmb from '../assets/hero-page-thmb2.png'
import bgImg from '../assets/hero-page-bg2.png'
import bgImgThmb from '../assets/hero-page-bg-thmb2.png'
import ProgressiveImage from 'react-progressive-graceful-image';
import bottomShadow from '../assets/hero-page-bottom.png';

const LandingPage: React.FC<any> = () => {

    const renderContent = (): JSX.Element => {
        return (
            <div id="home" className="landing-page-container">
                <div className={"full-background-image"}>
                    <ProgressiveImage src={bgImg} placeholder={bgImgThmb}>
                        {(src: any, loading: boolean) => (
                            <img style={{opacity: loading ? 0.5 : 1, transition: 'opacity 2s ease-in-out'}}
                                 src={src}
                                 alt="house of dracula"/>
                        )}
                    </ProgressiveImage>
                </div>
                <div className={"page-width main-content-container"}>
                    <div className={"main-text-container"}>
                        <div className={"main-text-header-container"}>
                            <div className={"text-accent mb-small"}>january 2022</div>
                            <div className={"mb-small"}>
                                <img src={mainText} alt="House of Dracula" className={"main-text"}/>
                                <img src={mainTextMobile} alt="House of Dracula" className={"main-text mobile"}/>
                            </div>
                            <div className={"title wide"}>
                                <span style={{fontWeight: 'bold'}}>9.999 </span>
                                unique 3D NFTs on the {'\n'}Solana blockchain
                            </div>
                        </div>
                        <div className={"title wide"} style={{flexGrow: 1, zIndex: 1}}>
                            Public sale:{'\n'}
                            <span style={{fontWeight: 'bold'}}>01 Feb 2022 20:00 UTC </span>{'\n'}
                            Price: 1 SOL
                        </div>
                    </div>
                    <div className={"main-img-container"}>
                        <ProgressiveImage src={mainImage} placeholder={mainImageThmb}>
                            {(src: any, loading: boolean) => (
                                <img style={{opacity: loading ? 0.5 : 1, transition: 'opacity 2s ease-in-out'}}
                                     src={src}
                                     alt="house of dracula" className="main-image"/>
                            )}
                        </ProgressiveImage>
                    </div>
                </div>
                <img className={"landing-page-bottom-shadow"} src={bottomShadow} alt="House of Dracula"/>
            </div>
        )
    }
    return renderContent()
}

export default LandingPage