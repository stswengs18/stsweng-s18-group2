const mongoose = require('mongoose');
const dotenv = require('dotenv');

const {Employee} = require('../model/employee');
const {Departments} = require('../model/departments');

dotenv.config();

// Connect to the database
mongoose.connect('mongodb+srv://admin:1V6vWzFoObz7lYpb@cluster0.gw18xt7.mongodb.net/Case-management')

const populateEmployee = async () => {
    await Employee.deleteMany({});

    // Please make sure to populate department first.
    const deptID = await Departments.findOne({ department_name: "department1" });
    // console.log(deptID._id);

    // Head
    const head = new Employee({
        last_name: "Barnes",
        first_name: "James",
        middle_name: "Bucky",

        username: "MainAdmin",
        email: "mainadmin@gmail.com",
        password: "Admin123",

        role: "Head",
        manager: null,
        department: null
    })
    await head.save()
    // console.log("Successfully added Head.");

    const headID = await Employee.findOne({ username: "MainAdmin" });

    // Supervisors
    const supervisors = [
        { 
            last_name: "Reynolds",
            first_name: "Robert",
            middle_name: null,

            username: "Supervisor1",
            email: "supervisor1@gmail.com",
            password: "Supervisor1ABC",

            role: "Supervisor",
            manager: headID._id,
            department: deptID._id
        },
        { 
            last_name: "Belova",
            first_name: "Yelena",
            middle_name: "Pugh",

            username: "Supervisor2",
            email: "supervisor2@gmail.com",
            password: "Supervisor2XYZ",
            
            role: "Supervisor",
            manager: headID._id,
            department: deptID._id
        },
    ]
    await Employee.insertMany(supervisors);
    // console.log("Successfully added Supervisors.");

    // SDWs
    const sv1 = await Employee.findOne({ username: "Supervisor1" });
    const sv2 = await Employee.findOne({ username: "Supervisor2" });
    const sdws = [
        { 
            last_name: "Banner",
            first_name: "Bruce",
            middle_name: "Hulk",

            username: "Worker1",
            email: "worker1@gmail.com",
            password: "Worker1ABC",

            role: "Social Development Worker",
            manager: sv1._id,
            department: deptID._id
        },
        { 
            last_name: "Stark",
            first_name: "Anthony",
            middle_name: null,

            username: "Worker2",
            email: "worker2@gmail.com",
            password: "Worker2XYZ",
            
            role: "Social Development Worker",
            manager: sv2._id,
            department: deptID._id
        },
    ]
    await Employee.insertMany(sdws);
    // console.log("Successfully added SDWs.");

    mongoose.connection.close();
}

populateEmployee();