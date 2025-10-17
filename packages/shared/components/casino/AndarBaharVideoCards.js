import React, {useRef, useEffect} from 'react';
import Slider from 'react-slick';

const AndarBaharVideoCards = React.memo(({
                                  cards,
                                  player,
                                  setShowCardCount = null,
                                  showCardCount = false,
                                  hidePlayers = false,
                                  dontSplit = false,
                                  styles = {width: "50px"},
                                  gamename = null,
                                  onlyHidePlayers = false
                              }) => {
    // All hooks must be called at the top, before any conditional logic
    const sliderRef = useRef(null);
    
    // Effect to scroll to the last slide when the component updates
    useEffect(() => {
        // Process cards for this effect
        let effectProcessedCards = cards;
        if (typeof effectProcessedCards === 'string' && effectProcessedCards.includes(",")) {
            effectProcessedCards = effectProcessedCards.split(",");
        }
        if (hidePlayers === true && !dontSplit) {
            effectProcessedCards = effectProcessedCards.slice(3, effectProcessedCards.length);
        }
        if (!effectProcessedCards || !Array.isArray(effectProcessedCards)) return;
        
        // Calculate cards for this effect
        const effectBaharCards = Array.isArray(effectProcessedCards) ? effectProcessedCards.filter((_, index) => index % 2 === 0).filter(Boolean) : [];
        const effectAndarCards = Array.isArray(effectProcessedCards) ? effectProcessedCards.filter((_, index) => index % 2 !== 0).filter(Boolean) : [];
        const effectAllcards = player === 'Andar' ? effectAndarCards : (dontSplit ? effectProcessedCards : effectBaharCards);
        const effectSlidesToShow = effectAllcards.filter(item => item !== '1').length === 2 ? 2 : 3;
        
        if (sliderRef.current && effectAllcards.filter(item => item !== '1').length > 2) {
            sliderRef.current.slickGoTo(effectAllcards.filter(item => item !== '1').length - effectSlidesToShow);
        }
    }, [cards, player, hidePlayers, dontSplit]);
    
    // Process cards without mutating the prop - not memoized for real-time data
    let processedCards = cards;
    
    if (typeof processedCards === 'string' && processedCards.includes(",")) {
        processedCards = processedCards.split(",");
    }
    
    if (hidePlayers === true && !dontSplit) {
        processedCards = processedCards.slice(3, processedCards.length);
    }
    
    // Early returns after hooks are defined
    if(!processedCards || !Array.isArray(processedCards)) return null;
    const filterProcessedCards = processedCards.filter(item => item !== '1');
    if(!filterProcessedCards) return null;

    // Filter cards based on their index - not memoized for real-time data
    const baharCards = Array.isArray(processedCards) ? processedCards.filter((_, index) => index % 2 === 0).filter(Boolean) : [];
    
    const andarCards = Array.isArray(processedCards) ? processedCards.filter((_, index) => index % 2 !== 0).filter(Boolean) : [];

    // Determine which cards to display based on the player - not memoized for real-time data
    const allcards = player === 'Andar' ? andarCards : (dontSplit ? processedCards : baharCards);

    // Slider settings - not memoized to avoid affecting real-time API data
    const slidesToShow = allcards.filter(item => item !== '1').length === 2 ? 2 : 3;
    const settings = {
        infinite: false,
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToShow,
        swipeToSlide: true,
        arrows: allcards.filter(item => item !== '1').length > 3,
    };


    const allCardsAreOne = allcards.every(card => card === '1');

    // If all cards are '1', hide the slider
    if (allCardsAreOne) {
        if (typeof setShowCardCount === 'function') {
            setShowCardCount(false)
        }
        return null;
    } else {
        if (typeof setShowCardCount === 'function' && showCardCount === false) {
            setShowCardCount(true)
        }
    }

    return (
        <>
        
           
            {/* {(filterProcessedCards.length == 4 && gamename === 'abj') && (
                // <style>
                //     {`
                //         .abj-six-card .slick-track {
                //             width: 125px !important;
                //         }
                //         .abj-six-card .slick-slider {
                //             margin-right: 20px !important;
                //         }
                //         .abj-six-card .slick-list {
                //             padding-right: 15px !important;
                //         }
                //         .abj-six-card .slick-cards {
                //             margin-right: 8px !important;
                //         }
                //     `}
                // </style>
            )} */}
            <div className={`card-inner ${allcards.length === 2 ? 'two-card' : ''} ${(filterProcessedCards.length === 4 && gamename === 'abj') ? 'abj-six-card' : ''}`}>
                {hidePlayers === false && onlyHidePlayers === false && (
                    <p className="text-white mb-1"><b>{player}</b></p>
                )}
                <Slider
                    {...settings}
                    ref={sliderRef}
                >
                    {allcards.map((card, index) => {
                        if (card !== '1') {
                            return (
                                <div id={`${player.toLowerCase()}s-cards`} key={`${card}-${index}`} className="slick-cards">
                                    <img src={`${import.meta.env.VITE_CARD_PATH}${card}.png`} alt={card}/>
                                </div>
                            );
                        }
                        return null;
                    })}
                </Slider>
            </div>
        </>
    );
});

export default AndarBaharVideoCards;
