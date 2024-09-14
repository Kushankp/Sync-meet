import React, { useEffect, useCallback } from 'react';

function GoogleCalendar() {
  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

  // Define the functions as useCallback to ensure they don't change between renders
  const gapiLoaded = useCallback(() => {
    window.gapi.load('client', initializeGapiClient);
  }, []);

  const initializeGapiClient = useCallback(async () => {
    await window.gapi.client.init({
      apiKey: 'AIzaSyBj6nH8Y7ZjQx0OWyqA2O_l5nNBgjFeLwU',
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
  }, []);

  const gisLoaded = useCallback(() => {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: '299025664349-mktjqrpcqkibethus3ibqa8t5bqh6vjk.apps.googleusercontent.com',
      scope: SCOPES,
      callback: '', // Callback is defined later
    });
    gisInited = true;
    maybeEnableButtons();
  }, []);

  const maybeEnableButtons = useCallback(() => {
    if (gapiInited && gisInited) {
      document.getElementById('authorize_button').style.visibility = 'visible';
    }
  }, [gapiInited, gisInited]);

  const handleAuthClick = useCallback(() => {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      document.getElementById('signout_button').style.visibility = 'visible';
      document.getElementById('authorize_button').innerText = 'Refresh';
      await listUpcomingEvents();
    };

    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }, [tokenClient]);

  const handleSignoutClick = useCallback(() => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
      document.getElementById('content').innerText = '';
      document.getElementById('authorize_button').innerText = 'Authorize';
      document.getElementById('signout_button').style.visibility = 'hidden';
    }
  }, []);

  const listUpcomingEvents = useCallback(async () => {
    let response;
    try {
      const request = {
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      };
      response = await window.gapi.client.calendar.events.list(request);
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }

    const events = response.result.items;
    if (!events || events.length === 0) {
      document.getElementById('content').innerText = 'No events found.';
      return;
    }

    const output = events.reduce(
      (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
      'Events:\n'
    );
    document.getElementById('content').innerText = output;
  }, []);

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
      // Clean up script elements if necessary
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, [gapiLoaded, gisLoaded]);

  const CLIENT_ID = '<YOUR_CLIENT_ID>';
  const API_KEY = '<YOUR_API_KEY>';
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/calendar';

  return (
    <div>
      <p>Google Calendar API Quickstart</p>
      <button id="authorize_button" onClick={handleAuthClick} style={{ visibility: 'hidden' }}>
        Authorize
      </button>
      <button id="signout_button" onClick={handleSignoutClick} style={{ visibility: 'hidden' }}>
        Sign Out
      </button>
      <pre id="content" style={{ whiteSpace: 'pre-wrap' }}></pre>
    </div>
  );
}

export default GoogleCalendar;
