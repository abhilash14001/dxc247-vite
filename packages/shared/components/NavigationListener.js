import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearNavigation } from '../store/slices/navigationSlice';

const NavigationListener = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigateTo = useSelector(state => state.navigation.navigateTo);

  useEffect(() => {
    if (navigateTo) {
      navigate(navigateTo);
      dispatch(clearNavigation());
    }
  }, [navigateTo, navigate]);

  return null;
};

export default NavigationListener;
