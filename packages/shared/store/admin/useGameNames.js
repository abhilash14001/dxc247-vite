import { useDispatch, useSelector } from 'react-redux';
import { setGameNames, setGameNamesLoading, setGameNamesError } from './adminSlice';
import { adminApi } from '../../utils/adminApi';
import { ADMIN_BASE_PATH } from '../../utils/Constants';

export const useGameNames = (gameType = 'all') => {
  const dispatch = useDispatch();
  const { gameNames, gameNamesLoading, gameNamesError } = useSelector(
    (state) => state.admin
  );

  // Handle null gameType by defaulting to 'all'
  const currentGameType = gameType || 'all';
  
  // Ensure the state structure exists, fallback to empty objects if not
  const safeGameNames = gameNames || {};
  const safeGameNamesLoading = gameNamesLoading || {};
  const safeGameNamesError = gameNamesError || {};

  const fetchGameNames = async (type = currentGameType) => {
    // Only fetch if we don't have game names for this specific game type yet
    if (safeGameNames[currentGameType] && Object.keys(safeGameNames[currentGameType]).length > 0) {
      return Promise.resolve();
    }

    try {
      dispatch(setGameNamesLoading({ gameType: currentGameType, loading: true }));
      
      // Add game type parameter to the API call only if specified and not null
      const params = currentGameType !== 'all' ? { game_type: currentGameType } : {};
      const response = await adminApi(`${ADMIN_BASE_PATH}/active-games`, 'POST', params);
      
      if (response && response.success) {
        // Transform the API response to the expected format
        // API returns: [{ id, name, value, label, type }]
        // We need: { "key": "display_name" }
        const gameNamesObject = {};
        response.data.forEach(game => {
          // Filter by game type if specified
          if (currentGameType === 'all' || game.type === currentGameType) {
            // Use the name as both key and value for now
            // You can modify this if you need a different key structure
            gameNamesObject[game.name.toLowerCase().replace(/\s+/g, '_')] = game.name;
          }
        });
        
        console.log(`Game names loaded from API (${currentGameType}):`, gameNamesObject);
        dispatch(setGameNames({ gameType: currentGameType, gameNames: gameNamesObject }));
        return Promise.resolve();
      } else {
        console.error('Failed to fetch game names:', response);
        dispatch(setGameNamesError({ gameType: currentGameType, error: 'Failed to fetch game names' }));
        return Promise.reject(new Error('Failed to fetch game names'));
      }
    } catch (error) {
      console.error('Error fetching game names:', error);
      dispatch(setGameNamesError({ gameType: currentGameType, error: error.message || 'Failed to fetch game names' }));
      return Promise.reject(error);
    }
  };

  return {
    gameNames: safeGameNames[currentGameType] || {},
    gameNamesLoading: safeGameNamesLoading[currentGameType] || false,
    gameNamesError: safeGameNamesError[currentGameType] || null,
    fetchGameNames,
  };
};
