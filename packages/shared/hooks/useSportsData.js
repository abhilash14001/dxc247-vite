import { useEffect, useState } from 'react';
import axios from 'axios';
import useCommonData from './useCommonData';

const useSportsData = (token, unAuthorizeHandle, navigate, includeCricket = true) => {
    const [tennisList, setTennisList] = useState([]);
    const [soccerList, setSoccerList] = useState([]);
    const [cricketList, setCricketList] = useState([]);
    const [matchesData] = useCommonData();
    const loadSportsData = () => {

        const cricket = matchesData?.sports?.cricket;
        const soccer = matchesData?.sports?.soccer;
        const tennis = matchesData?.sports?.tennis;


        
        if (cricket !== null) {

            setCricketList(cricket);
        }
        if (soccer !== null) {
            setSoccerList(soccer);
        }
        if (tennis !== null) {
            setTennisList(tennis);
        }


    };

    useEffect(() => {
        if (typeof token !== 'undefined') {
            loadSportsData();
        }
    }, [token, includeCricket, matchesData?.sports?.cricket, matchesData?.sports?.soccer, matchesData?.sports?.tennis]);

    return {
        tennisList,
        soccerList,
        cricketList,
        setTennisList,
        setSoccerList,
        setCricketList,
        loadSportsData
    };
};

export default useSportsData;
