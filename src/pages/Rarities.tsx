import React from 'react';
import rarities from '../assets/rarities.png';
import raritiesThmb from '../assets/rarities-thmb.png';
import ProgressiveImage from 'react-progressive-graceful-image';

const Rarities = () => {

    return <ProgressiveImage src={rarities} placeholder={raritiesThmb}>
        {(src: any, loading: boolean) => (
            <img style={{
                opacity: loading ? 0.5 : 1,
                transition: 'opacity 2s ease-in-out',
                width: '100%',
                height: 'auto',
                overflowY: 'scroll'
            }}
                 src={src}
                 alt="house of dracula"/>
        )}
    </ProgressiveImage>

}
export default Rarities;