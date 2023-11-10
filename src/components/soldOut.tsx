import ProgressiveImage from 'react-progressive-graceful-image';
import bgImg from '../assets/minting-bg.png';
import bgImgThmb from '../assets/minting-bg-thmb.png';
import mainImage from '../assets/minting-img.png';
import mainImageThmb from '../assets/minting-img-thmb.png';
import MintingSoldOut from './mintingSoldOut';
import React from 'react';


const SoldOut = () => {
    return (
        <div id="home" className={"minting-page-container"}>
            <div className={"full-background-image"}>
                <ProgressiveImage src={bgImg} placeholder={bgImgThmb}>
                    {(src: any, loading: boolean) => (
                        <img style={{
                            opacity: loading ? 0.5 : 1,
                            transition: 'opacity 2s ease-in-out',
                            width: '100vw',
                            height: 'auto'
                        }}
                             src={src}
                             alt="house of dracula"/>
                    )}
                </ProgressiveImage>
            </div>
            <div className={"minting-left-container"}>
                <div className={"flex centered"}>
                    <ProgressiveImage src={mainImage} placeholder={mainImageThmb}>
                        {(src: any, loading: boolean) => (
                            <img style={{opacity: loading ? 0.5 : 1, transition: 'opacity 2s ease-in-out'}}
                                 src={src}
                                 alt="house of dracula" className="main-image"/>
                        )}
                    </ProgressiveImage>
                </div>
            </div>
            <div className={"minting-right-container"}>
                <div className={"minting-content-container"}>
                    <MintingSoldOut/>
                </div>
            </div>
        </div>
    );
};

export default SoldOut;