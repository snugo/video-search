Export Your Spreadsheet to JSON
- Open your spreadsheet (Excel or Google Sheets)
- Export to CSV
- Convert that CSV to JSON: You can use an online tool like csvjson.com
- You'll end up with a file like: Documents/PythonScripts/videos.json

Test Locally
- Use a local server (because fetch() needs it):
- If you have Python:
	cd Documents/PythonScripts/video-search-site
	python3 -m http.server
- Then open http://localhost:8000 in your browser!
- To refresh, use ctrl+shift+r