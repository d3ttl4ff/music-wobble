# Music Wobble

This project is a music visualizer that uses the Web Audio API to create a wobbly sphere that reacts to the music. The sphere is created using `Three.js` and the wobble effect is achieved by using a `Custom Shader Material (CSM)`.

Live: [https://music-wobble.vercel.app](https://music-wobble.vercel.app/#debug)

> [!NOTE]
> To tweak the settings, use the `#debug` query parameter. 
> https://music-wobble.vercel.app/#debug

## Setup

Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```
