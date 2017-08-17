# Map Driver ETA Recipe

Digital cartographers, rejoice! With Lyft's Ride Request API, you can rebuild much of the core functionality found within Lyft’s mobile apps directly in your own application. Check out this Node.js recipe that shows how to surface driver's estimated time of arrival at a location chosen on a map. This application is powered by [Express](https://expressjs.com/), [Mapbox](https://www.mapbox.com/), and our [Node.js SDK](https://github.com/lyft/lyft-node-sdk). 

## Registration
- Create a Lyft Developer [account](https://www.lyft.com/developers).
- Once registered, create a new Lyft [application](https://www.lyft.com/developers/manage).
- Your new application will be assigned a Client ID and a Client Token.

You will also need to [sign up](https://www.mapbox.com/signup/) for a Mapbox developer account and generate an API key.

## Installation

Install dependencies using npm:
```console
cd map-driver-eta
npm install
```

Set your Lyft Client ID and Client Token by copying the example file:
```console
cp .env-example .env
```

Set the Mapbox API key in `/public/javascripts/MapComponent.js`:
```console
mapboxgl.accessToken = "YOUR_MAPBOX_API_KEY";
```

Run the app:
```console      
npm start
```

Go to [http://localhost:3000](http://localhost:3000) in your browser to start using the app.