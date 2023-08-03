/* eslint-disable prettier/prettier */
import React, {ReactNode, createContext, useContext, useState} from 'react';

interface UserContextData {
  user: string;
  setUser: (user: string) => void;
}

const UserContext = createContext<UserContextData | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
interface UserProviderProps{
    children:ReactNode
}
export const UserProvider = ({children}:UserProviderProps   ) => {
  const [user, setUser] = useState<string>('');

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};
