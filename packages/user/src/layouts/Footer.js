const Footer = () => {
    return (
        <>
            <section className="footer">
                <div className="footer-top">
                    <div className="footer-links"></div>
                    <div className="support-detail">
                        <h2>24X7 Support</h2>
                        <p></p>
                    </div>
                    <div className="social-icons-box"></div>
                </div>
            </section>
            <div className="footer-bottom">
                <div className="secure-logo">
                    <div><img src="https://wver.sprintstaticdata.com/v3/static/front/img/ssl.png" alt="SSL Secure" /></div>
                    <div className="ml-2">
                        <b>100% SAFE</b>
                        <div>Protected connection and encrypted data.</div>
                    </div>
                </div>
                <div className="d-inline-block">
                    <span><img src="https://g1ver.sprintstaticdata.com/v29/static/front/img/18plus.png" alt="18+" /></span>
                    <a href="https://www.gamcare.org.uk/" target="_blank" rel="noopener noreferrer"><img src="https://g1ver.sprintstaticdata.com/v29/static/front/img/gamecare.png" alt="GamCare" /></a>
                    <a href="https://www.gamblingtherapy.org/" target="_blank" rel="noopener noreferrer"><img src="https://g1ver.sprintstaticdata.com/v29/static/front/img/gt.png" alt="Gambling Therapy" /></a>
                </div>
            </div>
            <div className="footer-text">
                <p className="text-center">© Copyright {new Date().getFullYear()}. All Rights Reserved. Powered by {import.meta.env.VITE_NAME}.</p>
            </div>
        </>
    );
};

export default Footer;
