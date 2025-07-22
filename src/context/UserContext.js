import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cobbleStepsLoadUser = async () => {
      try {
        const cobbleStepsStoredUser = await AsyncStorage.getItem('currentUser');
        if (cobbleStepsStoredUser) {
          setUser(JSON.parse(cobbleStepsStoredUser));
        }
      } catch (error) {
        console.error('Cobble steps user loading was ended by error: ', error);
      }
    };
    cobbleStepsLoadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
