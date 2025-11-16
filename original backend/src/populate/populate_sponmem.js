const mongoose = require('mongoose');
const dotenv = require('dotenv');

const {Sponsored_Member} = require('../model/sponsored_member');
const {Employee} = require('../model/employee');

dotenv.config();

// Connect to the database
mongoose.connect('mongodb+srv://admin:1V6vWzFoObz7lYpb@cluster0.gw18xt7.mongodb.net/Case-management')

const populateSponMembers = async () => {
    await Sponsored_Member.deleteMany({});

    const assigned1 = await Employee.findOne({ username: "Worker1"});
    const assigned2 = await Employee.findOne({ username: "Worker2"});

    const spon_members = [
        { 
            sm_number: "001",
            last_name: "Dela Cruz",
            first_name: "Althea",
            middle_name: "Reyes",

            sex: "Female",
            dob: "2014-06-15T00:00:00.000Z",
            pob: "Quezon City",

            civil_status: "Single",
            edu_attainment: "Grade 5",
            religion: "Roman Catholic",
            occupation: null,
            contact_no: "09171234567",

            problem_presented: "Needs financial assistance for school supplies and daily transportation",
            observation_findings: "Some text here...",
            recommendation: "Some text here...",
            interventions: [],
            history_problem: "Some text here...",
            evaluation: "Some text here...",

            assigned_sdw: assigned1._id, 
            is_active: "Yes"
        },
        { 
            sm_number: "002",
            last_name: "Santiago",
            first_name: "Enzo",
            middle_name: "Magpantay",

            sex: "Male",
            dob: "2015-11-22T00:00:00.000Z",
            pob: "Makati City",

            civil_status: "Single",
            edu_attainment: "Grade 4",
            religion: "Iglesia ni Cristo",
            occupation: null,
            contact_no: "09281234567",

            problem_presented: "Family seeks financial assistance to continue child's schooling after father lost job",
            observation_findings: "Some text here...",
            recommendation: "Some text here...",
            interventions: [],
            history_problem: "Some text here...",
            evaluation: "Some text here...",
            
            assigned_sdw: assigned1._id,
            is_active: "Yes"
        },
        {
            sm_number: "003",
            last_name: "De Leon",
            first_name: "Aeron",
            middle_name: "Santos",
            
            sex: "Male",
            dob: "2014-03-22T00:00:00Z",
            pob: "Quezon City",
            
            civil_status: "Single",
            edu_attainment: "Grade 5",
            religion: "Roman Catholic",
            occupation: null,
            contact_no: "09175554433",
            
            problem_presented: "Child is exhibiting behavioral issues in school such as frequent outbursts and difficulty following instructions.",
            observation_findings: "Some text here...",
            recommendation: "Some text here...",
            interventions: [],
            history_problem: "Some text here...",
            evaluation: "Some text here...",

            assigned_sdw: assigned2._id,
            is_active: "Yes"
        },
        {
            sm_number: "004",
            last_name: "Ramirez",
            first_name: "Elena",
            middle_name: "Lopez",

            sex: "Female",
            dob: "2013-09-10T00:00:00Z",
            pob: "Pasay City",

            civil_status: "Single",
            edu_attainment: "Grade 6",
            religion: "Roman Catholic",
            occupation: null,
            contact_no: "09223334455",

            problem_presented: "Child has been experiencing persistent absenteeism and low academic performance without clear medical reasons.",
            observation_findings: "Some text here...",
            recommendation: "Some text here...",
            interventions: [],
            history_problem: "Some text here...",
            evaluation: "Some text here...",
           
            assigned_sdw: assigned2._id,
            is_active: "Yes"
        },
        {
            sm_number: "005",
            last_name: "Santos",
            first_name: "Joaquin",
            middle_name: "Reyes",

            sex: "Male",
            dob: "2014-03-25T00:00:00Z",
            pob: "Paranaque City",

            civil_status: "Single",
            edu_attainment: "Grade 5",
            religion: "Iglesia ni Cristo",
            occupation: null,
            contact_no: "09171234567",
            
            problem_presented: "Client shows signs of prolonged withdrawal and difficulty socializing after recent relocation to a new school.",
            observation_findings: "Some text here...",
            recommendation: "Some text here...",
            interventions: [],
            history_problem: "Some text here...",
            evaluation: "Some text here...",
           
            assigned_sdw: assigned1._id,
            is_active: "yes"
        }
    ]
    await Sponsored_Member.insertMany(spon_members);
    // console.log("Successfully added Sponsored Members.");

    mongoose.connection.close();
}

populateSponMembers();