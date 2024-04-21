import React, { createContext, useState } from 'react';

// Create the context
const UserDetailContext = createContext();

// Create a provider for the context
const UserDetailProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [connectedUser, setConnectedUser] = useState([]);
  const [stompClient, setStompClient] = useState(null);


  return (
    <UserDetailContext.Provider
      value={{ token, setToken, userId, setUserId, isLoggedIn, setIsLoggedIn,connectedUser, setConnectedUser,stompClient, setStompClient }}
    >
      {children}
    </UserDetailContext.Provider>
  );
};

export { UserDetailContext, UserDetailProvider };
