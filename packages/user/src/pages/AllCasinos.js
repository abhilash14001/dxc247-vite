import Header from "@dxc247/shared/components/layouts/Header";
import {Link, useParams} from "react-router-dom";
import axiosFetch from "@dxc247/shared/utils/Constants";
import React, {useEffect, useRef, useState} from "react";
import SidebarLayout from "@dxc247/shared/components/layouts/SidebarLayout";
import CommonLayout from "@dxc247/shared/components/layouts/CommonLayout";

function AllCasinos() {

    const [casinoList, setCasinoList] = useState([])
    const [activeTabs, setActiveTabs] = useState('all_casino')
    const [ar_display_casino, setAr_display_casino] = useState({
        all_casino: 'All Casino',
        roulette_casino: 'Roulette',
        teenpatti_casino: 'Teenpatti',
        poker_casino: 'Poker',
        baccarat_casino: 'Baccarat',
        dragon_tiger_casino: 'Dragon Tiger',
        "32_cards_casino": '32 Cards',
        andar_bahar_casino: 'Andar Bahar',
        lucky_7_casino: 'Lucky 7',
        "3_card_judgement_casino": '3 Card Judgement',
        casino_war_casino: 'Casino War',
        worli_casino: 'Worli',
        sports_casino: 'Sports',
        bollywood_casino: 'Bollywood',
        lottery_casino: 'Lottery',
        queen_casino: 'Queen',
        race_casino: 'Race',
        others_casino: 'Others'
    })

    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        scrollContainerRef.current.scrollLeft -= 200; // Adjust the scroll distance as needed
    };

    const scrollRight = () => {
        scrollContainerRef.current.scrollLeft += 200; // Adjust the scroll distance as needed
    };

    const {which_casino} = useParams()

    const allCasinoImg = ['roulette1.jpg', 'roulette.jpg'];

    const LazyBackground = ({ src, className }) => {
        const containerRef = useRef(null);
        const [loaded, setLoaded] = useState(false);

        useEffect(() => {
            const node = containerRef.current;
            if (!node) return;
            let observer;
            if ('IntersectionObserver' in window) {
                observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setLoaded(true);
                            observer.disconnect();
                        }
                    });
                }, { rootMargin: '200px' });
                observer.observe(node);
            } else {
                setLoaded(true);
            }
            return () => observer && observer.disconnect();
        }, []);

        return (
            <div
                ref={containerRef}
                className={className}
                style={loaded ? { backgroundImage: `url(${src})` } : {}}
                aria-label="casino-banner"
                role="img"
            />
        );
    };

    const getCasinoData = () => {
        axiosFetch('getOurCasinoList', 'post', setCasinoList, {
            main_key: activeTabs,
            main: which_casino === 'all_casino' ? 'main' : 'virtual'
        })
            .then(res => {})


    }

    useEffect(() => {
        getCasinoData()

        if (which_casino === 'our-virtual') {
            setAr_display_casino({
                all_casino: 'All Casino',
                teenpatti_casino: 'Teenpatti',
                dragon_tiger_casino: 'Dragon Tiger',

                lucky_7_casino: 'Lucky 7',
                bollywood_casino: 'Bollywood',

                others_casino: 'Others'
            })
        } else {
            setAr_display_casino({
                all_casino: 'All Casino',
                roulette_casino: 'Roulette',
                teenpatti_casino: 'Teenpatti',
                poker_casino: 'Poker',
                baccarat_casino: 'Baccarat',
                dragon_tiger_casino: 'Dragon Tiger',
                "32_cards_casino": '32 Cards',
                andar_bahar_casino: 'Andar Bahar',
                lucky_7_casino: 'Lucky 7',
                "3_card_judgement_casino": '3 Card Judgement',
                casino_war_casino: 'Casino War',
                worli_casino: 'Worli',
                sports_casino: 'Sports',
                bollywood_casino: 'Bollywood',
                lottery_casino: 'Lottery',
                queen_casino: 'Queen',
                race_casino: 'Race',
                others_casino: 'Others'
            })
        }


    }, [which_casino, activeTabs]);

    return (

        <CommonLayout>

            <div className="list-page slot-page">

                <div className="center-container">

                    <div className="casino-sub-tab-list">
  <span className="tabs-arow tabs-arow-left" onClick={scrollLeft}>
                            <i className="fas fa-angle-left"></i>
                        </span>
                        <ul className="nav nav-pills casino-sub-tab" id="casino-sub-tab"  ref={scrollContainerRef}>
                            {Object.entries(ar_display_casino).map(([index, value], i) => {


                                return (
                                    <li className="nav-item" key={i}>
                                    <span onClick={() => setActiveTabs(index)}
                                          className={`nav-link ${activeTabs === index ? 'active' : ''}`}>
                                        <span>{value}</span>
                                    </span>
                                    </li>

                                )
                            })}
                        </ul>
                        <span className="tabs-arow tabs-arow-right" onClick={scrollRight}>
                            <i className="fas fa-angle-right"></i>
                        </span>

                    </div>
                    <div className="tab-content mt-xl-2 mt-1">

                        <div className="tab-pane active" id="poker_casino">
                        <div className="casino-list">
                                {activeTabs !== 'roulette_casino' ? (
                                    // Render casino list for tabs other than 'roulette_casino'
                                    casinoList.map((value, index) => (
                                        <div className="casino-list-item position-relative" key={index}>
                                            <Link to={`/casino/${value.match_id}`}
                                                  className="position-relative d-block">
                                                <LazyBackground src={value.casino_image} className="casino-list-item-banner" />
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    // Render specific content for 'roulette_casino'
                                    allCasinoImg.map((img, idx) => (
                                        <div className="casino-list-item position-relative" key={idx}>
                                            <Link to={`/casino/roulette`} className="position-relative d-block">
                                                <LazyBackground src={`/img/casino/${img}`} className="casino-list-item-banner" />
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </div>

                        </div>
                        {/* Add more tab panes for other casinos as needed */}
                    </div>
                    <div className="slot-iframe">
                        <iframe src="" style={{width: '100%', border: '0px'}}></iframe>
                    </div>
                </div>
            </div>
        </CommonLayout>

    )
}


export default AllCasinos;