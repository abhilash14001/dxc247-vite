export const Race20 = ({lastResults, openPopup}) => {
    const results = {1 : import.meta.env.VITE_CARD_PATH + "spade.png", 2 : import.meta.env.VITE_CARD_PATH + "heart.png",
         3 : import.meta.env.VITE_CARD_PATH + "club.png",
        4 : import.meta.env.VITE_CARD_PATH + "diamond.png",


    };
    return (


            Object.entries(lastResults).map(([key, result]) => {
                const mid = result.mid;


                return (

                        <span className="result" key={mid} onClick={() => openPopup(mid)}>
                                    <img src={results[result.win]} alt={'1'} />
                            </span>

                );
            })
        
    );
}
