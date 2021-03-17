export default function SearchTrack({ track, selectTrack }) {

  function playFromList() {
    selectTrack(track);
  }

  return (
    <div onClick={playFromList}>
      <img src={track.albumUrl} alt={track.title} />
      <p>{track.title}</p>
      <p>{track.artist}</p>
    </div>
  )
}
