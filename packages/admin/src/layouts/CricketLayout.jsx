import { useEffect } from 'react';

const CricketLayout = ({ children }) => {
  useEffect(() => {
    // Dynamically import CSS only when this component mounts
    import("../../public/assets/css/style.css");
    
  }, []);

  return (
    <div>
      {children}
    </div>
  );
};
export default CricketLayout;