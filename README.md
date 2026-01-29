# JSON Viewer - Advanced Multi-Tab JSON Editor

A modern, feature-rich JSON viewer built with Next.js, React, and Shadcn UI. Perfect for developers who need to work with multiple JSON documents simultaneously with syntax highlighting and multiple theme options.

## Features

- **Multi-Tab Support**: Manage multiple JSON documents simultaneously with persistent storage
- **Multiple Themes**: Choose from 4 beautiful themes: Light, Dark, Monokai, and Dracula
- **Dual View Modes**: Toggle between Raw (editor) and Formatted (syntax-highlighted preview)
- **Real-Time Validation**: Instant JSON validation with error messages
- **Format/Minify**: Easily format with proper indentation or minify JSON
- **JSON Statistics**: See character count, line count, and file size
- **Collapsible Objects**: Expand/collapse nested objects and arrays in formatted view
- **Copy to Clipboard**: Quick copy button for formatted JSON
- **Tab Management**: Create, duplicate, delete, and organize tabs
- **LocalStorage Persistence**: All tabs and settings persist automatically
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + T`: Toggle Raw/Formatted view
  - `Ctrl/Cmd + N`: Create new tab
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Optional Supabase Integration**: Ready for cloud storage integration

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Components**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **Storage**: LocalStorage (with Supabase integration ready)
- **Icons**: Lucide React
- **Language**: TypeScript

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with AppProvider
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── JsonViewer.tsx      # Main viewer component
│   ├── JsonEditor.tsx      # JSON input editor
│   ├── JsonDisplay.tsx     # Formatted display with syntax highlighting
│   ├── TabItem.tsx         # Tab UI component
│   ├── ThemeSelector.tsx   # Theme selection dropdown
│   ├── NewTabDialog.tsx    # Create new tab dialog
│   ├── KeyboardHelpDialog.tsx # Keyboard shortcuts help
│   └── ui/                 # Shadcn UI components
├── contexts/
│   └── AppContext.tsx      # Global app state (tabs, theme, etc)
├── hooks/
│   ├── useLocalStorage.ts  # Custom hook for localStorage sync
│   └── useKeyboardShortcuts.ts # Keyboard shortcuts handler
├── lib/
│   ├── storage.ts          # LocalStorage service
│   ├── json-formatter.ts   # JSON validation and formatting utilities
│   └── utils.ts            # Helper functions
├── types/
│   └── index.ts            # TypeScript type definitions
└── public/                 # Static assets
```

## Getting Started

### Installation

1. **Clone and setup** (or download the generated code):
```bash
git clone <your-repo>
cd json-viewer
npm install
```

2. **Run development server**:
```bash
npm run dev
```

3. **Open in browser**:
Navigate to `http://localhost:3000`

## Usage

### Creating a Tab
1. Click the **"New Tab"** button in the top bar
2. Enter a title (required) and optional description
3. Click **"Create Tab"**

### Editing JSON
1. Paste or type JSON in the editor (left panel)
2. See real-time validation feedback
3. Use **Format** or **Minify** buttons to organize

### Viewing Formatted JSON
1. Click **"View Formatted"** to see the syntax-highlighted preview
2. Click on arrows to expand/collapse nested structures
3. Use **Copy** button to copy to clipboard

### Managing Tabs
- **Switch tabs**: Click on any tab header
- **Duplicate**: Click `⋯` menu on active tab → **Duplicate**
- **Delete**: Click `⋯` menu on active tab → **Delete**
- **Clear all**: Settings menu → **Clear All Tabs**

### Changing Theme
1. Click the **Palette** icon in the header
2. Select from 4 available themes
3. Theme preference is automatically saved

### Keyboard Shortcuts
- **Ctrl/Cmd + T**: Toggle between Raw and Formatted view
- **Ctrl/Cmd + N**: Create a new tab (coming soon)

## Features in Detail

### JSON Validation
- Real-time validation as you type
- Clear error messages showing what's wrong
- Character/line count and file size display

### Syntax Highlighting
The formatted view includes context-aware colors for:
- **Keys**: Blue
- **Strings**: Green
- **Numbers**: Orange
- **Booleans**: Red
- **Brackets/Punctuation**: Gray

### Storage
- All tabs and settings persist in browser LocalStorage
- No data leaves your device by default
- Storage limit: ~5-10MB per browser

### Theme Options
1. **Light**: Clean, bright theme for daytime use
2. **Dark**: Easy on the eyes for extended sessions
3. **Monokai**: Popular code editor theme with vibrant colors
4. **Dracula**: Dark theme with contrasting accent colors

## Future Enhancements

Planned features for upcoming versions:

- **Cloud Storage**: Supabase integration for backup and sync across devices
- **Search/Filter**: Find specific keys or values in JSON
- **Diff View**: Compare two JSON documents side-by-side
- **JSON Path**: Navigate to specific properties using JSONPath
- **Export**: Download tabs as JSON files
- **Import**: Load JSON files from disk
- **Drag & Drop Reordering**: Reorder tabs by dragging
- **JSON Schema Validation**: Validate against JSON schemas
- **Community Themes**: User-created theme library

## Data Privacy

Your JSON data stays on your device:
- All data is stored in browser LocalStorage
- No data is sent to external servers by default
- Optional Supabase integration is opt-in
- You have full control over your data

## Keyboard & Accessibility

- Full keyboard navigation support
- ARIA labels for screen readers
- High contrast themes for accessibility
- Tab stops and focus management

## Performance

- Optimized rendering with React Context
- Efficient localStorage updates
- Debounced storage operations
- Handles large JSON files (tested with 1MB+ files)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Adding a New Theme

1. Update `ThemeType` in `/types/index.ts`:
```typescript
export type ThemeType = 'light' | 'dark' | 'monokai' | 'dracula' | 'your-theme';
```

2. Add theme definition in `JsonDisplay.tsx`:
```typescript
your-theme: {
  bg: 'bg-your-bg',
  text: 'text-your-text',
  // ... other colors
}
```

3. Add theme option in `ThemeSelector.tsx` THEMES array

### Extending State Management

To add new global state:

1. Add to `AppState` interface in `/types/index.ts`
2. Add to `AppProvider` in `/contexts/AppContext.tsx`
3. Export new action from `useApp()` hook

## License

MIT License - feel free to use this project for personal or commercial use.

## Support

For issues, feature requests, or questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include browser version and steps to reproduce

---

**Happy JSON viewing!** If you find this tool useful, please consider starring the repository.
