const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Family_Member = require('../model/family_member')

dotenv.config();

// Connect to the database
// const MONGODB_URI = process.env.MONGODB_URI || ''; // here put if you have local db
mongoose.connect('mongodb+srv://admin:1V6vWzFoObz7lYpb@cluster0.gw18xt7.mongodb.net/Case-management')

// Sample data
const family_member_data = [
    {
        last_name: 'Angat',
        first_name: 'Ana',
        edu_attainment: 'High School',
        occupation: 'Student',
        income: '0'
    },
    {
        last_name: 'Tolentino',
        first_name: 'Hep',
        edu_attainment: 'High School',
        occupation: 'Student',
        income: '1'
    },
    {
        last_name: 'Dela Cruz',
        first_name: 'Matthew',
        edu_attainment: 'High School',
        occupation: 'Student',
        income: '3'
    },
]

// Function to populate DB
const populateDB = async () => {
    try {
        await Family_Member.deleteMany({});

        await Family_Member.insertMany(family_member_data);

        // console.log("Successfully added family members");
        
    } catch (error) {
        console.error("Error populating database:", error);
    } finally {
        mongoose.connection.close();
    }
}

populateDB();