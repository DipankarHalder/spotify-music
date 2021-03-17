import axios from 'axios';
import { useEffect, useState } from "react";

export default function useAuth(code) {
  const apiPath = 'http://localhost:3001';
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [expiresIn, setExpiresIn] = useState('');

  // for access token
  useEffect(() => {
    axios
      .post(`${apiPath}/login`, { code })
      .then(res => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        window.history.pushState({}, null, '/');
      })
      .catch(() => window.location = '/');
  }, [code]);

  // for refresh token
  useEffect(() => {
    if(!refreshToken || !expiresIn) return;
    const timeInterval = setInterval(() => {
      axios
        .post(`${apiPath}/refresh`, { refreshToken })
        .then(res => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch(() => window.location = '/');
    }, (expiresIn - 60) * 1000);
    return () => clearInterval(timeInterval);
  }, [refreshToken, expiresIn])

  return accessToken;
}
