import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const systemPrompt = `You are a highly skilled AI Music Curator and Playlist Creator. Your mission is to create a personalized Spotify playlist for the user based on their mood, story, or activity.

Your process must be as follows:

1.  Analyze the User's Request: Carefully read the user's input to understand their mood (e.g., "melancholic"), the story they're telling (e.g., "a rainy Sunday afternoon"), or the activity they're engaged in (e.g., "a coding session").
2.  Generate a Playlist Concept: Based on your analysis, come up with a creative playlist title and a short description that captures the essence of the user's request.
3.  Curate Song Recommendations: Curate a list of 10-15 songs that perfectly match the identified mood and theme. The songs must be real tracks available on Spotify.
4.  Format the Output as JSON: Your final response must be a single, valid JSON object that adheres to the following strict schema. **Do not include any conversational text, explanations, or markdown outside of the JSON block.** The entire response must be a single JSON object so it can be programmatically parsed.

JSON Schema:
{
  "playlist_title": "string",
  "playlist_description": "string",
  "tracks": [
    {
      "track_name": "string",
      "artist_name": "string"
    },
    {
      "track_name": "string",
      "artist_name": "string"
    }
  ]
}`;

// Main API endpoint to generate a Spotify playlist
app.post('/api/create-playlist', async (req, res) => {
  const { mood, spotifyAccessToken, spotifyUserId } = req.body;

  if (!mood || !spotifyAccessToken || !spotifyUserId) {
    return res.status(400).json({ error: 'Missing required parameters: mood, spotifyAccessToken, or spotifyUserId' });
  }

  try {
    // 1. Get song recommendations from Gemini
    const geminiResponse = await getRecommendationsFromGemini(mood);
    const playlistData = JSON.parse(geminiResponse);
    const tracksToSearch = playlistData.tracks;

    // 2. Search for tracks on Spotify
    const trackURIs = await getSpotifyTrackUris(tracksToSearch, spotifyAccessToken);
    
    if (trackURIs.length === 0) {
      return res.status(404).json({ error: 'No songs found on Spotify for the given mood.' });
    }

    // 3. Create a new Spotify playlist
    const newPlaylist = await createSpotifyPlaylist(spotifyUserId, playlistData.playlist_title, playlistData.playlist_description, spotifyAccessToken);
    const playlistId = newPlaylist.id;

    // 4. Add tracks to the new playlist
    await addTracksToSpotifyPlaylist(playlistId, trackURIs, spotifyAccessToken);

    res.status(200).json({ playlistUrl: newPlaylist.external_urls.spotify });

  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create the Spotify playlist.' });
  }
});

// Helper functions for API calls

// Calls the Gemini API to get song recommendations
async function getRecommendationsFromGemini(mood) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

  const result = await model.generateContent({
    contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Input: "${mood}"` }] }],
  });
  
  return result.response.text();
}

// Authenticates with Spotify to get an access token
// Note: This is a simplified example using Client Credentials Flow. 
// For a user-facing app, you'll need the Authorization Code Flow.
async function getSpotifyAuthToken() {
  const authUrl = 'https://accounts.spotify.com/api/token';
  const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await axios.post(authUrl, 'grant_type=client_credentials', {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data.access_token;
}

// Searches Spotify for each track and returns a list of URIs
async function getSpotifyTrackUris(tracks, accessToken) {
  const trackUris = [];
  for (const track of tracks) {
    const searchQuery = `track:${track.track_name} artist:${track.artist_name}`;
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=1`;
    
    const response = await axios.get(searchUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    if (response.data.tracks.items.length > 0) {
      trackUris.push(response.data.tracks.items[0].uri);
    }
  }
  return trackUris;
}

// Creates a new playlist on Spotify
async function createSpotifyPlaylist(userId, title, description, accessToken) {
  const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
  const data = {
    name: title,
    description: description,
    public: true
  };
  
  const response = await axios.post(url, data, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return response.data;
}

// Adds a list of tracks to a Spotify playlist
async function addTracksToSpotifyPlaylist(playlistId, trackUris, accessToken) {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const data = { uris: trackUris };

  await axios.post(url, data, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});