# RSVP Setup — Google Sheets

This explains how to connect the RSVP form on the wedding site to a Google Sheet.
Total time: ~5 minutes. No coding knowledge needed.

---

## 1. Create the Google Sheet

1. Go to <https://sheets.new>
2. Rename the file to something like **Armen & Lilit RSVP**
3. In **Row 1**, add these column headers (exactly):

   | A         | B    | C         | D    |
   | --------- | ---- | --------- | ---- |
   | timestamp | name | attending | side |

That's it for the sheet.

---

## 2. Add the Apps Script

1. In the same spreadsheet, click **Extensions → Apps Script**
2. Delete any code that's there and paste this:

   ```javascript
   const SHEET_NAME = 'Sheet1'; // change if you renamed the tab

   function doPost(e) {
     try {
       const sheet = SpreadsheetApp
         .getActiveSpreadsheet()
         .getSheetByName(SHEET_NAME);

       const data = e.parameter;
       sheet.appendRow([
         data.timestamp || new Date().toISOString(),
         data.name || '',
         data.attending || '',
         data.side || ''
       ]);

       return ContentService
         .createTextOutput(JSON.stringify({ ok: true }))
         .setMimeType(ContentService.MimeType.JSON);
     } catch (err) {
       return ContentService
         .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
         .setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```

3. Click the **Save** icon (or `Cmd + S`). Name the project **RSVP Handler**.

---

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Select type" → choose **Web app**
3. Fill in:
   - **Description:** `RSVP endpoint`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Click **Deploy**
5. The first time, Google will ask for permissions:
   - Click **Authorize access**
   - Pick your Google account
   - You'll see a "Google hasn't verified this app" warning — click **Advanced** → **Go to RSVP Handler (unsafe)** → **Allow**.
     (This is safe — it's *your own* script. Google shows this warning for any unverified personal script.)
6. Copy the **Web app URL** that appears. It looks like:

   ```
   https://script.google.com/macros/s/AKfycbx......../exec
   ```

---

## 4. Paste the URL into the website

Open `script.js` and find this line near the bottom:

```javascript
const RSVP_ENDPOINT = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

Replace the placeholder with the URL you copied. Save the file.

---

## 5. Push to GitHub Pages

```bash
git add .
git commit -m "Add RSVP form"
git push
```

Wait ~1 minute for GitHub Pages to redeploy, then test the form on your site.
You should see a new row appear in your Google Sheet within a second of submission.

---

## Updating the script later

If you ever change the Apps Script code, you must **create a new deployment** (or
choose "Manage deployments" → edit → "New version") for changes to take effect.
The web app URL will stay the same as long as you choose **"Manage deployments"
→ edit existing → New version**.

---

## Troubleshooting

- **Form says "Ինչ-որ բան սխալ գնաց"** → most often the URL is wrong, or the
  deployment access is set to "Only myself" instead of "Anyone".
- **Submissions don't appear in the sheet** → check the script's
  **Executions** tab in Apps Script for errors.
- **Want email notifications too?** Add this inside `doPost`, just before the
  return statement:

  ```javascript
  MailApp.sendEmail(
    'your.email@gmail.com',
    'New RSVP: ' + data.name,
    'Attending: ' + data.attending + '\nSide: ' + data.side
  );
  ```
