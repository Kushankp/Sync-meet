import React, { useEffect, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { initializeGapiClient, listUpcomingEvents } from '../services/googleCalenderApi';

function GoogleCalendar() {
  const [tokenClient, setTokenClient] = useState(null);
  const [events, setEvents] = useState([]);
  const [searchParams] = useSearchParams();

  const gapiLoaded = useCallback(() => {
    window.gapi.load('client', initializeGapiClient);
  }, []);

  const gisLoaded = useCallback(() => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
    });
    setTokenClient(client);
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const eventList = await listUpcomingEvents();
      setEvents(eventList);

      const userId = searchParams.get('userId');
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

  // const handleAuthClick = useCallback(() => {
  //   if (!tokenClient) return;

  //   tokenClient.callback = async (resp) => {
  //     if (resp.error) throw resp;
  //     await fetchEvents();
  //   };

  //   if (window.gapi.client.getToken() === null) {
  //     tokenClient.requestAccessToken({ prompt: 'consent' });
  //   } else {
  //     tokenClient.requestAccessToken({ prompt: '' });
  //   }
  // }, [tokenClient, fetchEvents]);

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
      {/* <button onClick={handleAuthClick} style={{color:'red'}}>Authorize</button> */}
      <pre>{events.length ? `Events:\n${events.join('\n')}` : 'No events found'}</pre>
    </div>
  );
}

export default GoogleCalendar;
