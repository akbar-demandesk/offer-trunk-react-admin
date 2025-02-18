import React, { createContext, useEffect, useReducer } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios.js';
import { MatxLoading } from 'app/components';
import { loginUrl } from 'app/helper/ApiUrlHelper';

const initialState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
};

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decodedToken = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decodedToken.exp > currentTime;
};

const setSession = (accessToken, roleId) => {
  if (accessToken && roleId) {
    // alert("Setting in local...")
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('roleId', roleId);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('roleId');
    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      const { isAuthenticated } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
      };
    }
    case 'LOGIN': {
      return {
        ...state,
        isAuthenticated: true,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => Promise.resolve(),
  googleLogin: () => Promise.resolve(),
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    try {
      const response = await axios.post(loginUrl(), {
        email,
        password,
      });

      if (response.data.errorCode === 0) {
        const accessToken = response.data.data.token;
        const roleId = response.data.data.role_id;

        setSession(accessToken, roleId);

        dispatch({
          type: 'LOGIN',
          payload: {
            roleId,
          },
        });
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const googleLogin = () => {
    return new Promise((resolve, reject) => {
      const authWindow = window.open(
        'https://api.offertrunk.com/api/auth/google',
        '_blank',
        'width=500,height=600'
      );

      const handleAuthMessage = (event) => {
        if (event.origin !== 'https://api.offertrunk.com') {
          return;
        }

        const { token, role_id } = event.data;
        const accessToken = event.data.token;
        const roleId = event.data.role_id;

        if (token) {
          setSession(accessToken, roleId);
          dispatch({
            type: 'LOGIN',
            payload: {
              roleId,
            },
          });
          resolve();
        } else {
          reject(new Error('Google Sign-In failed'));
        }

        window.removeEventListener('message', handleAuthMessage);
      };

      window.addEventListener('message', handleAuthMessage);
    });
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        const roleId = window.localStorage.getItem('roleId');

        if (accessToken && roleId) {
          setSession(accessToken, roleId);
          dispatch({
            type: 'INIT',
            payload: {
              isAuthenticated: true,
              // user: jwtDecode(accessToken),
            },
          });
        } else {
          dispatch({
            type: 'INIT',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INIT',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  if (!state.isInitialised) {
    return <MatxLoading />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
