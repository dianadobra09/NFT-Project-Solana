import React from 'react';

const HowToBuy: React.FC<any> = () => {

    const renderContent = (): JSX.Element => {
        return (
            <div id={"story"} className={"section medium"}>
                <div className={"page-width"}>
                    <div className={"mb-medium"} style={{display: 'flex', alignItems: 'baseline', flexWrap: 'wrap'}}>
                        <div className={"title medium uppercase bold accent-color"}
                             style={{marginRight: "35px"}}>How to buy
                        </div>
                        <div className={"title wide bold uppercase"}>a simple guide</div>
                    </div>
                    <div className={"text-basic"}>
                        As you might already know, we are launching on Solana, which means that Bitcoin and Ethereum can’t be used here (nor can a MetaMask wallet). You will need a Solana compatible wallet and some SOL (the Solana cryptocurrency) to purchase our NFTs.{'\n'}
                        We prepared a simple step by step process to help you set up your wallet and be prepared for minting.
                        <div style={{marginTop: "40px"}}>
                            <div className={"title wide bold mb-small"}>
                                <span className={"accent-color"}>I. </span>
                                Get a Solana wallet
                            </div>
                            Luckily, we offer some good options when it comes to wallets:
                            <a href={"https://phantom.app/"} target="_blank" rel="noreferrer"> Phantom</a>,
                            <a href={"https://solflare.com/"} target="_blank" rel="noreferrer"> Solflare</a>,
                            <a href={"https://www.sollet.io/"} target="_blank" rel="noreferrer"> Sollet</a> and
                            <a href={"https://slope.finance/"} target="_blank" rel="noreferrer"> Slope </a>
                            are all easy to use wallets that you can access via web or a browser extension.{'\n\n'}

                            We will stick to Phantom for the purpose of this tutorial. Simply install it in your browser via your browser's extension store and then open it.{'\n'}
                            When setting up a new wallet, Phantom will give you a 12-word seed phrase to write down or store somewhere, in case you need to restore your wallet at some point. Set a password, confirm, and then you’re in. (They also offer a great set up tutorial in case you get stuck){'\n\n'}

                            <span style={{fontStyle: 'italic'}}>Note: </span>
                            The seed phrase is the key to unlocking your wallet. Anyone with this phrase can access it, so keep it in a safe place and don’t share it with anyone.
                        </div>

                        <div style={{marginTop: "40px"}}>
                            <div className={"title wide bold mb-small"}>
                                <span className={"accent-color"}>II. </span>
                                Get some SOL
                            </div>
                            You will need SOL to purchase the House of Dracula NFTs either during the minting process or later on the secondary market, when the collection will be listed on the most important Solana NFT marketplaces.{'\n'}
                            When using Phantom, there are a few different ways to get the coins into your wallet:{'\n'}{'\n'}

                            Purchase SOL at an exchange and then send it to your wallet. For example, you can purchase SOL at
                            <a href={"https://www.coinbase.com/"} target="_blank" rel="noreferrer"> Coinbase</a> or
                            <a href={"https://www.binance.com/"} target="_blank" rel="noreferrer"> Binance </a>
                            and send it over to your Phantom wallet. This should take less than a minute.{'\n\n'}

                            Phantom also offers direct integration with cryptocurrency exchange
                            <a href={"https://ftx.com"} target="_blank" rel="noreferrer"> FTX</a>, making it easy to deposit funds held within that exchange.{'\n\n'}

                            Or, you can transfer USDT stablecoins from an exchange or wallet into your Phantom wallet, and then exchange them for SOL or other Solana-based tokens within Phantom.
                        </div>
                        <div style={{marginTop: "40px"}}>
                            <div className={"title wide bold mb-small"}>
                                <span className={"accent-color"}>III. </span>
                                Buy NFTs
                            </div>
                            On the release day go to the minting page on our website, connect your Solana wallet then we will make the buying process as simple as pressing a button.
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return renderContent()
}

export default HowToBuy