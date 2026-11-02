https://chrome.google.com/webstore/devconsole/753500a1-fcd7-4db2-ba6f-166558c9eb53/oejpnpkomjknngkoppafigbbnkhiclah/edit/privacy

```bash
### 📦 Supakuoti `easy-scraper.zip` (Chrome Web Store / Edge Add-ons)
cd "$( [ -d "easy-scraper" ] && echo "easy-scraper" || echo "." )" && \
rm -f ../easy-scraper.zip easy-scraper.zip && \
powershell.exe -NoProfile -Command "Compress-Archive -Path manifest.json,popup.html,popup.js,scraper-engine.js,icon16.png,icon48.png,icon128.png -DestinationPath easy-scraper.zip -Force" && \
echo "✅ Sėkmingai sukurtas: $(pwd)/easy-scraper.zip"
```

Description
````
Easy Scraper is a fast, lightweight, and privacy-first browser extension that extracts HTML tables, Google Search organic results, and repeating web lists into clean CSV files or Excel-ready clipboard data with a single click.

Whether you are researching competitors, collecting leads from search results, or exporting financial and Wikipedia tables into spreadsheets, Easy Scraper detects structured data on the active page automatically.

KEY FEATURES:
• Automatic Data Detection: Instantly recognizes standard HTML tables (<table>), Google Search organic results (Title, URL, Description), and repeating product or article cards.
• 1-Click CSV Download: Export extracted rows directly to a UTF-8 CSV file compatible with Microsoft Excel, Google Sheets, LibreOffice, and databases.
• 1-Click Copy to Clipboard: Copy structured data in TSV format and paste (Ctrl+V) straight into Excel, Google Sheets, or Notion without downloading files.
• Minimalist Icon-First Dark UI: Distraction-free interface with an optional built-in legend supporting English, Lithuanian, German, Spanish, French, and Polish.
• 100% Local & Private: All data extraction runs locally inside your browser when you click the extension icon. No external servers, no tracking, no analytics, and no account required.

HOW TO USE:
1. Open any webpage containing a table, search results, or a list of items.
2. Click the Easy Scraper icon in your browser toolbar to see the number of detected rows.
3. Click "CSV" to download the file or the Copy icon to copy the table to your clipboard.

````

Microsoft:
https://partner.microsoft.com/en-us/dashboard/microsoftedge/113c6a7b-1968-4d32-8b1a-64e3e7203862/packages

