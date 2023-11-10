import React, {useState} from 'react';
import backgroundText1 from '../assets/dracula-text.png';
import backgroundText2 from '../assets/house-text.png';
import showMoreImg from '../assets/show-more.png';
import showLessImg from '../assets/show-less.png';
import showMoreImgMobile from '../assets/show-more-mobile.png';
import showLessImgMobile from '../assets/show-less-mobile.png';

const Story: React.FC<any> = () => {

    const [showMore, setShowMore] = useState(false);

    const text = "We are Count Dracula’s true descendants, born, raised, and now living in the actual Transylvania land, here to change the world in his name, with your help!\n\n" +
        "There are 9,998 MetaVamps including the Wicca coven and a unique Katharina. Would you join The Order of the Dragon and help us find her? To understand your mission, read below.\n\n" +
        "The world will never be the same with his return…\n\n" +
        "In a time of war and danger, the legend of a bloodthirsty and tyrannical Transylvanian ruler was born. He was ruthless, he was bloody, he was the ultimate punisher the world had ever seen.\n\n" +
        "He conquered lands, he converted enemies, he burned churches and he pulled into the spear everyone who dared to be against him.\n\n" +
        "But there is one single world he didn’t conquer. The Love world.\n\n" +
        "He had never had the chance to marry his true love, Katharina. His soulless enemies had dropped them apart, kidnapping the one woman in the world who could soften Count Dracula’s icy heart and hiding her somewhere in the Metaverse.\n\n" +
        "To make sure that Dracula will never find his love, his heartless enemies have bribed Wicca, a coven of powerful witches, convincing it to perform a spell that will make every single member look exactly like Katharina for all eternity. Our mission becomes even harder, as we must identify the real Katharina from a crowd full of impostors.\n\n" +
        "Now, the Count has reunited us, his true descendants, under The Order of the Dragon and charged us with the single mission of searching for his true love in the METAVERSE.\n\n" +
        "House of Dracula is a Transylvania-based project with an initial drop of 9,999 unique 3D NFTs that unites history, fantasy, mystery, technology, and community. We are here for the long road as we know that completing the mission that Count Dracula gave us is not an easy job. We are here to conquer the metaverse in the search for love.\n\n" +
        "You can find more about our team and our roadmap teaser below but have in mind that the best information is yet to come, as we move forward with the launching.\n\n" +
        "And the world will never be the same again…"

    const renderContent = (): JSX.Element => {
        return (
            <div id={"story"} className={"story-container section wide"}>
                <img src={backgroundText1} className={"story-floating-text-img right"} alt="House of Dracula"/>
                <img src={backgroundText2} className={"story-floating-text-img"} alt="House of Dracula"/>
                <div className={"page-width"}>
                    <div className={"story-title-container mb-medium"}>
                        <div className={"title big uppercase bold accent-color"} style={{marginRight: "35px"}}>Story</div>
                        <div className={"title wide bold uppercase"}>The world will never be {'\n'}the same again...</div>
                    </div>
                    <div className={"text-basic"}>
                        {showMore ? text : `${text.substring(0, 336)}`}
                        <div onClick={() => setShowMore(!showMore)}>
                            {showMore ?
                                <React.Fragment>
                                    <img src={showLessImg} className={"story-show-more"} alt="show more"/>
                                    <img src={showLessImgMobile} className={"story-show-more mobile"} alt="show more"/>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <img src={showMoreImg} className={"story-show-more"} alt="show less"/>
                                    <img src={showMoreImgMobile} className={"story-show-more mobile"} alt="show less"/>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return renderContent()
}

export default Story