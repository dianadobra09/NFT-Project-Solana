import React from 'react';
import teamTextImg from '../assets/team-title.png';
import tepesImg from '../assets/tepes.png';
import alucardImg from '../assets/alucard.png';
import stefanImg from '../assets/stefan.png';
import carmillaImg from '../assets/carmilla.png';
import saintGermanImg from '../assets/saint-germain.png';
import hectorImg from '../assets/hector.png';
import syphaImg from '../assets/sypha.png';
import raduImg from '../assets/radu.png';
import backgroundText1 from '../assets/dracula-text.png';
import backgroundText2 from '../assets/house-text.png';

const Team: React.FC<any> = () => {

    const renderContent = (): JSX.Element => {
        return (
            <div id={"team"} className={"team-container section"}>
                <img src={backgroundText1} className={"team-floating-text-img"} alt="House of Dracula"/>
                <img src={backgroundText2} className={"team-floating-text-img right"} alt="House of Dracula"/>
                <div className={"floating-text"}>WE ARE {'\n'}METAVAMPS</div>
                <div className={"page-width"} style={{position: "relative"}}>
                    <img className={"team-title mb-medium"} src={teamTextImg} alt="House of Dracula"/>
                    <div className={"persons-group"}>
                        <div className={"person-container"}>
                            <img src={tepesImg} alt="House of Dracula"/>
                            <div className={"person-name"}>
                                <span>ȚEPEȘ</span>
                            </div>
                            <div className={"person-role"}>FOUNDER OF METAVAMPS</div>
                            <div
                                className={"person-description"}>He is a master in crypto and digitalization, a serial entrepreneur, and the leader we all needed. House of Dracula’s project is his masterpiece.
                            </div>
                        </div>
                        <div className={"person-container"}>
                            <img src={alucardImg} alt="House of Dracula"/>
                            <div className={"person-name"}>
                                <span>ALUCARD</span>
                            </div>
                            <div className={"person-role"}>LEAD DIGITAL ARTIST</div>
                            <div
                                className={"person-description"}>Wizard of 3D and digital design, he is the one bringing to life the most amazing NFTs you’ll ever see. He is recreating history, now in virtual form.
                            </div>
                        </div>
                        <div className={"person-container"}>
                            <img src={carmillaImg} alt="House of Dracula"/>
                            <div className={"person-name"}>
                                <span>CARMILLA</span>
                            </div>
                            <div className={"person-role"}>BLOCKCHAIN MASTER</div>
                            <div
                                className={"person-description"}>Blockchain and programming master, Carmilla is coding the mysteries you’re going yet to find in the incredible House of Dracula. She is the one we shall thank for House of Dracula's functionalities.
                            </div>
                        </div>
                        <div className={"person-container"}>
                            <img src={stefanImg} alt="House of Dracula"/>
                            <div className={"person-name"}>ȘTEFAN</div>
                            <div className={"person-role"}>BLOCKCHAIN & SMART CONTRACT GURU</div>
                            <div
                                className={"person-description"}>Savage in Smart Contract development with over 5 years of experience including companies like Consensys and top DeFi projects. He will make sure that vamps will stay immutable for eternity.
                            </div>
                        </div>
                    </div>

                    <div className={"persons-group"}>
                        <div className={"person-container"}>
                            <img className={"wide"} src={saintGermanImg} alt="House of Dracula"/>
                            <div className={"person-name"}>SAINT-GERMAIN</div>
                            <div className={"person-role"}>Strategic Partnerships & Contracts</div>
                            <div
                                className={"person-description"}>Connecting different parts of the puzzle to bring the order. He is the one you talk to for strategic partnerships, commercial collaborations, and contracts.
                            </div>
                        </div>
                        <div className={"person-container"}>
                            <img className={"wide"} src={hectorImg} alt="House of Dracula"/>
                            <div className={"person-name"}>HECTOR</div>
                            <div className={"person-role"}>Community Management and Moderation</div>
                            <div
                                className={"person-description"}>Experienced in community management, Hector is the second half of our moderation team. He’s here to keep you safe and give you the bloodiest updates on our work.
                            </div>
                        </div>
                        <div className={"person-container"}>
                            <img className={"wide"} src={syphaImg} alt="House of Dracula"/>
                            <div className={"person-name"}>SYPHA</div>
                            <div className={"person-role"}>Lead Storyteller {'\n'} </div>
                            <div
                                className={"person-description"}>Mastering the world of words, she is the one spreading our story and enchanting our community by sharing the progress of our mission
                            </div>
                        </div>
                        <div className={"person-container"}>
                            <img className={"wide"} src={raduImg} alt="House of Dracula"/>
                            <div className={"person-name"}>RADU</div>
                            <div className={"person-role"}>Community Management and Moderation</div>
                            <div
                                className={"person-description"}>Because every community needs a leader, we found the best one and converted him into the MetaVamp of our moderation team. He is taking care of our Discord community, keeping you updated.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
    return renderContent()
}

export default Team