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
  const [userInfo, setUserInfo] = useState('');

  function selectTrack(track) {
    setPlayTrack(track);
    setSearch('');
    setLyrics('');
  }

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

  useEffect(() => {
    if(!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

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
      .then(res => {
        console.log(res.body)
        setArtistTopTracks(res.body.tracks)
      })
      .catch(err => console.log(err));

    spotifyApi
      .getMe()
      .then((data) => {
        console.log(data.body);
        setUserInfo(data.body);
      })
      .catch(err => console.log(err));
  }, [accessToken])

  return (
    <div className="app-main-wrapper">
      <div className="app-container">
        <div className="app-cover">
          <div className="app-search-section">
            <input 
              type="text" 
              placeholder="Search songs / artists" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="app-search-result-item">
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
          <div className="app-artist-top-tracks">
            <h4>Top Artists &amp; Tracks</h4>
            <div className="app-track-list">
              {artistTopTracks && artistTopTracks.map(item => (
                <ArtistTopTracks 
                  key={item.uri}
                  item={item} 
                />
              ))}
            </div>
          </div>
          <div className="any">
            {/* <PlayTracks 
              accessToken={accessToken} 
              trackUri={playTrack?.uri} 
            /> */}
          </div>
        </div>

        <div className="app-user-info">
            {userInfo && (
              <>
                {Array.isArray(userInfo.images) && !userInfo.images.length ? 
                  (<span></span>) : 
                  (<span><img src={userInfo.images[0].url} alt={userInfo.display_name} /></span>)
                }
                <h3>{userInfo.display_name}</h3>
                <p>{userInfo.email}</p>
                <p>Followers: {userInfo.followers.total}</p>
              </>
            )}
        </div>
      </div>
    </div>
  )
}
