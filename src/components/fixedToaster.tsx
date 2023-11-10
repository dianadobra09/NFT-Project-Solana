import React, {useEffect} from 'react'
import {toast} from 'react-hot-toast';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/pro-light-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

interface FixedToasterProps {
    infoMessage?: string;
    message: string;
    accentMessage?: string;
    callToActionUrl?: string;
    callToActionButton?: string;
}

const FixedToaster = (props: FixedToasterProps) => {

    const displayMintNotif = () => {
        return toast.custom((t) => (
            <div className={"toaster-container"}>
                <div className={"toaster-content"}>
                    <div className={"flex column toaster-text"}>
                        <span className={"toaster-main-text"}><span style={{fontWeight: 'bold', textTransform: 'uppercase'}}>{props.accentMessage} </span>{props.message}</span>
                        <span style={{marginTop:'10px'}}>{props.infoMessage}</span>
                    </div>
                    <div className={"buttons-container"}>
                        {props.callToActionUrl &&
                            <button className={"btn hover-dark"}
                                    onClick={() => window.open(`${props.callToActionUrl}`, "_blank")}>
                                {props.callToActionButton}
                            </button>
                        }
                        <button className={"btn-close"}
                                onClick={() => {
                                    toast.dismiss(t.id);

                                }}>
                            <FontAwesomeIcon icon={faTimes as IconProp} size="2x"/>
                        </button>
                    </div>
                </div>
            </div>
        ), {duration: 80000000 }) //TODO: find a better way to make the notif stay forever
    }

    useEffect(() => {
        const tId = displayMintNotif()
        return () => {
            toast.dismiss(tId);
        }
        // eslint-disable-next-line
    }, [props.accentMessage, props.callToActionButton, props.callToActionUrl, props.infoMessage, props.message]);

    return <></>
}

export default FixedToaster;