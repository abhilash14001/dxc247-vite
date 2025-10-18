import CommonLayout from "@dxc247/shared/components/layouts/CommonLayout";
import {useState} from "react";
import "../css/spinx.css"

const FantasyGames = () => {
    const fantasyBanners = [
        {game: "diam11", src: "https://sitethemedata.com/casino_icons/other/diam11.png"},
        {game: "playerbattle", src: "https://sitethemedata.com/casino_icons/other/playerbattle.jpeg"},
        {game: "snakes_and_ladders", src: "https://sitethemedata.com/casino_icons/other/snakes-and-ladders.jpg"},
        {game: "rummy", src: "https://sitethemedata.com/casino_icons/other/rummy.jpg"},
        {game: "ludoclub", src: "https://sitethemedata.com/casino_icons/other/ludoclub.jpg"},
        {game: "ludo_lands", src: "https://sitethemedata.com/casino_icons/other/ludo-lands.jpg"},
        {game: "poptheball", src: "https://sitethemedata.com/casino_icons/other/poptheball.jpg"},
        {game: "jetx", src: "https://sitethemedata.com/casino_icons/other/ssg/xgames/jetx.jpg"},
        {game: "cappadocia", src: "https://sitethemedata.com/casino_icons/other/ssg/xgames/cappadocia.jpg"},
        {game: "spinx", src: "https://sitethemedata.com/casino_icons/other/ssg/xgames/spinx.jpg"},
        {game: "jetx3", src: "https://sitethemedata.com/casino_icons/other/ssg/xgames/jetx3.jpg"},
        {game: "cricketx", src: "https://sitethemedata.com/casino_icons/other/ssg/xgames/cricketx.jpg"},
        {game: "vipkeno", src: "https://sitethemedata.com/casino_icons/other/ssg/xgames/vipkeno.jpg"},
        {game: "classickeno", src: "https://sitethemedata.com/casino_icons/other/ssg/xgames/ClassicKeno.jpg"},
        {game: "russiankeno", src: "https://sitethemedata.com/casino_icons/other/ssg/xgames/RussianKeno.jpg"}
    ];

    const [bannerTrigger, setBannerTrigger] = useState('diam11')


    const handleRightSection = (game) => {
        setBannerTrigger(game)
    }
    const renderSection = () => {
        switch (bannerTrigger) {
            case "playerbattle" :
                return <PlayerBattle/>

            case "snakes_and_ladders" :
                return <SnakeAndLadder/>

            case "rummy" :
                return <Rummy/>
            case "ludoclub" :
                return <LudoClub/>

            case "ludo_lands" :
                return <LudoLands/>

            case "poptheball" :
                return <FantasyPopTheBall/>
            case "jetx" :
                return <JetX/>
            case "cappadocia" :
                return <Cappadocia/>
            case "spinx" :
                return <Spinx/>
            case "jetx3" :
                return <Jetx3/>
            case "cricketx" :
                return <CricketX/>
            case "vipkeno" :
                return <VIPKeno/>
            case "classickeno" :
                return <ClassicKeno/>
            case "russiankeno" :
                return <RussianKeno/>

            default :
                return <Diam11/>
        }

    }

    return (
        <CommonLayout>
            <div className="list-page slot-page">
                <div className="center-container">
                    <div className="container-fluid container-fluid-5">
                        <div className="row row5">
                            <div className="col-md-7">
                                <div className="fantasy-banners row row5">
                                    {fantasyBanners.map((banner, index) => (
                                        <div onClick={() => handleRightSection(banner.game)} key={index}
                                             className="col-6 col-md-3 mb-2 fantasy_div_img"
                                             data-game={banner.game}>
                                            <img src={banner.src} alt={banner.game} className="img-fluid pointer"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-md-5 d-none d-xl-block">
                                <div className="fantasy-desc-container">

                                    {renderSection()}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </CommonLayout>

    )

}

const Diam11 = () => (
    <div className="w-100 fantasy_game_details fantasy_diam11" id="fantasy_diam11">
        <h1 className="fantasy-detail-title"><span>Diam11</span>
            <button className="btn btn-lg btn-primary">Play</button>
        </h1>
        <div>
            <div className="nav nav-pills" role="tablist">
                <div className="nav-item"><a role="tab" data-rr-ui-event-key="0" id="fantacy-rules-tabs-tab-0"
                                             aria-controls="fantacy-rules-tabs-tabpane-0" aria-selected="true"
                                             className="nav-link active">Description</a></div>
            </div>
            <div className="tab-content">
                <div role="tabpanel" id="fantacy-rules-tabs-tabpane-0" aria-labelledby="fantacy-rules-tabs-tab-0"
                     className="fade tab-pane active show">
                    <div>
                        <div className="fantasy-rules">
                            <ol className="list-decimal">
                                <li>
                                    Any participant in Diam-11 can form a team on his own,
                                    however the team must have 11 players of which a maximum of
                                    7 players can be selected from the same team of the actual
                                    teams. For example, one can select a maximum of 7 players
                                    from India in an IND vs AUS match.
                                </li>
                                <li>
                                    The team can be formed in any different combination without
                                    exceeding the 100 credit, additionally the same team must
                                    have the following combination in order to get qualified.
                                    <table className="m-1">
                                        <thead>
                                        <tr>
                                            <th>Player Type</th>
                                            <th>Min</th>
                                            <th>Max</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>Wicket Keeper - WK</td>
                                            <td>1</td>
                                            <td>4</td>
                                        </tr>
                                        <tr>
                                            <td>Batsman - BAT</td>
                                            <td>3</td>
                                            <td>6</td>
                                        </tr>
                                        <tr>
                                            <td>All Rounder - AR</td>
                                            <td>1</td>
                                            <td>4</td>
                                        </tr>
                                        <tr>
                                            <td>Bowler - BWL</td>
                                            <td>3</td>
                                            <td>6</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </li>
                                <li>
                                    Captain and Vice-captain has to be assigned once the team is
                                    selected.
                                </li>
                                <li>
                                    Once the line-up flag has been announced:
                                    <ol className="list-outside">
                                        <li>
                                            Changes in the existing team can be done, however
                                            captain and vice-captain cannot be changed.
                                        </li>
                                        <li>New teams cannot be formed.</li>
                                        <li>
                                            Teams already formed can join any contest if the
                                            same haven’t joined any.
                                        </li>
                                    </ol>
                                </li>
                                <li>
                                    Once the live flag is announced:
                                    <ol className="list-outside">
                                        <li>No changes will be permitted.</li>
                                        <li>
                                            No team can join any new contest, even if the team
                                            has been created before live flag.
                                        </li>
                                    </ol>
                                </li>
                                <li>
                                    Substitutes will not be awarded any points for their
                                    contribution.
                                </li>
                                <li>
                                    If a player gets replaced by substitute, but later comes
                                    back on field, he will get points for his contributions.
                                    However, if a player, who was not a part of the announced
                                    lineups, comes to the field as a substitute, he will not get
                                    points for any of his contributions.
                                </li>
                                <li>
                                    Super over is not included in our point system. Therefore,
                                    no points will be awarded for any contribution in super
                                    over.
                                </li>
                                <li>
                                    The points awarded in live are subjected to changes based on
                                    the changes in live, for example a wicket given, and the
                                    decision has been reversed based on DRS or any other fact.
                                </li>
                                <li>Winners will be declared post completion of the match.</li>
                                <li>
                                    These rules doesn’t apply to any other Fancy or Fancy-1
                                    markets.
                                </li>
                                <li>
                                    Winning of any mentioned pots will be decided based on the
                                    number of participants joined. For example, the winning of a
                                    100 participant pot will be different if the entire 100
                                    participants has joined and if only 60 participants has
                                    joined.
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

const PlayerBattle = () => (
    <div className="w-100 fantasy_game_details fantasy_playerbattle" id="fantasy_playerbattle">
        <h1 className="fantasy-detail-title"><span>Player Battle</span>
            <button className="btn btn-lg btn-primary">Play</button>
        </h1>
        <div>
            <div className="nav nav-pills" role="tablist">
                <div className="nav-item"><span role="tab" data-rr-ui-event-key="0" id="fantacy-rules-tabs-tab-0"
                                                aria-controls="fantacy-rules-tabs-tabpane-0" aria-selected="true"
                                                className="nav-link active">Description</span></div>
            </div>

            <div className="tab-content">
                <div role="tabpanel" id="fantacy-rules-tabs-tabpane-0" aria-labelledby="fantacy-rules-tabs-tab-0"
                     className="fade tab-pane active show">
                    <div>
                        <div className="fantasy-rules">
                            <ol className="list-decimal">
                                <li>
                                    Player battle is a skill game where any user can select real
                                    players and play against computer.
                                </li>
                                <li>
                                    User can select his set of players based on the event type.
                                    For example, 2vs2 or 4vs4 based on the game category.
                                </li>
                                <li>
                                    Computer will get default point (points will be based on
                                    game category (2vs2/ 4vs4)) if the player selects the first
                                    player, vice versa player will get default points if he
                                    allows computer to select the first player.
                                </li>
                                <li>
                                    If any player who has been selected is not included in
                                    playing 11 or didn’t get opportunity to play (bat): -
                                    Default runs which was announced in advance will be given to
                                    them respectively.
                                </li>
                                <li>
                                    User are allowed to make any changes in the team before
                                    placing the bet, Once the bet is confirmed user will not be
                                    allowed to make any change in the current team. However,
                                    user is allowed to create new team and participate.
                                </li>
                                <li>Results will be announced post the match.</li>
                                <li>
                                    If the match got interrupted due to any situation such as
                                    rain/bad light and the same gets stopped. Default run/run
                                    scored whichever is the highest will be awarded for the
                                    players who haven’t finished their quota. For example, In a
                                    IND vs ENG T20 match England has completed playing 20 over
                                    and India got to play 10 over post that the match got
                                    stopped due to rain, Then Indian players will get points
                                    based on the above mentioned rule. (Note: This is not
                                    applicable to the player who has already got out before the
                                    match got stopped)
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

)

const SnakeAndLadder = () => (
    <div className="w-100 fantasy_game_details fantasy_snakes_and_ladders" id="fantasy_snakes_and_ladders">
        <h1 className="fantasy-detail-title"><span>snakes and ladders</span>
            <button className="btn btn-lg btn-primary">Play</button>
        </h1>
        <div>
            <div className="nav nav-pills" role="tablist">
                <div className="nav-item"><a role="tab" data-rr-ui-event-key="0" id="fantacy-rules-tabs-tab-0"
                                             aria-controls="fantacy-rules-tabs-tabpane-0" aria-selected="true"
                                             className="nav-link active">Description</a></div>
            </div>

            <div className="tab-content">
                <div role="tabpanel" id="fantacy-rules-tabs-tabpane-0" aria-labelledby="fantacy-rules-tabs-tab-0"
                     className="fade tab-pane active show">
                    <div>
                        <div className="fantasy-rules">
                            <p>
                                Here’s a Snakes and ladders board game to play with your friends
                                and family.
                            </p>
                            <h4><b>How To Play?</b></h4>
                            <ol className="list-decimal">
                                <li className="mb-1">
                                    Take it in turns to roll the dice. Move your counter forward
                                    the number of spaces shown on the dice.
                                </li>
                                <li className="mb-1">
                                    If your counter lands at the bottom of a ladder, you can
                                    move up to the top of the ladder.
                                </li>
                                <li className="mb-1">
                                    If your counter lands on the head of a snake, you must slide
                                    down to the bottom of the snake.
                                </li>
                                <li className="mb-1">If your timer elapse you lose one live.</li>
                                <li className="mb-1">In total you have 5 lives.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

const Rummy = () => {

    const [tabActive, setTabActive] = useState('Description')


    return (

        <div className="w-100 fantasy_game_details fantasy_rummy" id="fantasy_rummy">
            <h1 className="fantasy-detail-title"><span>Rummy</span>
                <button className="btn btn-lg btn-primary">Play</button>
            </h1>
            <div>
                <div className="nav nav-pills" id="tab_fantasy_rummy" role="tablist">
                    <div className="nav-item">
                        <span role="tab" className={`nav-link ${tabActive === 'Description' ? 'active' : ''}`}
                              onClick={() => setTabActive('Description')} data-toggle="pill"
                              aria-controls="tabpane-11" aria-selected="true">
                            Description
                        </span>
                    </div>
                    <div className="nav-item">
                        <span role="tab" className={`nav-link ${tabActive === 'Play' ? 'active' : ''}`}
                              onClick={() => setTabActive('Play')} data-toggle="pill"
                              aria-controls="tabpane-12" aria-selected="false">
                            How to Play
                        </span>
                    </div>
                    <div className="nav-item">
                        <span role="tab" className={`nav-link ${tabActive === 'Scoring' ? 'active' : ''}`}
                              onClick={() => setTabActive('Scoring')} data-toggle="pill"
                              aria-controls="tabpane-13" aria-selected="false">
                            Scoring
                        </span>
                    </div>
                </div>
                <div className="tab-content">
                    <div role="tabpanel" className={`fade tab-pane ${tabActive === 'Description' ? 'active show' : ""}`}
                         id="fantacy-rummy-tabs-tabpane-11"
                         aria-labelledby="fantacy-rummy-tabs-tab-11">
                        <div>


                            <div className="fantasy-rules">
                                <ul className="pl-4 pr-4 list-style">
                                    <li>
                                        To begin the session, each player picks a card at random
                                        from the shuffled deck. Seating is as per card value:
                                        whoever draws the highest card chooses his seat, to his
                                        right the next highest and so on. The lowest, thus, sits to
                                        the left of the highest. The lowest deals first and shuffles
                                        the cards.
                                    </li>
                                    <li>
                                        The player to the left of the dealer draws a card unseen
                                        from the shuffled deck and places it on the table face up,
                                        visible to all. This card is known as the 'joker': all cards
                                        of the same rank as this turned up card as well as the
                                        printed jokers are used as wild cards, and all these cards
                                        are referred to as 'jokers'. If the card turned up is a
                                        printed joker then will also count ACE as a joker.
                                    </li>
                                    <li>
                                        The player to the dealer's left then cuts the remaining
                                        cards and the dealer distributes them anti-clockwise one at
                                        a time, the player to the dealer's right getting the first
                                        card. 13 cards are dealt to each player. One card is dealt
                                        face up to begin the discard pile and the remaining stack is
                                        placed face down in the centre crosswise on top of the
                                        turned up joker, so that the rank of the joker remains
                                        visible.
                                    </li>
                                    <li>
                                        For the next hand the turn to deal passes to the right, and
                                        this continues until everyone has dealt once, completing a
                                        "round". After playing one or two rounds, the seating is
                                        changed again following the same start procedure. Normally a
                                        player should quit the play only at the end of a round.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div role="tabpanel" className={`fade tab-pane ${tabActive === 'Play' ? 'active show' : ""}`}
                         id="fantacy-rummy-tabs-tabpane-12"
                         aria-labelledby="fantacy-rummy-tabs-tab-12">
                        <div>

                            <div className="fantasy-rules">
                                <ul className="pl-4 pr-4 list-style">
                                    <li>
                                        The player to the dealer's right plays first, and play
                                        continues counter-clockwise. Each player's turn consists of
                                        picking up either the top card of the face up discard pile
                                        or the top card of the face down stack. Having taken this
                                        card into hand the player must discard one card from hand
                                        face up on top of the discard pile.
                                    </li>
                                    <li>
                                        If the player chooses to take the top card of the discard
                                        pile, that card cannot be discarded in the same turn - the
                                        player must discard a different card.
                                    </li>
                                    <li>
                                        It sometimes happens that the card turned up by the dealer
                                        to start the discard pile is a joker, which can then be
                                        picked up by the first player in the normal way. Since this
                                        clearly gives the first player an advantage, it may
                                        encourage several other players to drop (see below).
                                    </li>
                                    <li>
                                        The play continues until a player, after picking up a card,
                                        has 13 cards that form valid combinations (including at
                                        least one pure sequence and at least one other sequence as
                                        explained below). In this case the player discards the 14th
                                        card and declares 'Rummy', placing the 13 cards face up to
                                        show that they form the required sequences and sets, and
                                        winning the game.
                                    </li>
                                    <li>
                                        Note that no sequences or sets are laid out during the play.
                                        In this form of Rummy players keep all their cards concealed
                                        from the other players until a player is able to win.
                                    </li>
                                </ul>
                                <h6>Sequences and sets</h6>
                                <ul className="pl-4 pr-4 list-style">
                                    <li>
                                        The objective is to form one's 13 cards into sequences
                                        (runs) and sets (also known as trails or trios).
                                    </li>
                                    <li>
                                        A <b>sequence</b> consists of three or more consecutive
                                        cards of the same suit, the order being
                                        A-2-3-4-5-6-7-8-9-10-J-Q-K-A. The ace can be next to the two
                                        (in A-2-3) or next to the king (in Q-K-A), but not both at
                                        once, so K-A-2 is not a legal sequence.
                                    </li>
                                    <li>
                                        A set consists of three cards of the same rank in different
                                        suits: 5- 5- 5 is a valid set but 7- 7- 7 is not.
                                    </li>
                                    <li>
                                        A set consists of three cards of the same rank in different
                                        suits:
                                        <div className="cards-box">
                                            <span className="card-character black-card ml-1">5{"}"}</span>
                                            <span className="card-character red-card ml-1">5{"{"}</span>
                                            <span className="card-character red-card ml-1">5[</span>
                                        </div>
                                        is a valid set but
                                        <div className="cards-box">
                                            <span className="card-character black-card ml-1">7]</span>
                                            <span className="card-character black-card ml-1">7]</span>
                                            <span className="card-character red-card ml-1">7{"{"}</span>
                                        </div>
                                        is not.
                                    </li>
                                    <li>
                                        Combinations must not overlap - for example
                                        <div className="cards-box">
                                            <span className="card-character red-card ml-1">7[</span>
                                            <span className="card-character red-card ml-1">8[</span>
                                            <span className="card-character red-card ml-1">9[</span>
                                            <span className="card-character red-card ml-1">9{"{"}</span>
                                            <span className="card-character black-card ml-1">9{"}"}</span>
                                        </div>
                                        is either a sequence of diamonds with two spare 9's or a set
                                        of 9's with two spare diamonds. If a second
                                        <div className="cards-box">
                                            <span className="card-character red-card ml-1">9[</span>
                                        </div>
                                        or a
                                        <div className="cards-box">
                                            <span className="card-character black-card ml-1">9]</span>
                                        </div>
                                        or a
                                        <div className="cards-box">
                                            <span className="card-character red-card ml-1">6[</span>
                                        </div>
                                        is added, the six cards form a sequence and a set.
                                    </li>
                                    <li>
                                        Wild cards can be used to substitute for any desired card in
                                        a set or sequence. For example if the turned up card is a
                                        <div className="cards-box">
                                            <span className="card-character black-card ml-1">8]</span>
                                        </div>
                                        then
                                        <div className="cards-box">
                                            <span className="card-character red-card ml-1">3{"{"}</span>
                                            <span className="card-character black-card ml-1">8{"}"}</span>
                                            <span className="card-character red-card ml-1">5{"{"}</span>
                                        </div>
                                        5 is a valid sequence, and
                                        <div className="cards-box">
                                            <span className="card-character black-card ml-1">J{"}"}</span>
                                            <span className="card-character red-card ml-1">J[</span>
                                            <span className="card-character red-card ml-1">8[</span>
                                        </div>
                                        is a valid set since all 8's are wild.
                                    </li>
                                    <li>
                                        A <b>pure sequence</b> is a sequence formed without the use
                                        of wild cards as substitutes for other cards. At least one
                                        pure sequence is required in one's hand in order for any
                                        combinations to become valid. Note that if 8's are wild,
                                        <div className="cards-box">
                                            <span className="card-character red-card ml-1">7{"{"}</span>
                                            <span className="card-character red-card ml-1">8{"{"}</span>
                                            <span className="card-character red-card ml-1">9{"{"}</span>
                                        </div>
                                        counts as a pure sequence, since the
                                        <div className="cards-box">
                                            <span className="card-character red-card ml-1">8{"{"}</span>
                                        </div>
                                        is used as itself, not as a wild card, but
                                        <div className="cards-box">
                                            <span className="card-character red-card ml-1">J{"{"}</span>
                                            <span className="card-character red-card ml-1">Q{"{"}</span>
                                            <span className="card-character red-card ml-1">8{"{"}</span>
                                        </div>
                                        is not a pure sequence - just an ordinary sequence.
                                    </li>
                                </ul>
                                <h6>Dropping</h6>
                                <ul className="pl-4 pr-4 list-style">
                                    <li>
                                        A player whose hand is unpromising may prefer to withdraw
                                        from the game to limit the amount lost. This is called
                                        dropping or packing.
                                    </li>
                                    <li>
                                        A player who drops at the start of his first turn, before
                                        drawing any card from the stack or discard pile, pays 20
                                        points to the eventual winner.
                                    </li>
                                    <li>
                                        A player who drops at a later turn must pay 40 points to the
                                        eventual winner, if any. This player's cards are not added
                                        to the stack - they are set aside face down out of the game.
                                    </li>
                                    <li>
                                        If all players except one have dropped, the last remaining
                                        player automatically wins, and immediately collects the
                                        appropriate amounts from the players who dropped.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div role="tabpanel" className={`fade tab-pane ${tabActive === 'Scoring' ? 'active show' : ""}`}
                         id="fantacy-rummy-tabs-tabpane-13"
                         aria-labelledby="fantacy-rummy-tabs-tab-13">
                        <div>

                            <div className="fantasy-rules">
                                <ul className="pl-4 pr-4 list-style">
                                    <li>
                                        After the winner declares rummy, all other players who have
                                        not dropped count their hands for pay-off. The values of the
                                        cards are as follows:
                                        <div className="pl-2 pr-2">
                                            A, K, Q, J, 10 count 10 points each
                                        </div>
                                        <div className="pl-2 pr-2">
                                            9, 8, 7, 6, 5, 4, 3, 2 count face value
                                        </div>
                                        <div className="pl-2 pr-2">
                                            all jokers - both the printed jokers and the cards of
                                            the same rank as the turned up joker - have a value of
                                            zero
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

const LudoClub = () => {

    const [tabActive, setTabActive] = useState('Description')

    return (
        <div className="w-100 fantasy_game_details fantasy_ludoclub" id="fantasy_ludoclub">
            <h1 className="fantasy-detail-title"><span>Ludo Classic</span>
                <button className="btn btn-lg btn-primary">Play</button>
            </h1>
            <div>
                <div className="nav nav-pills" id="tab_fantasy_ludoclub" role="tablist">
                    <div className="nav-item">
                    <span role="tab" onClick={() => setTabActive('Description')}
                          className={`nav-link ${tabActive === 'Description' ? 'active' : ""}`}
                          id="fantacy-ludoclub-tabs-tab-11" data-toggle="pill"
                          aria-controls="tabpane-11" aria-selected="true">
                        Description
                    </span>
                    </div>
                    <div className="nav-item">
                    <span role="tab" onClick={() => setTabActive('Rules')}
                          className={`nav-link ${tabActive === 'Rules' ? 'active' : ""}`}
                          id="fantacy-ludoclub-tabs-tab-12" data-toggle="pill"
                          aria-controls="tabpane-12" aria-selected="false">
                        Rules
                    </span>
                    </div>
                </div>
                <div className="tab-content">
                    <div role="tabpanel" className={`fade tab-pane ${tabActive === 'Description' ? 'active show' : ""}`}
                         id="fantacy-ludoclub-tabs-tabpane-11"
                         aria-labelledby="fantacy-ludoclub-tabs-tab-11">
                        <div>


                            <div className="fantasy-rules">
                                <ol className="list-decimal">
                                    <li className="mb-1">
                                        <b>How To Play?</b>
                                        For those who haven’t played the game before, Ludo is an
                                        easy to play a strategy board game which is largely
                                        automatic, with a player’s only choice is to roll a dice and
                                        select a token to move forward. And once there is a token
                                        that you can move, the computer automatically does it for
                                        you. And while the centre piece of the digital version of
                                        the game is Ludo, the app also comes with a Snakes &amp;
                                        Ladders game that can be played the same you did as a kid.
                                    </li>
                                    <li className="mb-1">
                                        <b>Game Modes</b>
                                        You can play Ludo against your friends and play online
                                        against players from all around the world.
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div role="tabpanel" className={`fade tab-pane ${tabActive === 'Rules' ? 'active show' : ""}`}
                         id="fantacy-ludoclub-tabs-tabpane-12"
                         aria-labelledby="fantacy-ludoclub-tabs-tab-12">
                        <div>

                            <div className="fantasy-rules">
                                <ol className="list-decimal">
                                    <li>
                                        It is played between 2 or 4 Players, with every player
                                        having 4 tokens. The player who manages to get all of his
                                        four tokens home (reaches the centre of the board) first is
                                        declared the winner.
                                    </li>
                                    <li>
                                        A token can only move out from the base and start to move
                                        after a six is rolled by that player.
                                    </li>
                                    <li>
                                        Once a six is rolled out, that player gets one more turn to
                                        roll the dice.
                                    </li>
                                    <li>
                                        When player rolls six three times in a row, it skips their
                                        turn.
                                    </li>
                                    <li>
                                        If a token crosses the finish line, the player gets to roll
                                        another dice.
                                    </li>
                                    <li>
                                        If a token captures another token, the capturing player gets
                                        to roll another dice.
                                    </li>
                                    <li>
                                        The board has a total of eight safe squares which are
                                        coloured squares and starred squares.
                                    </li>
                                    <li>
                                        The tokens need to exit every player’s base and move around
                                        the board to win.
                                    </li>
                                    <li>
                                        Each user have 5 automoves. In case of player inactivity
                                        automove being used.
                                    </li>
                                    <li>Player lose game if all automoves being used.</li>
                                    <li>We deduct 5% on winning.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const LudoLands = () => {

    const [tabActive, setTabActive] = useState('Description')

    return (
        <div className="w-100 fantasy_game_details fantasy_ludoclub" id="fantasy_ludoclub">
            <h1 className="fantasy-detail-title"><span>Ludo Lands</span>
                <button className="btn btn-lg btn-primary">Play</button>
            </h1>
            <div>
                <div className="nav nav-pills" id="tab_fantasy_ludoclub" role="tablist">
                    <div className="nav-item">
                    <span role="tab" onClick={() => setTabActive('Description')}
                          className={`nav-link ${tabActive === 'Description' ? 'active' : ""}`}
                          id="fantacy-ludoclub-tabs-tab-11" data-toggle="pill"
                          aria-controls="tabpane-11" aria-selected="true">
                        Description
                    </span>
                    </div>
                    <div className="nav-item">
                    <span role="tab" onClick={() => setTabActive('Rules')}
                          className={`nav-link ${tabActive === 'Rules' ? 'active' : ""}`}
                          id="fantacy-ludoclub-tabs-tab-12" data-toggle="pill"
                          aria-controls="tabpane-12" aria-selected="false">
                        Rules
                    </span>
                    </div>
                </div>
                <div className="tab-content">
                    <div role="tabpanel" className={`fade tab-pane ${tabActive === 'Description' ? 'active show' : ""}`}
                         id="fantacy-ludoclub-tabs-tabpane-11"
                         aria-labelledby="fantacy-ludoclub-tabs-tab-11">
                        <div>


                            <div className="fantasy-rules">
                                <ol className="list-decimal">
                                    <li className="mb-1">
                                        <b>How To Play?</b>
                                        For those who haven’t played the game before, Ludo is an
                                        easy to play a strategy board game which is largely
                                        automatic, with a player’s only choice is to roll a dice and
                                        select a token to move forward. And once there is a token
                                        that you can move, the computer automatically does it for
                                        you. And while the centre piece of the digital version of
                                        the game is Ludo, the app also comes with a Snakes &amp;
                                        Ladders game that can be played the same you did as a kid.
                                    </li>
                                    <li className="mb-1">
                                        <b>Game Modes</b>
                                        You can play Ludo against your friends and play online
                                        against players from all around the world.
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div role="tabpanel" className={`fade tab-pane ${tabActive === 'Rules' ? 'active show' : ""}`}
                         id="fantacy-ludoclub-tabs-tabpane-12"
                         aria-labelledby="fantacy-ludoclub-tabs-tab-12">
                        <div>

                            <div className="fantasy-rules">
                                <ol className="list-decimal">
                                    <li>
                                        It is played between 2 or 4 Players, with every player
                                        having 4 tokens. The player who manages to get all of his
                                        four tokens home (reaches the centre of the board) first is
                                        declared the winner.
                                    </li>
                                    <li>
                                        A token can only move out from the base and start to move
                                        after a six is rolled by that player.
                                    </li>
                                    <li>
                                        Once a six is rolled out, that player gets one more turn to
                                        roll the dice.
                                    </li>
                                    <li>
                                        When player rolls six three times in a row, it skips their
                                        turn.
                                    </li>
                                    <li>
                                        If a token crosses the finish line, the player gets to roll
                                        another dice.
                                    </li>
                                    <li>
                                        If a token captures another token, the capturing player gets
                                        to roll another dice.
                                    </li>
                                    <li>
                                        The board has a total of eight safe squares which are
                                        coloured squares and starred squares.
                                    </li>
                                    <li>
                                        The tokens need to exit every player’s base and move around
                                        the board to win.
                                    </li>
                                    <li>
                                        Each user have 5 automoves. In case of player inactivity
                                        automove being used.
                                    </li>
                                    <li>Player lose game if all automoves being used.</li>
                                    <li>We deduct 5% on winning.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const FantasyPopTheBall = () => {
    const [activeTab, setActiveTab] = useState('description');

    return (
        <div className="w-100 fantasy_game_details fantasy_poptheball" id="fantasy_poptheball">
            <h1 className="fantasy-detail-title">
                <span>Pop The Ball</span>
                <button className="btn btn-lg btn-primary">Play</button>
            </h1>
            <div>
                <div className="nav nav-pills" role="tablist">
                    <div className="nav-item">
                        <button
                            role="tab"
                            className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                            aria-controls="tabpane-11"
                            aria-selected={activeTab === 'description'}
                        >
                            Description
                        </button>
                    </div>
                    <div className="nav-item">
                        <button
                            role="tab"
                            className={`nav-link ${activeTab === 'howToPlay' ? 'active' : ''}`}
                            onClick={() => setActiveTab('howToPlay')}
                            aria-controls="tabpane-12"
                            aria-selected={activeTab === 'howToPlay'}
                        >
                            How to Play
                        </button>
                    </div>
                </div>
                <div className="tab-content">
                    {activeTab === 'description' && (
                        <div role="tabpanel" className="tab-pane show active">
                            <div className="fantasy-rules">
                                <ol className="list-outside">
                                    <li>Before the round starts the player needs to place his/her bet.</li>
                                    <li>The player can use "auto bet" and "auto cash out" features.</li>
                                    <li>Minimum bet amount is 500.</li>
                                    <li>Maximum bet amount is 5,000.</li>
                                    <li>Maximum win amount is 250,000.</li>
                                    <li>The player can place 2 bets simultaneously during a single round.</li>
                                    <li>The winning amount is calculated by multiplying the coefficient by the bet's
                                        amount.
                                    </li>
                                </ol>
                            </div>
                        </div>
                    )}
                    {activeTab === 'howToPlay' && (
                        <div role="tabpanel" className="tab-pane show active">
                            <div className="fantasy-rules">
                                <ol className="list-outside">
                                    <li><b>Quick explanation:</b></li>
                                    <ol className="list-outside">
                                        <li>The player needs to place a bet and then wait till the cannon strikes.</li>
                                        <li>The player needs to click on "cash out" button before the coefficient
                                            explodes.
                                        </li>
                                        <li>The player wins if he or she cashes out before the coefficient explodes.
                                        </li>
                                        <li>The player loses if he or she hasn't cashed out before the coefficient
                                            explodes.
                                        </li>
                                    </ol>
                                </ol>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const JetX = () => {
    const [activeTab, setActiveTab] = useState('rules');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="w-100 fantasy_game_details fantasy_jetx" id="fantasy_jetx">
            <h1 className="fantasy-detail-title">
                <span>JetX</span>
                <button className="btn btn-lg btn-primary">Play</button>
            </h1>
            <div>
                <div className="nav nav-pills" id="tab_fantasy_jetx" role="tablist">
                    <div className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'rules' ? 'active' : ''}`}
                            onClick={() => handleTabClick('rules')}
                        >
                            Rules
                        </button>
                    </div>
                    <div className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'howToPlay' ? 'active' : ''}`}
                            onClick={() => handleTabClick('howToPlay')}
                        >
                            How to Play
                        </button>
                    </div>
                </div>

                <div className="tab-content">
                    {activeTab === 'rules' && (
                        <div className="fade tab-pane show active fantasy-rules" role="tabpanel">
                            <section className="mb-2">
                                <h4>WHAT IS JETX?</h4>
                                <p>JETX IS A GAME FROM SMARTSOFT WHERE YOU CAN QUICKLY AND EASILY WIN MONEY.</p>
                            </section>
                            <section className="mb-2">
                                <h4>HOW TO PLAY JETX?</h4>
                                <p>
                                    PLACE A BET BEFORE THE JET TAKES OFF. YOU CAN PLACE A SINGLE BET OR TWO BETS ON
                                    THE SAME JETX FLIGHT. THE MINIMUM STAKE IS 1 , AND THE MAXIMUM IS 10000 .
                                    ...
                                </p>
                                {/* Add other content here */}
                            </section>
                            {/* More sections as needed */}
                        </div>
                    )}

                    {activeTab === 'howToPlay' && (
                        <div className="fade tab-pane fantasy-rules" role="tabpanel">
                            <section className="mb-2">
                                <h4>Make your bet before take off</h4>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b4/Themes/Default/JetX/Images/help1.png"
                                    alt="Make your bet before take off"
                                />
                            </section>
                            <section className="mb-2">
                                <h4>Take a risk and wait for odds to go high</h4>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b28/JetX/Content/Images/help2.png"
                                    alt="Take a risk"
                                />
                            </section>
                            <section className="mb-3">
                                <h4>Cash out before it explodes</h4>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b4/Themes/Default/JetX/Images/help3.png"
                                    alt="Cash out"
                                />
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Cappadocia = () => {
    return (
        <div className="w-100 fantasy_game_details fantasy_cappadocia" id="fantasy_cappadocia">
            <h1 className="fantasy-detail-title">
                <span>Cappadocia</span>
                <button className="btn btn-lg btn-primary">Play</button>
            </h1>
            <div>
                <div className="nav nav-pills" role="tablist">
                    <div className="nav-item">
                        <a
                            role="tab"
                            data-rr-ui-event-key="0"
                            id="fantacy-rules-tabs-tab-0"
                            aria-controls="fantacy-rules-tabs-tabpane-0"
                            className="nav-link active"
                            aria-selected="true"
                        >
                            Rules
                        </a>
                    </div>
                </div>
                <div className="tab-content">
                    <div
                        role="tabpanel"
                        id="fantacy-rules-tabs-tabpane-0"
                        aria-labelledby="fantacy-rules-tabs-tab-0"
                        className="fade tab-pane active show"
                    >
                        <div className="fantasy-rules">
                            <div className="mb-2">
                                <p>
                                    There are several types of balloons, which differ from each
                                    other in visual effects and animation of the marking of
                                    profit. The type of balloon is determined by the bet.
                                </p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b25/Games/Content/Help/Images/Cappadocia/page-1.png"
                                    alt="Balloon Types"
                                />
                            </div>
                            <div className="mb-2">
                                <p>
                                    We have GO buttons for the game, with which you can launch
                                    balloons of the desired type. After launching the ball, the
                                    GO button turns into the Cash Out button, and the game bet
                                    is the current win. The player can cash out the desired
                                    winnings using the Cash Out button. After victory or defeat,
                                    the button with which the move was made returns to its
                                    original position, and the player is given the opportunity
                                    to choose the balloon he needs.
                                </p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b25/Games/Content/Help/Images/Cappadocia/page-2.png"
                                    alt="GO Button"
                                />
                            </div>
                            <div className="mb-2">
                                <p>
                                    When lost, the ball lights up, begins to fall rapidly and
                                    disappears in a short period of time. RTP - 97.0%.
                                </p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b25/Games/Content/Help/Images/Cappadocia/page-3.png"
                                    alt="Lost Ball Animation"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const Spinx = () => {
    const [activeTab, setActiveTab] = useState('rules');

    return (
        <div className="w-100 fantasy_game_details fantasy_spinx" id="fantasy_spinx">
            <h1 className="fantasy-detail-title">
                <span>SpinX</span>
                <button className="btn btn-lg btn-primary">Play</button>
            </h1>
            <div>
                <div className="nav nav-pills" id="tab_fantasy_spinx" role="tablist">
                    <div className="nav-item">
                        <button
                            role="tab"
                            className={`nav-link ${activeTab === 'rules' ? 'active' : ''}`}
                            onClick={() => setActiveTab('rules')}
                            aria-controls="tabpane-11"
                            aria-selected={activeTab === 'rules'}
                        >
                            Rules
                        </button>
                    </div>
                    <div className="nav-item">
                        <button
                            role="tab"
                            className={`nav-link ${activeTab === 'howToPlay' ? 'active' : ''}`}
                            onClick={() => setActiveTab('howToPlay')}
                            aria-controls="tabpane-12"
                            aria-selected={activeTab === 'howToPlay'}
                        >
                            How to Play
                        </button>
                    </div>
                </div>
                <div className="tab-content">
                    {activeTab === 'rules' && (
                        <div role="tabpanel" className={`fade tab-pane ${activeTab === 'rules' ? 'show active' : ''}`} id="fantacy-spinx-tabs-tabpane-11">
                            <div className="fantasy-rules">
                                <div className="mb-2">
                                    <h4>The payout is equal to the bet multiplied by the odds.</h4>
                                    <div className="first-slide">
                                        <div className="info-game">
                                            {[['500X', '100X', '10X'], ['150X', '20X', '5X'], ['20X', '10X', '2X'], ['10X', '3X', '1X'], ['5X', '2X', '0.5X'], ['3X', '1X', '0.3X']].map((odds, index) => (
                                                <div className="info-row" key={index}>
                                                    <div className="info-number">
                                                        <div className="info-number-left">
                                                            <p>12+</p>
                                                            <p>10-11</p>
                                                            <p>8-9</p>
                                                        </div>
                                                        <div className="info-number-right">
                                                            {odds.map((odd, i) => (
                                                                <p key={i}>{odd}</p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <img
                                        src="https://eu-static.ssgcontent.com/cache/b12/GameLauncher/Content/Help/Images/SpinX/help-second-pg-object-mob.png"
                                        alt="How to win"/>
                                    <h4>How is the winning set?</h4>
                                    <p>In order to claim a win, the number of identical symbols which we have bet on
                                        must drop down first. The sequence of symbols does not matter. RTP - 97.7%.</p>
                                </div>
                                <div className="mb-2">
                                    <img
                                        src="https://eu-static.ssgcontent.com/cache/b12/GameLauncher/Content/Help/Images/SpinX/help-third-pg-objects-mob.png"
                                        alt="Multiplayer"/>
                                    <h4>Multiplayer</h4>
                                    <p>The game has a multiplayer system, which means that every successive win is
                                        multiplied by the corresponding multiplayer coefficient.</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'howToPlay' && (
                        <div role="tabpanel" className={`fade tab-pane ${activeTab === 'howToPlay' ? 'show active' : ''}`} id="fantacy-spinx-tabs-tabpane-12">
                            <div className="fantasy-rules">
                                {[
                                    {
                                        title: 'Choose any symbol',
                                        img: 'https://eu-static.ssgcontent.com/cache/b14/XGames/Content/Help/Images/SpinX/info-on-start-1.png'
                                    },
                                    {
                                        title: 'You can place two bets',
                                        img: 'https://eu-static.ssgcontent.com/cache/b14/XGames/Content/Help/Images/SpinX/info-on-start-2.png'
                                    },
                                    {
                                        title: 'Place a bet and wait for a spin',
                                        img: 'https://eu-static.ssgcontent.com/cache/b14/XGames/Content/Help/Images/SpinX/info-on-start-3.png'
                                    },
                                    {
                                        title: 'Multiplier increases up to 10x',
                                        img: 'https://eu-static.ssgcontent.com/cache/b14/XGames/Content/Help/Images/SpinX/info-on-start-4.png'
                                    },
                                ].map((item, index) => (
                                    <div className="mb-2" key={index}>
                                        <h4>{item.title}</h4>
                                        <img src={item.img} alt={item.title}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Jetx3 = () => {
    const [activeTab, setActiveTab] = useState("rules");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="w-100 fantasy_game_details fantasy_jetx3" id="fantasy_jetx3">
            <h1 className="fantasy-detail-title">
                <span>JetX3</span>
                <button className="btn btn-lg btn-primary">Play</button>
            </h1>
            <div>
                <div className="nav nav-pills" id="tab_fantasy_jetx3" role="tablist">
                    <div className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "rules" ? "active" : ""}`}
                            onClick={() => handleTabChange("rules")}
                            role="tab"
                            aria-selected={activeTab === "rules"}
                        >
                            Rules
                        </button>
                    </div>
                    <div className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "howToPlay" ? "active" : ""}`}
                            onClick={() => handleTabChange("howToPlay")}
                            role="tab"
                            aria-selected={activeTab === "howToPlay"}
                        >
                            How to Play
                        </button>
                    </div>
                </div>
                <div className="tab-content">
                    {activeTab === "rules" && (
                        <div className="fade tab-pane show active fantasy-rules" role="tabpanel">
                            <div className="mb-2">
                                <h4>WHAT IS JETX3</h4>
                                <p>JETX3 IS A SMARTSOFT GAME WHERE YOU CAN EASILY WIN MONEY.</p>
                            </div>
                            <div className="mb-2">
                                <h4>HOW TO PLAY JETX3?</h4>
                                <p>PLACE YOUR BET UNTIL THE ROUND STARTS... [Rest of Rules Content]</p>
                            </div>
                        </div>
                    )}
                    {activeTab === "howToPlay" && (
                        <div className="fade tab-pane fantasy-rules" role="tabpanel">
                            <div className="mb-2">
                                <h4>PLACE YOUR BET</h4>
                                <p>MAKE YOUR BET BEFORE TAKE OFF</p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b14/XGames/Content/Images/JetX3/Help/info-on-start-1.png"
                                    alt="Place Your Bet"/>
                            </div>
                            <div className="mb-2">
                                <h4>ODDS</h4>
                                <p>TAKE A RISK AND WAIT FOR ODDS TO GO HIGH</p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b14/XGames/Content/Images/JetX3/Help/info-on-start-3.png"
                                    alt="Odds Info"/>
                            </div>
                            <div className="mb-2">
                                <h4>COLLECT</h4>
                                <p>CASH OUT BEFORE IT EXPLODES</p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b14/XGames/Content/Images/JetX3/Help/info-on-start-2.png"
                                    alt="Collect Info"/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CricketX = () => {
    return (
        <div className="w-100 fantasy_game_details fantasy_cricketx" id="fantasy_cricketx">
            <h1 className="fantasy-detail-title">
                <span>CricketX</span>
                <button className="btn btn-lg btn-primary">Play</button>
            </h1>
            <div>
                <div className="nav nav-pills" role="tablist">
                    <div className="nav-item">
                        <a
                            role="tab"
                            data-rr-ui-event-key="0"
                            id="fantacy-rules-tabs-tab-0"
                            aria-controls="fantacy-rules-tabs-tabpane-0"
                            className="nav-link active"
                            aria-selected="true"
                        >
                            Rules
                        </a>
                    </div>
                </div>
                <div className="tab-content">
                    <div
                        role="tabpanel"
                        id="fantacy-rules-tabs-tabpane-0"
                        aria-labelledby="fantacy-rules-tabs-tab-0"
                        className="fade tab-pane active show"
                    >
                        <div>
                            <div className="fantasy-rules">
                                <div className="mb-2">
                                    <h4>WHAT IS CRICKETX?</h4>
                                    <p>
                                        CRICKETX is a new game from smartsoft. In which you can quickly and easily win
                                        money.
                                    </p>
                                </div>
                                <div className="mb-2">
                                    <h4>HOW TO PLAY CRICKETX?</h4>
                                    <p>
                                        Enter the desired amount in the betting line. You have an option to place one or
                                        two bets on the same flight. The minimum stake is 1, and the maximum is 10000.
                                    </p>
                                    <p>
                                        Click the button—place your bet, observe what height the ball will take. The
                                        development of ball height is not determined and varies from 1 to infinity.
                                    </p>
                                    <p>
                                        Use the collect button before the explosion, or use the auto collect out
                                        function beforehand (on what height you want to exit the game).
                                    </p>
                                    <p>
                                        Each bet can be set manually or use auto for a pre-set bet and collect
                                        multiplier. "Auto Bet" and "Auto Collect" functions activate after marking when
                                        a new round starts. The minimum odd for auto collect is 1.35.
                                    </p>
                                    <p>
                                        In the left corner of the game panel, coefficients statistics history are
                                        presented. Odds are reflected in the statistics after the explosion of the
                                        upcoming round. Values are displayed in green and blue color: blue indicates the
                                        coefficients that are not more than 1.5 and green-more than 1.5.
                                    </p>
                                </div>
                                <div className="mb-2">
                                    <h4>HOW IS THE WIN CALCULATED?</h4>
                                    <p>
                                        The profit is calculated by multiplying the current height coefficient and the
                                        made bet.
                                    </p>
                                    <p>
                                        Minimum multiplier (coefficient) is 1.00x. Max win 100000.00.
                                    </p>
                                </div>
                                <div className="mb-2">
                                    <h4>HOW DO I GET THE WINNINGS?</h4>
                                    <p>
                                        You have won the amount if you had used the collect button before the explosion
                                        (the profit is instantly reflected on the balance). If the explosion happens,
                                        the stake is considered lost.
                                    </p>
                                    <p>RTP for the game is 96.7-98.8%.</p>
                                    <p>
                                        The maximum RTP can be achieved by the player when opting to bet on the lowest
                                        possible crash multiplier (coefficient). Also, when the maximum coefficient of
                                        25000x is reached, the win amount is auto collected.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const VIPKeno = () => {
    return (
        <div className="w-100 fantasy_game_details fantasy_vipkeno" id="fantasy_vipkeno">
            <h1 className="fantasy-detail-title">
                <span>vipkeno</span>
                <button className="btn btn-lg btn-primary">Play</button>
            </h1>
            <div>
                <div className="nav nav-pills" role="tablist">
                    <div className="nav-item">
                        <a
                            role="tab"
                            data-rr-ui-event-key="0"
                            id="fantacy-rules-tabs-tab-0"
                            aria-controls="fantacy-rules-tabs-tabpane-0"
                            className="nav-link active"
                            aria-selected="true"
                        >
                            Rules
                        </a>
                    </div>
                </div>
                <div className="tab-content">
                    <div
                        role="tabpanel"
                        id="fantacy-rules-tabs-tabpane-0"
                        aria-labelledby="fantacy-rules-tabs-tab-0"
                        className="fade tab-pane active show"
                    >
                        <div className="fantasy-rules">
                            <div className="mb-2">
                                <h4>Game Rules</h4>
                                <p>
                                    80 balls numbered from 1 to 80 are in the VIP Keno draw. The
                                    system automatically starts a new draw every 60 seconds. 20
                                    balls show up in each draw. Bets are accepted on guessing the
                                    numbers of the showed-up balls and also bets are made on
                                    guessing the number on the last ball from the balls by the
                                    player.
                                </p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b12/GameLauncher/Content/Help/Images/vip_keno_images/desktop1.png"
                                    alt="Game Rules"/>
                            </div>
                            <div className="mb-2">
                                <h4>Ball selection</h4>
                                <p>
                                    The player selects a minimum of 1 and a maximum of 10 digits.
                                </p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b12/GameLauncher/Content/Help/Images/vip_keno_images/desktop2.png"
                                    alt="Ball Selection"/>
                            </div>
                            <div className="mb-2">
                                <h4>Bet and winning</h4>
                                <p>
                                    The minimum bet is 10.00. The maximum bet is 50000.00. The maximum profit is
                                    1000000.00.
                                </p>
                            </div>
                            <div className="mb-2">
                                <h4>Winning amount</h4>
                                <p>
                                    The winning amount is determined by multiplying the bet by
                                    the odds, which in turn depends on the coincidence of the
                                    chosen and numbers shown up in the draw. The table of
                                    coefficients is given on the screen.
                                </p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b12/GameLauncher/Content/Help/Images/vip_keno_images/desktop4.png"
                                    alt="Winning Amount"/>
                            </div>
                            <div className="mb-2">
                                <h4>Technical deficiencies</h4>
                                <p>
                                    In case of technical delay or incorrect or unrealistic
                                    display of the coefficient on the server, the bet is
                                    canceled and the amount is returned to the player. If the
                                    equipment transmitting the game is disconnected or the
                                    internet connection is interrupted, the results will be
                                    published after the bug is fixed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClassicKeno = () => {
    return (
        <div className="w-100 fantasy_game_details fantasy_classickeno" id="fantasy_classickeno">
            <h1 className="fantasy-detail-title">
                <span>ClassicKeno</span>
                <button className="btn btn-lg btn-primary">Play</button>
            </h1>
            <div>
                <div className="nav nav-pills" role="tablist">
                    <div className="nav-item">
                        <a
                            role="tab"
                            data-rr-ui-event-key="0"
                            id="fantacy-rules-tabs-tab-0"
                            aria-controls="fantacy-rules-tabs-tabpane-0"
                            className="nav-link active"
                            aria-selected="true"
                        >
                            Rules
                        </a>
                    </div>
                </div>
                <div className="tab-content">
                    <div
                        role="tabpanel"
                        id="fantacy-rules-tabs-tabpane-0"
                        aria-labelledby="fantacy-rules-tabs-tab-0"
                        className="fade tab-pane active show"
                    >
                        <div className="fantasy-rules">
                            <div className="mb-2">
                                <h4>Game Rules</h4>
                                <p>
                                    80 balls, numbered from 1 to 80 are presented in the classic
                                    Keno draw. The system automatically starts a new draw every
                                    60 seconds. 20 balls show up in each draw. Bets are accepted
                                    on guessing the numbers of the showed-up balls and also bets
                                    are made on guessing the number on the last ball from the
                                    balls by the player.
                                </p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b12/GameLauncher/Content/Help/Images/classic_keno_images/desktop1.png"
                                    alt="Game Rules"
                                />
                            </div>
                            <div className="mb-2">
                                <h4>Ball selection</h4>
                                <p>
                                    The player selects a minimum of 1 and a maximum of 10 digits.
                                </p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b12/GameLauncher/Content/Help/Images/classic_keno_images/desktop2.png"
                                    alt="Ball Selection"
                                />
                            </div>
                            <div className="mb-2">
                                <h4>Bet and winning</h4>
                                <p>
                                    The minimum bet is 10.00. The maximum bet is 50000.00. The maximum profit is
                                    1000000.00.
                                </p>
                            </div>
                            <div className="mb-2">
                                <h4>Win amount</h4>
                                <p>
                                    The winning amount is determined by multiplying the bet by
                                    the odds, which in turn depends on the coincidence of the
                                    chosen and numbers shown up in the draw. The table of
                                    coefficients is given on the screen.
                                </p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b12/GameLauncher/Content/Help/Images/classic_keno_images/desktop4.png"
                                    alt="Win Amount"
                                />
                            </div>
                            <div className="mb-2">
                                <h4>Technical deficiencies</h4>
                                <p>
                                    In case of technical delay or incorrect or unrealistic
                                    display of the coefficient on the server, the bet is
                                    canceled and the amount is returned to the player. If the
                                    equipment transmitting the game is disconnected or the
                                    internet connection is interrupted, the results will be
                                    published after the bug is fixed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RussianKeno = () => {
    return (
        <div className="w-100 fantasy_game_details fantasy_russiankeno" id="fantasy_russiankeno">
            <h1 className="fantasy-detail-title">
                <span>RussianKeno</span>
                <button className="btn btn-lg btn-primary">Play</button>
            </h1>
            <div>
                <div className="nav nav-pills" role="tablist">
                    <div className="nav-item">
                        <a
                            role="tab"
                            data-rr-ui-event-key="0"
                            id="fantacy-rules-tabs-tab-0"
                            aria-controls="fantacy-rules-tabs-tabpane-0"
                            className="nav-link active"
                            aria-selected="true"
                        >
                            Rules
                        </a>
                    </div>
                </div>
                <div className="tab-content">
                    <div
                        role="tabpanel"
                        id="fantacy-rules-tabs-tabpane-0"
                        aria-labelledby="fantacy-rules-tabs-tab-0"
                        className="fade tab-pane active show"
                    >
                        <div className="fantasy-rules">
                            <div className="mb-2">
                                <h4>Game Rules</h4>
                                <p>
                                    80 balls numbered from 1 to 80 are in the Russian Keno draw.
                                    The system automatically starts a new draw every 60 seconds.
                                    20 balls show up in each draw. Bets are accepted on guessing
                                    the numbers of the raised balls and also bets are made on
                                    guessing the number on the last ball from the balls by the
                                    player.
                                </p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b12/GameLauncher/Content/Help/Images/russian_keno_images/desktop1.png"
                                    alt="Game Rules"
                                />
                            </div>
                            <div className="mb-2">
                                <h4>Ball selection</h4>
                                <p>
                                    The player selects a minimum of 1 and a maximum of 10 digits.
                                </p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b12/GameLauncher/Content/Help/Images/russian_keno_images/desktop2.png"
                                    alt="Ball Selection"
                                />
                            </div>
                            <div className="mb-2">
                                <h4>Bet and winning</h4>
                                <p>
                                    The minimum bet is 10.00. The maximum bet is 50000.00. The maximum profit is
                                    1000000.00.
                                </p>
                            </div>
                            <div className="mb-2">
                                <h4>Winning amount</h4>
                                <p>
                                    The winning amount is determined by multiplying the bet by the odds, which in turn
                                    depends on the coincidence of the chosen and numbers shown up in the draw.
                                </p>
                                <img
                                    src="https://eu-static.ssgcontent.com/cache/b12/GameLauncher/Content/Help/Images/russian_keno_images/desktop4.png"
                                    alt="Winning Amount"
                                />
                            </div>
                            <div className="mb-2">
                                <h4>Technical deficiencies</h4>
                                <p>
                                    In case of technical delay or incorrect or unrealistic
                                    display of the coefficient on the server, the bet is
                                    canceled and the amount is returned to the player. If the
                                    equipment transmitting the game is disconnected or the
                                    internet connection is interrupted, the results will be
                                    published after the bug is fixed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FantasyGames;