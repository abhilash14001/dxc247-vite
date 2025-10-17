import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DOMPurify from "dompurify";

export const Ab3 = ({cardImages, players = [''], roundHtml = '', resultHTML = ''}) => {
    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 11,
        slidesToScroll: 3,
        swipeToSlide: true,
        arrows: true, // Show arrows
        dots: false,  // Hide dots

    };

    return (
        <div className="casino-result-modal">
            <div className="casino-result-round-id"
                 dangerouslySetInnerHTML=
                     {{__html: DOMPurify.sanitize(roundHtml)}}></div>
            <div className="row mt-2 ab-result-container">

                {players?.map((value, key) => (
                    <div className="col-md-12 text-center" key={key}>
                        <h4 className="result-title">{value}</h4>
                        <div className="casino-result-cards ab-result-slider">
                            <div className="slick-cards-results">

                                <Slider {...settings}>

                                    {cardImages[key]?.map((image, index) => (
                                        <div key={index} style={{outline: "none", width: "63px"}} data-index={index}>
                                            <img style={{width: "100%", display: "inline-block"}} src={image}
                                                 alt={`Card ${index}`}/>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

                    <div dangerouslySetInnerHTML=
                        {{__html: DOMPurify.sanitize(resultHTML)}}></div>



        </div>
    );
};
