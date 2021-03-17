const client_id = '7371792a8ebc43b4b528b775e467df1e';
const response_type = 'code';
const redirect_uri = 'http://localhost:3000';
const scope = 'streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state';

export const auth_url = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}&scope=${scope}`;