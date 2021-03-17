import { auth_url } from '../config/config';

export default function Login() {
  return (
    <div>
      <a href={auth_url}>Login with Spotify</a>
    </div>
  )
}
