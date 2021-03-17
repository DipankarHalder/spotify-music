import { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import { clientId } from '../config/config';
import useAuth from '../hooks/useAuth';
import SearchTrack from './SearchTrack';

const spotifyApi = new SpotifyWebApi({
  client_id: clientId
})

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // for token verification
  useEffect(() => {
    if(!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  // for search result
  useEffect(() => {
    if(!search) return setSearchResults([]);
    if(!accessToken) return;
    let cancelCall = false;
    spotifyApi
      .searchTracks(search)
      .then(res => {
        if(cancelCall) return;
        setSearchResults(
          res.body.tracks.items.map(track => {
            const smallAlbumImage = track.album.images.reduce((smallImg, image) => {
              if(image.height < smallImg.height) return image;
              return smallImg;
            }, track.album.images[0]);
            return {
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: smallAlbumImage.url
            }
          })
        );
      })
      .catch(err => console.log(err));
      return () => cancelCall = true;
  }, [search, accessToken]);

  useEffect(() => {
    if(!accessToken) return;
    spotifyApi
      .getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB')
      .then(res => console.log(res.body))
      .catch(err => console.log(err));
  }, [accessToken])

  return (
    <div>
      {console.log(searchResults)}
      <form>
        <input 
          type="text" 
          placeholder="Search songs / artists" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </form>
      <div className="any">
        {searchResults.map(track => (
          <SearchTrack track={track} key={track.uri} />
        ))}
      </div>
    </div>
  )
}
