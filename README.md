# Three.js Bouncing Sphere Project

A simple Three.js project that displays a bouncing sphere with GLB model support.

## Features

- Bouncing sphere animation with physics
- GLB model loading support with fallback
- Realistic lighting and shadows
- Responsive design

## Setup

### Option 1: Using Node.js Server (Recommended)
1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Open your browser to `http://localhost:3000`

### Option 2: Direct File Access
1. Open `index.html` in a web browser
2. Note: Some browsers may block local file access for GLB loading

### Custom Models
Optionally, place a `sphere.glb` file in the same directory to use a custom 3D model

## Files

- `index.html` - Main HTML file with Three.js setup
- `script.js` - JavaScript with scene, animation, and GLB loading logic
- `server.js` - Express server for serving the application
- `package.json` - Node.js project configuration

## Usage

The sphere will bounce around the scene automatically. If a `sphere.glb` file is present, it will be loaded; otherwise, a fallback sphere geometry will be used.

## Dependencies

- Three.js (loaded via CDN)
- GLTFLoader (loaded via CDN)