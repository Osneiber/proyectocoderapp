import React, {useEffect, useState} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from '../hooks/useSession';
import { setUser } from '../features/User/userSlice';

import LoadingScreen from '../services/LoadingScreen'; 

const Navigator = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth.value);
  const { getSession } = useSession();
  const [isLoadingSession, setIsLoadingSession] = useState(true); 

  useEffect(()=>{
    const tryLoadSession = async () => {
      try {
        const sessionData = await getSession();
        if(sessionData && sessionData.email && sessionData.localId && sessionData.token){
          dispatch(
            setUser({
              email: sessionData.email,
              localId: sessionData.localId,
              idToken: sessionData.token 
            })
          );
        }
      } catch (err){
    
      } finally {
        setIsLoadingSession(false); 
      }
    };

    tryLoadSession();
  
  }, [dispatch]); 

  
  if (isLoadingSession) {
    return <LoadingScreen />; 
    
  }

  
  return (
    <NavigationContainer>
      {user ? <BottomTabNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}

export default Navigator;