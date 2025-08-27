# Tone Picker Text Tool

A sophisticated AI-powered text tone adjustment tool that allows users to modify the formality and detail level of their writing using a 2×2 matrix interface. Built with React, Express.js, and integrated with Mistral AI.

## Features

### Core Functionality
- **Advanced Text Editor**: Real-time text editing with character count and auto-resize
- **2×2 Tone Matrix**: Adjust text along two axes - Formality (Casual ↔ Formal) and Detail (Concise ↔ Detailed)
- **AI-Powered Transformations**: Uses Mistral AI's `mistral-small-latest` model for intelligent tone adjustments
- **Complete Undo/Redo System**: Full revision history with keyboard shortcuts (Ctrl+Z/Ctrl+Y)
- **Persistent Storage**: Automatic saving of revision history to localStorage
- **Real-time Feedback**: Loading states, error handling, and success confirmations

### Technical Features
- **Secure API Integration**: Backend proxy protects API keys and handles rate limiting
- **Intelligent Caching**: Reduces API calls for repeated tone conversions
- **Error Resilience**: Comprehensive error handling for network issues and API failures
- **Responsive Design**: Optimized for desktop and mobile devices
- **Keyboard Shortcuts**: Standard undo/redo shortcuts for improved UX

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Mistral AI API key ([Get one here](https://mistral.ai/))

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd tone-picker-text-tool
npm install
```

2. **Set up the backend**:
```bash
cd server
npm install
```

3. **Configure environment variables**:
```bash
# In the root directory, copy the example env file
cp .env.example .env

# Edit .env and add your Mistral API key:
MISTRAL_API_KEY=your_mistral_api_key_here
PORT=3001
```

### Running the Application

1. **Start the backend server** (in a terminal):
```bash
cd server
npm start
```

2. **Start the frontend** (in another terminal):
```bash
npm run dev
```

3. **Open your browser** and navigate to `http://localhost:5173`

The backend will run on `http://localhost:3001` and the frontend on `http://localhost:5173`.

## API Configuration

### Getting a Mistral API Key

1. Visit [Mistral AI](https://mistral.ai/)
2. Sign up for an account
3. Navigate to your API dashboard
4. Create a new API key
5. Copy the key to your `.env` file

### Environment Variables

Create a `.env` file in the root directory:

```env
MISTRAL_API_KEY=your_mistral_api_key_here
PORT=3001
```

## Usage Guide

### Basic Usage

1. **Enter Text**: Type or paste your text in the left editor panel
2. **Select Tone**: Choose from the 2×2 matrix:
   - **Casual & Concise**: Friendly and brief
   - **Casual & Detailed**: Friendly and comprehensive  
   - **Formal & Concise**: Professional and brief
   - **Formal & Detailed**: Professional and comprehensive
3. **Apply Tone**: Click "Apply Tone" to transform your text
4. **Refine**: Use undo/redo to navigate through revisions

### Keyboard Shortcuts

- `Ctrl+Z` (or `Cmd+Z` on Mac): Undo
- `Ctrl+Y` or `Ctrl+Shift+Z` (or `Cmd+Y`/`Cmd+Shift+Z` on Mac): Redo

### Advanced Features

- **Reset**: Return to the original sample text
- **Revision History**: View current revision number and total revisions
- **Auto-save**: All changes are automatically saved to localStorage
- **Error Recovery**: Clear error messages by using undo/redo or making new changes

## Architecture

### Frontend (React + TypeScript)
- **Components**: Modular React components for text editor, tone picker, and controls
- **Hooks**: Custom hooks for undo/redo functionality and keyboard shortcuts
- **State Management**: Local state with localStorage persistence
- **Styling**: Tailwind CSS with custom design system

### Backend (Express.js)
- **API Proxy**: Secure proxy for Mistral AI requests
- **Caching**: In-memory caching for repeated requests
- **Rate Limiting**: Basic rate limiting to prevent abuse
- **Error Handling**: Comprehensive error responses with helpful messages

### File Structure

```
tone-picker-text-tool/
├── src/
│   ├── components/           # React components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer
│   ├── types/               # TypeScript type definitions
│   └── App.tsx             # Main application component
├── server/
│   ├── index.js            # Express server
│   └── package.json        # Server dependencies
├── .env                    # Environment variables
├── .env.example           # Environment template
└── README.md              # This file
```

## API Endpoints

### Backend Endpoints

- `POST /api/adjust-tone`: Transform text tone
- `GET /api/health`: Health check
- `GET /api/cache-stats`: Cache statistics (development)

### Request/Response Format

**Adjust Tone Request**:
```json
{
  "text": "Your text here",
  "toneConfig": {
    "formality": "casual" | "formal",
    "detail": "concise" | "detailed"
  }
}
```

**Adjust Tone Response**:
```json
{
  "adjustedText": "Your transformed text here"
}
```

## Error Handling

The application handles various error scenarios:

- **Network Issues**: Connection problems with the backend
- **API Failures**: Mistral AI service errors
- **Rate Limiting**: Too many requests
- **Invalid Input**: Empty or malformed text
- **Authentication**: Invalid or missing API key

Error messages are user-friendly and provide actionable guidance.

## Development

### Local Development

1. Install dependencies: `npm install`
2. Start backend: `cd server && npm start`
3. Start frontend: `npm run dev`
4. Open `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Deployment Options

### Frontend Deployment
- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder after running `npm run build`

### Backend Deployment
- **Render**: Connect your repository and set environment variables
- **Heroku**: Use the Heroku CLI or GitHub integration
- **Railway**: Connect repository and configure environment

Remember to set your `MISTRAL_API_KEY` environment variable in your deployment platform.

## Troubleshooting

### Common Issues

**Backend Connection Failed**:
- Ensure the backend is running on port 3001
- Check that your firewall isn't blocking the connection
- Verify the API endpoint URL in `src/services/api.ts`

**API Key Issues**:
- Verify your Mistral API key is correct and active
- Check that the `.env` file is in the root directory
- Ensure the backend server restarted after adding the API key

**Frontend Not Loading**:
- Clear your browser cache
- Check the browser console for errors
- Ensure you're accessing `http://localhost:5173`

### Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key and backend configuration
3. Review the server logs for detailed error information

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using React, Express.js, and Mistral AI.