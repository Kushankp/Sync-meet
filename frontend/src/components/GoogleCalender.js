import React, { useEffect, useCallback, useState } from 'react';
import AuthButton from './AuthButton'; // Assumes you have an AuthButton component
import { useParams } from 'react-router-dom';

function GoogleCalendar() {
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [events, setEvents] = useState([]);
  const { sessionId } = useParams(); // Extract the session ID from the URL

  useEffect(() => {
    // You can use the sessionId here for fetching or displaying session-specific data
    console.log('Session ID:', sessionId);
  }, [sessionId]);

  // Exchange authorization code for access token
  const handleAuthCode = useCallback(async (code) => {
    try {
      const tokenResponse = await fetch('https://sync-meet.kushankrockz.workers.dev/api/token', { // Updated URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!tokenResponse.ok) throw new Error('Failed to exchange token');

      const { access_token } = await tokenResponse.json();

      // Fetch Google Calendar events using the access token
      fetchEvents(access_token);
    } catch (error) {
      console.error('Error during token exchange', error);
    }
  }, []); // No dependencies needed here

  // Initialize Google API Client
  const gapiLoaded = useCallback(() => {
    window.gapi.load('client', async () => {
      await window.gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      });
      setGapiInited(true);
    });
  }, []);

  // Initialize Google Identity Services (GIS)
  const gisLoaded = useCallback(() => {
    const tokenClient = window.google.accounts.oauth2.initCodeClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      ux_mode: 'popup',
      callback: handleAuthCode, // Use handleAuthCode here
    });
    setTokenClient(tokenClient);
    setGisInited(true);
  }, [handleAuthCode]); // Add handleAuthCode as a dependency

  // Fetch Google Calendar events using access token
  const fetchEvents = async (access_token) => {
    try {
      const eventsResponse = await fetch(`https://sync-meet.kushankrockz.workers.dev/api/events?access_token=${access_token}`); // Updated URL
      if (!eventsResponse.ok) throw new Error('Failed to fetch events');

      const eventsData = await eventsResponse.json();
      setEvents(eventsData.items || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents(['Error fetching events']);
    }
  };

  // Trigger Google OAuth authorization
  const handleAuthClick = useCallback(() => {
    if (tokenClient) {
      tokenClient.requestCode();
    }
  }, [tokenClient]);

  // Handle sign-out
  const handleSignoutClick = useCallback(() => {
    const token = window.gapi.client.getToken();
    if (token) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
      setEvents([]); // Clear events on signout
    }
  }, []);

  // Load Google API and GIS scripts
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.async = true;
    script1.defer = true;
    script1.onload = gapiLoaded;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.async = true;
    script2.defer = true;
    script2.onload = gisLoaded;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, [gapiLoaded, gisLoaded]);

  return (
    <div>
      <p>Google Calendar API</p>
      <AuthButton onClick={handleAuthClick} disabled={!gapiInited || !gisInited} text="Authorize" />
      <AuthButton onClick={handleSignoutClick} disabled={!tokenClient} text="Sign Out" />
      <pre>{events.length ? `Events:\n${events.map(event => event.summary).join('\n')}` : 'No events found'}</pre>
    </div>
  );
}

export default GoogleCalendar;
