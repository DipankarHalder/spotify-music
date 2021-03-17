import Dashboard from './Dashboard';
import Login from './Login';

const code = new URLSearchParams(
    window.location.search
  ).get('code');

export default function Router() {
  return (
    <div className="App">
      {code ? 
        <Dashboard code={code} /> : 
        <Login />
      }
    </div>
  );
}
