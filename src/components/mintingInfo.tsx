import React from 'react';


interface MintingInfoProps {
    message: string,
    title: string;
    accentText: string;
    centered?: boolean;
}


const MintingInfo: React.FC<MintingInfoProps> = (props: MintingInfoProps) => {

    return (
        <div className={`flex column ${props.centered ? 'centered': ''}`}>
            <div className={"text-accent"}>{props.accentText}</div>
            <div className={"title medium uppercase bold dark"}>{props.title}</div>
            <div className={"text-info mb-small"}>{props.message}</div>
        </div>
    );
};

export default MintingInfo;