const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

require("dotenv").config();

const MONGO_URL = process.env.ATLASDB_URL;
const MAP_TOKEN = process.env.MAP_TOKEN;


// Geocode location using Mapbox
const geocode = async (location, country) => {
    const query = encodeURIComponent(`${location}, ${country}`);

    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${query}&access_token=${MAP_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.features || data.features.length === 0) {
        throw new Error(`Could not find location: ${location}, ${country}`);
    }

    const [lng, lat] = data.features[0].geometry.coordinates;

    return {
        type: "Point",
        coordinates: [lng, lat],
    };
};


// Connect to MongoDB Atlas
main()
    .then(() => {
        console.log("Connected to DB");
        initDB();
    })
    .catch((err) => {
        console.error(err);
    });


async function main() {
    await mongoose.connect(MONGO_URL);
}


// Initialize database
const initDB = async () => {

    try {
        const listings = [];

        for (let obj of initData.data) {

            // Add geometry if it doesn't already exist
            if (!obj.geometry) {
                console.log(`Finding coordinates for: ${obj.location}, ${obj.country}`);

                obj.geometry = await geocode(
                    obj.location,
                    obj.country
                );
            }

            listings.push({
                ...obj,
                owner: "6abc382a361b657db4927c4b"
            });
        }

        await Listing.insertMany(listings);

        console.log("Data was initialized successfully!");

    } catch (err) {
        console.error("Error initializing data:", err);
    }
};