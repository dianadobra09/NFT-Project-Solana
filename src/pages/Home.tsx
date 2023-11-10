import React from 'react'
import Video from '../components/video';
import Story from '../components/story';
import Roadmap from '../components/roadmap';
import Team from '../components/team';
import Footer from '../components/footer';
import ReleaseBanner from '../components/releaseBanner';
import CommunityBanner from '../components/communityBanner';
import Library from '../components/library';
import Collaborations from '../components/collaborations';
import SoldOut from '../components/soldOut';

export const Home: React.FC<any> = () => {

    const renderContent = (): JSX.Element => {
        return (
            <div>
                <SoldOut/>
                <Library/>
                <Story/>
                <Video/>
                <Collaborations/>
                <Roadmap/>
                <ReleaseBanner/>
                <Team/>
                <CommunityBanner/>
                <Footer/>
            </div>
        )
    }

    return renderContent()
}

export default Home