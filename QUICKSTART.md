# Quick Start Guide - JSON Viewer

Get up and running with JSON Viewer in just a few minutes!

## Installation

### Option 1: Using the Downloaded Code

```bash
# 1. Extract the project
unzip json-viewer.zip
cd json-viewer

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Visit http://localhost:3000
```

### Option 2: Clone from GitHub

```bash
git clone <your-repo-url>
cd json-viewer
npm install
npm run dev
```

## First Steps

### 1. Create Your First Tab
- Click the **"New Tab"** button (top right area)
- Enter a title: `API Response`
- Optional description: `GitHub user API endpoint`
- Click **"Create Tab"**

### 2. Paste Some JSON
Here's sample JSON to get started:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["admin", "user"],
    "settings": {
      "notifications": true,
      "darkMode": false
    }
  },
  "timestamp": "2024-01-29T10:30:00Z"
}
```

- Copy the JSON above
- Paste into the editor (left panel)
- You'll see a green checkmark: "Valid JSON"

### 3. View the Preview
- Click **"View Formatted"** button
- See the formatted preview (right panel)
- Expand/collapse sections by clicking arrows
- Click "Copy" to copy the formatted JSON

### 4. Try Different Themes
- Click the **Palette icon** in the header
- Select: **Dark**, **Monokai**, or **Dracula**
- Watch the colors change instantly
- Your choice is saved automatically!

### 5. Toggle View Modes
- Use **"View Raw"** / **"View Formatted"** button to switch
- Or press **Ctrl+T** (Windows/Linux) or **Cmd+T** (Mac)
- Or use the keyboard shortcut for quick switching

## Common Tasks

### Create Multiple Tabs
1. Click "New Tab" to create tab #2
2. Paste different JSON
3. Switch between tabs by clicking tab headers
4. Each tab remembers its content and view mode

### Format Messy JSON
1. Paste unformatted JSON (all one line)
2. Click the **Format** button
3. JSON auto-formats with proper indentation
4. See statistics: lines, characters, file size

### Minify Large JSON
1. Click **Minify** button
2. JSON compresses to single line
3. Useful for sending/storage
4. Smaller file size in console

### Duplicate a Tab
1. Click three dots (`⋯`) on active tab
2. Select **Duplicate**
3. Exact copy created as `Original Name (Copy)`
4. Perfect for comparing JSON variations

### Delete a Tab
1. Click three dots (`⋯`) on active tab
2. Select **Delete**
3. Tab is removed (last tab will be auto-selected)
4. Clear all tabs: Settings menu → **Clear All Tabs**

### Find Keyboard Shortcuts
1. Click the **Help icon** (?) in the header
2. See all available shortcuts
3. Currently supports:
   - **Ctrl/Cmd + T**: Toggle Raw/Formatted
   - **Ctrl/Cmd + N**: Create new tab (coming soon)

## Tips & Tricks

### Keyboard Shortcuts Cheatsheet
| Action | Mac | Windows/Linux |
|--------|-----|--------------|
| Toggle View | `Cmd + T` | `Ctrl + T` |
| New Tab | `Cmd + N` | `Ctrl + N` |

### Working with Large JSON
- Editor handles files up to 1MB+ smoothly
- Expand/collapse sections to manage complexity
- Use "Minify" to reduce file size
- Check file size in the statistics line

### Browser Storage Info
- Data stored in browser's localStorage (not online)
- Capacity: ~5-10MB per domain
- Data persists even after closing browser
- Clear browser data to reset tabs
- No internet connection needed - works offline!

### Sharing Your Work
Since data is stored locally:
1. Copy formatted JSON via "Copy" button
2. Export by copying from Raw view
3. Future: Cloud sync coming in next update!

## Example Workflows

### Workflow 1: API Response Testing
1. Create tab: "User API"
2. Paste API response JSON
3. View formatted to understand structure
4. Check statistics (size, complexity)
5. Copy clean JSON for documentation

### Workflow 2: Config File Management
1. Create tabs for different configs
2. Keep development, staging, production separate
3. Easily duplicate and modify
4. All stored locally for quick reference

### Workflow 3: JSON Transformation
1. Paste original JSON in Tab 1
2. Duplicate to Tab 2
3. Edit Tab 2 with changes
4. Compare both formatted views
5. Copy finished JSON

## Troubleshooting

### JSON Won't Validate
- Check for missing commas
- Ensure all quotes are straight (not curly)
- Numbers should not have quotes
- Objects must have key-value pairs
- Use **Format** button - it helps identify issues

### Tabs Disappeared After Refresh
- Check if browser data was cleared
- Check if using private/incognito mode (doesn't persist)
- Try creating a new tab to verify storage works
- Check browser console for errors

### Can't Paste Large JSON
- Try breaking into smaller chunks
- Use minified version if available
- Check browser tab memory usage
- Clear other browser tabs to free memory

### Theme Doesn't Change
- Refresh page (Ctrl+R or Cmd+R)
- Check if browser cached old version
- Try different theme to confirm it's working
- Check browser DevTools console for errors

## Next Steps

### Learn More
- Read [README.md](./README.md) for full feature list
- Check [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for technical details

### Deploy Your App
Ready to go live? Easy options:
1. **Vercel** (recommended): Click "Publish" button
2. **GitHub Pages**: Push to GitHub, enable Pages
3. **Netlify**: Connect GitHub repo
4. **Docker**: Build container image

### Provide Feedback
- Found a bug? Report it with steps to reproduce
- Have a feature idea? Let me know!
- Love it? Share with other developers!

## What's Coming Next

Future roadmap:
- ✅ Multi-tab JSON viewing
- ✅ Multiple themes
- ✅ Format/Minify options
- 🔄 Cloud storage integration (Supabase)
- 🔄 Search and filtering
- 🔄 Import/export JSON files
- 🔄 JSON schema validation
- 🔄 Diff view for comparing JSONs
- 🔄 Dark/Light mode toggle

---

## Need Help?

1. **Check this guide** - most questions covered above
2. **Read README.md** - comprehensive documentation
3. **Check browser console** - F12 → Console tab
4. **Create an issue** - on GitHub with details

Happy JSON viewing! 🎉
