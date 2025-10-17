import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const AfterLoginPopup = ({ onClose, show }) => {
    const { bannerDetails } = useSelector(state => state.user);
    const [isMobile, setIsMobile] = useState(false);

    // Detect if device is mobile
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Check on mount
        checkIsMobile();

        // Add resize listener
        window.addEventListener('resize', checkIsMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Determine which banner to show
    const getBannerImage = () => {
        if (isMobile && bannerDetails?.FRONT_WELCOME_MOBILE_BANNER) {
            return bannerDetails.FRONT_WELCOME_MOBILE_BANNER;
        }
        return bannerDetails?.FRONT_WELCOME_BANNER;
    };

    const bannerImage = getBannerImage();

    return (
        bannerImage && (
            <Modal show={show} onHide={onClose} size="lg" aria-labelledby="after-login-popup" centered>
                <Modal.Header closeButton>
                    {bannerDetails?.FRONT_WELCOME_TEXT_BANNER &&
                        <Modal.Title dangerouslySetInnerHTML={{ __html: bannerDetails.FRONT_WELCOME_TEXT_BANNER }}></Modal.Title>
                    }
                </Modal.Header>
                <Modal.Body style={{padding : "0px"}}>
                       <img src={bannerImage} className="img-fluid" alt="Welcome Banner"/>
                    
                </Modal.Body>

            </Modal>
        )
    );
};
export default AfterLoginPopup;
