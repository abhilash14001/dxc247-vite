import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const FaviconUpdater = () => {
  const { liveModeData } = useSelector(state => state.commonData);

  useEffect(() => {
    if (liveModeData?.favi_icon) {
      // Update favicon
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.href = liveModeData.favi_icon;
      }

      // Update apple-touch-icon
      const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (appleTouchIcon) {
        appleTouchIcon.href = liveModeData.favi_icon;
      }

      // Update page title if site_name is available
      if (liveModeData.site_name) {
        document.title = liveModeData.site_name;
      }
    }
  }, [liveModeData]);

  return null; // This component doesn't render anything
};

export default FaviconUpdater;
