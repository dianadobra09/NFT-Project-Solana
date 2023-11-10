import React from 'react';
import MintingInfo from './mintingInfo';
import {COLLECTION_NAME} from '../utils/constants';

const MintingSoldOut = () => {

    return (
        <div>
            <MintingInfo accentText={COLLECTION_NAME}
                         message={`You can buy on secondary market from \nmagiceden.io and solanart.io`}
                         title={'Phase 1 is sold out'}/>
            <div className={"flex column"}>
                <button className={"btn wide thin dark mb-small"}
                        onClick={() => window.open(`https://solanart.io/collections/houseofdracula`, "_blank")}>
                    <span>go to solanart</span>
                </button>
                <button className={"btn wide thin dark "}
                        onClick={() => window.open(`https://magiceden.io/marketplace/house_of_dracula`, "_blank")}>
                    <span>go to magiceden</span>
                </button>
            </div>
        </div>
    );
};
export default MintingSoldOut;