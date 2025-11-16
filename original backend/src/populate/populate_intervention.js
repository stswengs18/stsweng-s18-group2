const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Intervention_Type = require('../model/intervention_types');
const Intervention = require('../model/intervention');
const {Sponsored_Member} = require('../model/sponsored_member');

dotenv.config();

// Connect to the database
mongoose.connect('mongodb+srv://admin:1V6vWzFoObz7lYpb@cluster0.gw18xt7.mongodb.net/Case-management')

const populateInterventions = async () => {
    await Intervention.deleteMany({});

    const type1 = await Intervention_Type.findOne({ intervention_name: "Educational Support"});
    const spon_mem1 = await Sponsored_Member.findOne({ sm_number: "001"});

    const interventions = [
        { 
            intervention_type: type1._id,
            objective: "To provide the child with the resources needed to continue schooling.",
            sdw_assessment: "Client shows motivation to continue studies but lacks basic supplies.",
            recommendation: "Enroll child in educational support program and provide monthly allowance."
        },
        { 
            intervention_type: type1._id,
            objective: "Support child’s academic development through after-school tutoring.",
            sdw_assessment: "Client struggles with reading comprehension and basic math skills.",
            recommendation: "Provide access to weekly tutoring sessions and monitor academic progress monthly."
        }
    ]
    const inserted = await Intervention.insertMany(interventions);
    // console.log("Successfully added Interventions.");

    // Update spon_mem
    spon_mem1.interventions.push(...inserted.map(i => i._id));
    await spon_mem1.save();
    // console.log(`Updated ${spon_mem1.sm_number}`);
    // console.log(spon_mem1);

    mongoose.connection.close();
}

populateInterventions();