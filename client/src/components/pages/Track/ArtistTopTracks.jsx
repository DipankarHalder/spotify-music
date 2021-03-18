import React from 'react';

export default function ArtistTopTracks({ item }) {
  // selectTrack
  // function playFromList() {
  //   selectTrack(item);
  // }
  
  return (
    <div className="app-top-songs-artists-list">
      <img src={item.album.images[0].url} alt={item.album.name} />
      <h6>{item.name}</h6>
      <p>{item.artists[0].name}</p>
    </div>
  )
}
