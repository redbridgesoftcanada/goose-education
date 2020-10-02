import axios from 'axios';

export async function fetchUserMedia(setState) {
  try {
    const refreshToken = await axios.get(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN}`);
    
    const requestUserMedia = await axios.get(`https://graph.instagram.com/me/media?fields=caption,media_url,permalink&access_token=${refreshToken.data.access_token}&limit=6`);

    setState(prevState => ({ ...prevState, instagram: requestUserMedia.data.data }));
  } catch(e) {
    console.error(e);
  }
} 