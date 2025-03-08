const { google } = require("googleapis");

// **IMPORTANT: Load credentials securely - NOT hardcoded!**
// For local development, you can place credentials.json in the netlify/functions directory
// For production, use environment variables or Netlify environment variables.
const credentials = require("./credentials.json"); // For local testing ONLY

const calendarId =
  "163083f57e6a51519703601762336f48a47e3e2681b559c3cfdbbcd18ded168f@group.calendar.google.com"; // Replace with your actual calendar ID
const oAuth2Client = new google.auth.OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0] // Use the first redirect URI you configured
);

// Function to authorize and get calendar events
async function getCalendarEvents() {
  try {
    // **For simplicity in this example, we're assuming you have a refresh token stored.**
    // In a real-world scenario, you'd implement a proper OAuth 2.0 flow to get tokens.
    // For local testing, you can manually get a refresh token using the Google OAuth Playground.
    // **DO NOT HARDCODE REFRESH TOKENS IN PRODUCTION!**
    oAuth2Client.setCredentials({
      refresh_token:
        "1//04vR3q6Guat7zCgYIARAAGAQSNwF-L9IrbU3Hn6mMwP-HsaaF6XLGpl0Y8e8Wg_SRrUzG_QumMpldt1_4hKBH1tctRZ4OTezjGsQ", // **REPLACE WITH YOUR REFRESH TOKEN**
    });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(), // Get events from now onwards
      maxResults: 10, // Limit the number of events (adjust as needed)
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;
    if (!events || events.length === 0) {
      console.log("No upcoming events found.");
      return [];
    }
    return events.map((event) => ({
      summary: event.summary,
      start: event.start ? event.start.dateTime || event.start.date : null,
      end: event.end ? event.end.dateTime || event.end.date : null,
    }));
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error; // Let Netlify Functions handle the error response
  }
}

// Netlify Function handler
exports.handler = async function (event, context) {
  try {
    const events = await getCalendarEvents();
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
