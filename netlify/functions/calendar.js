const { google } = require("googleapis");

const calendarId = process.env.GOOGLE_CALENDAR_ID; // Get Calendar ID from environment variable
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,        // Get Client ID from environment variable
  process.env.GOOGLE_CLIENT_SECRET,     // Get Client Secret from environment variable
  process.env.GOOGLE_REDIRECT_URI       // Get Redirect URI from environment variable
);

// Function to authorize and get calendar events
async function getCalendarEvents(year) {
  try {
    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN, // Get Refresh Token from environment variable
    });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    const timeMin = new Date(`${year}-01-01T00:00:00Z`).toISOString();
    const timeMax = new Date(`${year}-12-31T23:59:59Z`).toISOString();

    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: timeMin,
      timeMax: timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;
    if (!events || events.length === 0) {
      console.log("No events found for the selected year.");
      return [];
    }
    return events.map((event) => ({
      summary: event.summary,
      start: event.start ? event.start.dateTime || event.start.date : null,
      end: event.end ? event.end.dateTime || event.end.date : null,
    }));
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error;
  }
}

// Netlify Function handler
exports.handler = async function (event, context) {
  try {
    const { year } = event.queryStringParameters || {};
    const events = await getCalendarEvents(year || new Date().getFullYear());
    return {
      statusCode: 200,
      body: JSON.stringify(events),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch calendar events" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};