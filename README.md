# Élégance - Luxury Jewelry Showcase

An elegant Three.js project showcasing a luxury jewelry ring with diamond, featuring sophisticated animations and lighting.

## Features

- Professional jewelry store loading screen with brand identity
- Realistic 3D ring and diamond models with PBR materials
- Sophisticated lighting setup for diamond sparkle effects
- Smooth zoom-out entrance animation
- Elegant rotation and tilt animations
- Pink gradient luxury background
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
The application supports multiple model formats with automatic priority loading:

**Loading Priority:**
1. **GLB format** - `ring.glb` (highest priority)
2. **OBJ format** - `ring.obj` (fallback)
3. **Procedural model** - Generated automatically if no files found

**Model Requirements:**
- **Location:** Same directory as `index.html`
- **Scale:** Models are automatically scaled to 50% and positioned correctly

**GLB Models:**
- File name: `ring.glb`
- Materials: Name materials with "gold" and "diamond" for automatic enhancement

**OBJ Models:**
- File name: `ring.obj`
- Mesh names: Use "diamond", "gem", or "stone" for diamond parts
- All other meshes receive gold material automatically

## Files

- `index.html` - Main HTML file with luxury jewelry store interface
- `script.js` - JavaScript with 3D scene, animations, and jewelry rendering
- `server.js` - Express server for serving the application
- `package.json` - Node.js project configuration

## Usage

The application displays a professional jewelry store loading screen with the "ÉLÉGANCE" brand. After loading, it reveals a beautiful 3D ring with diamond that zooms out smoothly and rotates elegantly with sparkling light effects.

## Dependencies

- Three.js (loaded via CDN)
- GLTFLoader (loaded via CDN)