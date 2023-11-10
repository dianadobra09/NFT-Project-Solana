import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useState} from 'react';
import {faVolumeSlash, faVolumeUp} from '@fortawesome/pro-duotone-svg-icons';
import {Stream} from '@cloudflare/stream-react';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

const Video: React.FC<any> = () => {

    const [muted, setMuted] = useState(true)


    const toggleMuted = (): void => {
        setMuted(!muted);
    }

    const renderContent = (): JSX.Element => {
        return (
            <div>
                <div className='volume-icon' onClick={toggleMuted}>
                    {muted
                        ? <FontAwesomeIcon icon={faVolumeSlash as IconProp} size="2x"/>
                        : <FontAwesomeIcon icon={faVolumeUp as IconProp} size="2x"/>
                    }
                </div>
                {/*<div className='player-wrapper'>*/}
                {/*    <ReactPlayer*/}
                {/*        playing={true}*/}
                {/*        className='react-player'*/}
                {/*        loop={true}*/}
                {/*        muted={muted}*/}
                {/*        playsinline={true}*/}
                {/*        url='https://watch.videodelivery.net/05640695cfd91da697f584473c561bb7'*/}
                {/*        width='100%'*/}
                {/*        height='100%'*/}
                {/*        config={{*/}
                {/*            file: {*/}
                {/*                attributes: {autoPlay: true}*/}
                {/*            }*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</div>*/}
                <Stream src={"05640695cfd91da697f584473c561bb7"} autoplay={true} loop={true} muted={muted}/>
            </div>
        )
    }

    return renderContent()
}

export default Video