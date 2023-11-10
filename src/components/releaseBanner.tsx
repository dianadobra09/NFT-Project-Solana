import React from 'react';
import banner from '../assets/release-date-banner.png';
import bannerMobile from '../assets/release-date-banner-mobile.png';

const ReleaseBanner: React.FC<any> = () => {

    const renderContent = (): JSX.Element => {
        return (
            <div style={{display:'flex'}}>
                <img className={"banner-img"} src={banner} alt="House of Dracula"/>
                <img className={"banner-img mobile"} src={bannerMobile} alt="House of Dracula"/>
            </div>
        )
    }
    return renderContent()
}

export default ReleaseBanner