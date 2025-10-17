import { useEffect, useRef } from 'react';

const CricketLayout = ({ children }) => {
  const linkRef = useRef(null);

  useEffect(() => {
    // Create a link element for the CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/style.css';
    link.id = 'cricket-layout-css';
    
    // Add the CSS link to the document head
    document.head.appendChild(link);
    linkRef.current = link;

    // Cleanup function to remove the CSS when component unmounts
    return () => {
      if (linkRef.current) {
        document.head.removeChild(linkRef.current);
        linkRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      {children}
    </div>
  );
};
export default CricketLayout;