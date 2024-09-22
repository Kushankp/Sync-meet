import React, { useEffect, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // Assuming you're using react-router
import { initializeGapiClient, listUpcomingEvents } from '../services/googleCalenderApi';
import AuthButton from './AuthButton';

function GoogleCalendar() {
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [events, setEvents] = useState([]);
  const [searchParams] = useSearchParams();

  const gapiLoaded = useCallback(() => {
    window.gapi.load('client', initializeGapiClient);
    setGapiInited(true);
  }, []);

  const gisLoaded = useCallback(() => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      callback: null, // No need to define the callback here
    });
    setTokenClient(tokenClient);
    setGisInited(true);
  }, []);

  // Wrap fetchEvents in useCallback
  const fetchEvents = useCallback(async () => {
    try {
      const eventList = await listUpcomingEvents();
      setEvents(eventList);
      // Send events to your backend/database here
      const userId = searchParams.get('userId'); // Fetch userId from QR code URL
      await fetch('/api/save-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, events: eventList }),
      });
    } catch (error) {
      console.error('Error fetching events', error);
      setEvents(['Error fetching events']);
    }
  }, [searchParams]);

  const handleAuthClick = useCallback(() => {
    if (!tokenClient) return;

    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      await fetchEvents(); // Call fetchEvents after receiving token
    };

    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }, [tokenClient, fetchEvents]);

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
      <pre>{events.length ? `Events:\n${events.join('\n')}` : 'No events found'}</pre>
    </div>
  );
}

export default GoogleCalendar;
