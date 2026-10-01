const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

require("dotenv").config();

const MONGO_URL = process.env.ATLASDB_URL;

const categories = {
    "Cozy Beachfront Cottage": "Amazing Pools",
    "Modern Loft in Downtown": "Iconic cities",
    "Mountain Retreat": "Mountains",
    "Historic Villa in Tuscany": "Farms",
    "Secluded Treehouse Getaway": "Camping",
    "Beachfront Paradise": "Trending",
    "Rustic Cabin by the Lake": "Boats",
    "Luxury Penthouse with City Views": "Iconic cities",
    "Ski-In/Ski-Out Chalet": "Arctic",
    "Safari Lodge in the Serengeti": "Trending",
    "Historic Canal House": "Iconic cities",
    "Private Island Retreat": "Boats",
    "Charming Cottage in the Cotswolds": "Farms",
    "Historic Brownstone in Boston": "Rooms",
    "Beachfront Bungalow in Bali": "Amazing Pools",
    "Mountain View Cabin in Banff": "Mountains",
    "Art Deco Apartment in Miami": "Rooms",
    "Tropical Villa in Phuket": "Amazing Pools",
    "Historic Castle in Scotland": "Castles",
    "Desert Oasis in Dubai": "Domes",
    "Rustic Log Cabin in Montana": "Camping",
    "Beachfront Villa in Greece": "Amazing Pools",
    "Eco-Friendly Treehouse Retreat": "Camping",
    "Historic Cottage in Charleston": "Rooms",
    "Modern Apartment in Tokyo": "Iconic cities",
    "Lakefront Cabin in New Hampshire": "Boats",
    "Luxury Villa in the Maldives": "Amazing Pools",
    "Ski Chalet in Aspen": "Arctic",
    "Secluded Beach House in Costa Rica": "Trending"
};

async function updateCategories() {
    try {
        await mongoose.connect(MONGO_URL);

        console.log("Connected to MongoDB Atlas");

        for (const [title, category] of Object.entries(categories)) {
            const result = await Listing.updateOne(
                { title: title },
                { $set: { category: category } }
            );

            console.log(`${title} → ${category} (${result.modifiedCount} updated)`);
        }

        console.log("All categories updated successfully!");

        await mongoose.connection.close();
        console.log("Database connection closed");

    } catch (err) {
        console.error("Error updating categories:", err);
        await mongoose.connection.close();
    }
}

updateCategories();