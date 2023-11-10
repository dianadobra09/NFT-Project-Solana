import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDiamond} from '@fortawesome/pro-solid-svg-icons';
import {faDiamond as faDiamondLight} from '@fortawesome/pro-light-svg-icons';
import swordImg from '../assets/sword.png';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

const Roadmap: React.FC<any> = () => {

    const renderContent = (): JSX.Element => {
        return (
            <div id={"roadmap"} className={"page-width section"}>
                <div className={"title centered big bold uppercase mb-big"}>roadmap</div>
                <div className={"roadmap-content"}>
                    <div className={"steps-container text-basic"}>
                        <div className={"step"}>
                            <FontAwesomeIcon className={"step-icon solid"} icon={faDiamond as IconProp} size="2x"/>
                            <FontAwesomeIcon className={"step-icon thin"} icon={faDiamondLight as IconProp} size="2x"/>
                            <div className={"step-content"}>
                                <div className={"title bold mb-small"}>
                                    <span className={"accent-color"}>I. </span>
                                    The Returning
                                </div>
                                The Returning of Count Dracula and its MetaVamps is our first drop of 35% out of the 9,999 unique 3D NFTs. The date is February 1st, 20:00 UTC.
                            </div>
                            <div className={"step-line-first"}/>
                            <div className={"step-line bottom"}/>
                        </div>
                        <div className={"step"}>
                            <FontAwesomeIcon className={"step-icon solid"} icon={faDiamond as IconProp} size="2x"/>
                            <FontAwesomeIcon className={"step-icon thin"} icon={faDiamondLight as IconProp} size="2x"/>
                            <div className={"step-content"}>
                                <div className={"title bold mb-small"}>
                                    <span className={"accent-color"}>II. </span>
                                    GENESIS Launch
                                </div>
                                35 one of a kind, 100% unique Dracula NFTs. This is the GENESIS collection precursor of the House of Dracula collection. This collection was sold out in less than 10 seconds.
                            </div>
                            <div className={"step-line"}/>
                            <div className={"step-line bottom"}/>
                        </div>
                        <div className={"step"}>
                            <FontAwesomeIcon className={"step-icon solid"} icon={faDiamond as IconProp} size="2x"/>
                            <FontAwesomeIcon className={"step-icon thin"} icon={faDiamondLight as IconProp} size="2x"/>
                            <div className={"step-content"}>
                                <div className={"title bold mb-small"}>
                                    <span className={"accent-color"}>III. </span>
                                    Phase 1 Launch
                                </div>
                                This the launch of 35% out of the 9.999 NFTs designed by Count Dracula’s true descendants, born, raised, and now living in the actual Transylvania land, that unites history, fantasy, mystery, technology, and community which is set to be launched on February 1st, 20:00 UTC.
                            </div>
                            <div className={"step-line"}/>
                            <div className={"step-line bottom"}/>
                        </div>
                        <div className={"step"}>
                            <FontAwesomeIcon className={"step-icon solid"} icon={faDiamond as IconProp} size="2x"/>
                            <FontAwesomeIcon className={"step-icon thin"} icon={faDiamondLight as IconProp} size="2x"/>
                            <div className={"step-content"}>
                                <div className={"title bold mb-small"}>
                                    <span className={"accent-color"}>IV. </span>
                                    Phase 2 Launch
                                </div>
                                The launch of the last 6499 NFTs. Katharina, the only 100% unique NFT in the collection is yet to be minted. Who will be the one to find the one and only love of count Dracula? Phase 2 date is TBA.
                            </div>
                            <div className={"step-line"}/>
                            <div className={"step-line bottom"}/>
                        </div>
                        <div className={"step"}>
                            <FontAwesomeIcon className={"step-icon solid"} icon={faDiamond as IconProp} size="2x"/>
                            <FontAwesomeIcon className={"step-icon thin"} icon={faDiamondLight as IconProp} size="2x"/>
                            <div className={"step-content"}>
                                <div className={"title bold mb-small"}>
                                    <span className={"accent-color"}>V. </span>
                                    HOD Battle Card Game
                                </div>
                                A computer-based collectible card game based on the successful Gwent board and first of its kind on the blockchain ecosystem, HOD Card Game integrates NFTs as collectible cards so users can use them to battle, create/play & earn, get custom aesthetics, skills, or trade. Game action will be split into factions so stay tuned for upcoming NFT collections and choose your faction.
                            </div>
                            <div className={"step-line"}/>
                            <div className={"step-line bottom"}/>
                        </div>
                        <div className={"step"}>
                            <FontAwesomeIcon className={"step-icon solid"} icon={faDiamond as IconProp} size="2x"/>
                            <FontAwesomeIcon className={"step-icon thin"} icon={faDiamondLight as IconProp} size="2x"/>
                            <div className={"step-content"}>
                                <div className={"title bold mb-small"}>
                                    <span className={"accent-color"}>VI. </span>
                                    HOD Token
                                </div>
                                HOD Token it’s a multi-utility asset type for the HOD ecosystem including play & earn program, transactions and interactions between users, liquidity mining program, staking and community governance. All the initial holders on HOD collections are eligible for the $HOD Airdrop.
                            </div>
                            <div className={"step-line"}/>
                            <div className={"step-line bottom"}/>
                        </div>
                        <div className={"step"}>
                            <FontAwesomeIcon className={"step-icon solid"} icon={faDiamond as IconProp} size="2x"/>
                            <FontAwesomeIcon className={"step-icon thin"} icon={faDiamondLight as IconProp} size="2x"/>
                            <div className={"step-content"}>
                                <div className={"title bold mb-small"}>
                                    <span className={"accent-color"}>VII. </span>
                                    Marketplace
                                </div>
                                Enabling users to trade their assets as non-fungible tokens (NFTs) for game enhancements or sell/rent their accrued game skills by creating their own NFT collectibles.
                                <div className={"step-line"}/>
                            </div>
                        </div>
                    </div>
                    <img className={"sword"} src={swordImg} alt="House of Dracula"/>
                </div>
            </div>
        )
    }
    return renderContent()
}

export default Roadmap