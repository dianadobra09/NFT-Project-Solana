import React from 'react';
import mainImg from '../assets/nfts/10.png';
import Slider from "react-slick";

const Library: React.FC<any> = () => {

    let carouselImages = [ '2', '3', '4', '5', '6', '7', '8', '9'];

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplaySpeed: 2000,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        centerMode: true,
        variableWidth: true,
        focusOnSelect: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1900,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    const renderContent = (): JSX.Element => {
        return (
            <div className={"section"}>
                <div className={"page-width library-section-container"}>
                    <div className={"library-text-container"}>
                        <div
                            className={"title medium uppercase bold mb-small"}>9.999 unique MetaVamps
                        </div>
                        <div
                            className={"text-basic"}>9,998 MetaVamps committed to helping us find beautiful Katharina!{'\n\n'}
                            As Count Dracula commissioned us, we have started walking around the Metaverse in search of the most powerful candidates to be metavamped.{'\n\n'}
                            We found personalities, warriors, celebrities, and artists that have willingly agreed to be included in the Order of the Dragon, ready to help us find Dracula’s true love, Katharina. {'\n\n'}
                            Here’s a sneak peek into our MetaVamps collection!
                        </div>
                    </div>
                    <img src={mainImg} alt="House of Dracula"/>
                </div>

                <Slider  {...settings} className={"slider"}>
                    {carouselImages.map((img, index) => {
                        return (
                            <div key={index}>
                                <img className={"slider-img"} src={require('../assets/nfts/' + img + '.png').default}
                                     alt={"House of Dracula"}/>
                            </div>
                        )
                    })}

                </Slider>
            </div>

        )
    }
    return renderContent()
}

export default Library