import axios from 'axios';

export async function fetchUserMedia(setState) {
  try {
    const requestUserMedia = await axios.get(`https://graph.instagram.com/me/media?fields=caption,media_url,permalink&access_token=${process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN}&limit=5`);
    setState(prevState => ({ ...prevState, instagram: requestUserMedia.data.data }));
  } catch(e) {
    console.error(e);
  }
} 