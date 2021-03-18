import spotifyLogo from '../../assets/logo.svg';
import { auth_url } from '../config/config';

export default function Login() {
  return (
    <div className="app-login-page">
      <span><img src={spotifyLogo} alt="Spotify Music" /></span>
      <p>a simple music application for web using Spotify API</p>
      <a href={auth_url}>Login &nbsp;with &nbsp;Spotify</a>
    </div>
  )
}
