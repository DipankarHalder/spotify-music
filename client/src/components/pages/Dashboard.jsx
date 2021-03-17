import axios from "axios";
import { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import { clientId } from '../config/config';
import useAuth from '../hooks/useAuth';
import ArtistTopTracks from './Track/ArtistTopTracks';
// import PlayTracks from './Track/PlayTracks';
import SearchTrack from './Track/SearchTrack';

const spotifyApi = new SpotifyWebApi({
  client_id: clientId
})

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playTrack, setPlayTrack] = useState();
  const [lyrics, setLyrics] = useState('');
  const [artistTopTracks, setArtistTopTracks] = useState([]);

  function selectTrack(track) {
    setPlayTrack(track);
    setSearch('');
    setLyrics('');
  }

  // for play track
  useEffect(() => {
    if (!playTrack) return
    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playTrack.title,
          artist: playTrack.artist,
        },
      })
      .then(res => setLyrics(res.data.lyrics))
      .catch(err => console.log(err));
  }, [playTrack])

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

  // for get artist top tracks
  useEffect(() => {
    if(!accessToken) return;
    spotifyApi
      .getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB')
      .then(res => {
        console.log(res.body)
        setArtistTopTracks(res.body.tracks)
      })
      .catch(err => console.log(err));
  }, [accessToken])

  return (
    <div>
      <div className="any">
        <input 
          type="text" 
          placeholder="Search songs / artists" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="any">
        {searchResults.map(track => (
          <SearchTrack 
            key={track.uri}
            track={track}
            selectTrack={selectTrack} 
          />
        ))}
      </div>
      <div className="any">
        {searchResults.length === 0 && (
          <div className="any">
            {lyrics}
          </div>
        )}
      </div>
      <div className="any">
        {artistTopTracks && artistTopTracks.map(item => (
          <ArtistTopTracks 
            key={item.uri}
            item={item} 
          />
        ))}
      </div>
      <div className="any">
        {/* <PlayTracks 
          accessToken={accessToken} 
          trackUri={playTrack?.uri} 
        /> */}
      </div>
    </div>
  )
}
