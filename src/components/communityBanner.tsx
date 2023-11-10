import React from 'react';

const CommunityBanner: React.FC<any> = () => {

    const renderContent = (): JSX.Element => {
        return (
            <div className={"banner-container page-width"}>
                <div className={"banner-content"}>
                    <div className={"title medium uppercase bold mb-small"}>Join the community</div>
                    <div className={"mb-small"}>
                        If you want to join the #HODGANG it’s here. Join us to get the news as soon as possible and follow our latest announcements.
                    </div>
                    <button className={"btn"}
                            onClick={() => window.open("https://discord.com/invite/SjjqTm76mv", "_blank")}>
                        <span>JOIN DISCORD</span>
                    </button>
                </div>
            </div>
        )
    }
    return renderContent()
}

export default CommunityBanner