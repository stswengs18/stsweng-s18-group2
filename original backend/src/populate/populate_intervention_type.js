const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Intervention_Type = require('../model/intervention_types');

dotenv.config();

// Connect to the database
// const MONGODB_URI = process.env.MONGODB_URI || ''; // here put if you have local db
mongoose.connect('mongodb+srv://admin:1V6vWzFoObz7lYpb@cluster0.gw18xt7.mongodb.net/Case-management')

// Sample data
const intervention_data = [
  { intervention_name: "Supplementary Feeding Program" },
  { intervention_name: "Medical Assistance" },
  { intervention_name: "Educational Support" },
  { intervention_name: "Livelihood Training" },
  { intervention_name: "Community Clean-up Drive" }
];

// Function to populate DB
const populateDB = async () => {
    try {
        await Intervention_Type.deleteMany({});

        await Intervention_Type.insertMany(intervention_data);

        // console.log("Successfully added interventions");
        
    } catch (error) {
        console.error("Error populating database:", error);
    } finally {
        mongoose.connection.close();
    }
}

populateDB();