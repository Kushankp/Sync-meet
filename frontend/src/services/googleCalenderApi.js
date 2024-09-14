export const initializeGapiClient = async () => {
    await window.gapi.client.init({
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    });
  };
  
  export const listUpcomingEvents = async () => {
    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      });
  
      const events = response.result.items;
      return events.length ? events.map(event => `${event.summary} (${event.start.dateTime || event.start.date})`) : [];
    } catch (error) {
      console.error('Error fetching events', error);
      return ['Error fetching events'];
    }
  };
  