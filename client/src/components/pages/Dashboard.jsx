import { useState } from 'react';
import useAuth from '../hooks/useAuth';

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState('');

  return (
    <div>
      <form>
        <input 
          type="text" 
          placeholder="Search songs / artists" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </form>
    </div>
  )
}
