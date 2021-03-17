import React from 'react';

export default function ArtistTopTracks({ item }) {
  // selectTrack
  // function playFromList() {
  //   selectTrack(item);
  // }

  console.log(item);
  
  return (
    <div>
      <img src={item.album.images[0].url} alt={item.album.name} />
      <p>{item.name}</p>
      <p>{item.artists[0].name}</p>
    </div>
  )
}
