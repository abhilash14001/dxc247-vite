import { Modal } from "react-bootstrap";
import React from "react";
import DOMPurify from "dompurify";

const CasinoRules = ({ showRules, handleCloseRules, image, description }) => {
  return (
    <Modal
      show={showRules}
      onHide={handleCloseRules}
      dialogClassName="modal-dialog modal-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Rules</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-12">
            <div>
              {image === null && description === null ? (
                <div className="rules-section">
                  <ul className="pl-4 pr-4 list-style">
                    <li>
                      Instant Teenpatti-2.0 is a shorter version of the Indian
                      origin game teenpatti.
                    </li>
                    <li>
                      This game is played with a regular 52 cards deck between
                      Player A and Player B.
                    </li>
                    <li>
                      In Instant Teenpatti-2.0, all the three cards of Player A
                      and the first two cards of Player B will be pre-defined
                      for all the games. These five cards will be permanently
                      placed on the table.
                    </li>
                  </ul>
                </div>
              ) : image !== null && description !== null ? (
                <div className="rules-section">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(description),
                    }}
                  />
                  <img src={image} className="img-fluid" />
                </div>
              ) : description === null ? (
                <div className="rules-section">
                  <img src={image} className="img-fluid" />
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(description),
                  }}
                ></div>
              )}
            </div>
            {image === null && description === null && (
              <>
                <div>
                  <div className="rules-section">
                    <h6 className="rules-highlight">
                      3 Pre-defined cards of Player A:
                    </h6>
                    <ul className="pl-4 pr-4 list-style">
                      <li>2 of Hearts</li>
                      <li>2 of Spades</li>
                      <li>3 of Clubs</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="rules-section">
                    <h6 className="rules-highlight">
                      2 Pre-defined cards of Player B:
                    </h6>
                    <ul className="pl-4 pr-4 list-style">
                      <li>8 of Hearts</li>
                      <li>9 of Hearts</li>
                      <li>
                        So now the game will begin with the remaining 47 cards
                      </li>
                      <li>(52-5 pre-defined cards = 47)</li>
                      <li>
                        Instant Teenpatti-2.0 is a one card game. One card will
                        be dealt to Player B that will be the third and the last
                        card of Player B which will decide the result of the
                        game. Hence that particular game will be over.
                      </li>
                      <li>
                        Now always the last drawn card of Player B will be
                        removed and kept aside. Thereafter a new game will
                        commence from the remaining 46 cards, then the same
                        process will continue till both players have winning
                        chances or otherwise up to 35 cards or so.
                      </li>
                      <li>
                        The objective of the game is to make the best three card
                        hands as per the hand rankings and therefore win.
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="rules-section">
                    <h6 className="rules-highlight">
                      Rankings of card hands from Highest to Lowest:
                    </h6>
                    <ul className="pl-4 pr-4 list-style">
                      <li>1. Straight Flush (Pure Sequence)</li>
                      <li>2. Trail (Three of a Kind)</li>
                      <li>3. Straight (Sequence)</li>
                      <li>4. Flush (Color)</li>
                      <li>5. Pair (Two of a Kind)</li>
                      <li>6. High Card</li>
                    </ul>
                    <div>You have betting options of Back and Lay.</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default CasinoRules;
