const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Employee = require("../model/employee");
const Spu = require('../model/spu')
/**
 * Creates a new account for an employee.
 * 
 * @route POST /api/create-account
 * 
 * Precondition(s):
 * - A head user is logged in.
 * 
 * @params
 * - sdw_id: The SDW ID of the employee.
 * - username: The username for the employee account.
 * - password: The password for the employee account (minimum 8 characters).
 * - email: The email address of the employee.
 * - contact_no: The contact number of the employee.
 * - spu_id: The SPU ID of the employee (must be one of the valid SPUs).
 * - role: The role of the employee (must be one of "Head", "Supervisor", or "Social Development Worker").
 * 
 * @returns
 * - 201 Created: If the account is created successfully.
 * - 400 Bad Request: If any required field is missing or invalid, if the username or SDW ID already exists, or if the password is too short.
 * - 403 Forbidden: If the logged-in user is not a head.
 * - 500 Internal Server Error: If there is an error during the account creation process.
 * 
 */
const createAccount = async (req, res) => {
    try {
        // const { sdw_id, username, password, email, contact_no, spu_id, role, manager } = req.body;
        const { username, password, email, contact_no, spu_id, role, manager, area } = req.body;
    

        // console.log("REQ.BODY", req.body);

        // Check if user is logged in
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Authentication required." });
        }

        // Check if the logged-in user is a head
        if (req.session.user.role !== "head") {
            return res.status(403).json({ message: "Only heads can create accounts." });
        }

        // Validate required fields
        if (!username || !password || !email || !contact_no || !spu_id || !role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        // Check if the username already exists
        const existingUser = await Employee.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists." });
        }

        // Check if the sdw_id already exists
        // const existingSDW = await Employee.findOne({ sdw_id });
        // if (existingSDW) {
        //     return res.status(400).json({ message: "SDW ID already exists." });
        // }

        // Validate the SPU ID
        const spu_object = await Spu.findOne({ spu_name: spu_id });
        if (!spu_object) {
            return res.status(400).json({ message: "Invalid SPU ID." });
        }


        // Validate the role
        const validRoles = ['head', 'supervisor', 'sdw'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role." });
        }

        // Set manager and validate role
        // let manager = _id; // Default to the logged-in user
        // if (role === "head") {
        //     // Head does not have a manager
        //     manager = null;
        // } else if (role === "supervisor") {
        //     // Manager is the logged-in user
        //     manager = _id;
        // } else if (role === "sdw") {
        //     // Manager is the supervisor of the SPU
        //     const supervisor = await Employee.findOne({ role: "Supervisor", spu_id });
        //     if (!supervisor) {
        //         return res.status(400).json({ message: "No supervisor found for the specified SPU." });
        //     }

        //     // Set the manager to the supervisor's ID
        //     manager = supervisor._id;
        // } else {
        //     return res.status(400).json({ message: "Invalid role." });
        // }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Create the new employee account
        const newEmployee = new Employee({
            // sdw_id,
            area,
            username,
            password: hashedPassword,
            email,
            contact_no,
            spu_id : spu_object,
            role,
            manager,
            first_name: req.body.first_name || "",
            last_name: req.body.last_name || "",
            middle_name: req.body.middle_name || "",
        });
        await newEmployee.save();

        return res.status(201).json({ message: "Account created successfully." });
    } catch (error) {
        console.error("Error creating account:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {
    createAccount,
}