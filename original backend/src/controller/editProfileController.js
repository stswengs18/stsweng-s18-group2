const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Employee = require("../model/employee");
/**
 * Updates an employee's account information.
 * 
 * @route PUT /api/profile/edit/:id
 * 
 * Precondition(s):
 * - User must be authenticated.
 * - User can only edit their own account or must have Head role to edit others.
 * 
 * @params
 * - id: The MongoDB ObjectId of the employee to edit (URL parameter).
 * - username: The updated username for the employee account.
 * - email: The updated email address for the employee.
 * - contact_number: The updated contact number for the employee.
 * - spu_id (optional): The updated SPU ID (must be one of the valid SPUs).
 * - first_name: The updated first name of the employee.
 * - last_name: The updated last name of the employee.
 * - middle_name (optional): The updated middle name of the employee.
 * - password (optional): The new password (minimum 8 characters).
 * 
 * @returns
 * - 200 OK: If the account is updated successfully.
 * - 400 Bad Request: If required fields are missing, username already exists, or SPU is invalid.
 * - 403 Forbidden: If the user doesn't have permission to edit this account.
 * - 404 Not Found: If the employee account to edit doesn't exist.
 * - 500 Internal Server Error: If there is an error during the update process.
 * 
 */
const editAccount = async (req, res) => {
    try {
        const { id } = req.params; // Get user ID from URL parameter
        const { 
            username, 
            email, 
            contact_number, 
            spu_id, 
            first_name, 
            last_name, 
            middle_name 
        } = req.body;
        const loggedInUser = req.session?.user || req.user;
        
        if (loggedInUser.role !== "head" && loggedInUser._id !== id) {
            return res.status(403).json({ message: "You don't have permission to edit this account." });
        }
    

        const userToEdit = await Employee.findById(id).populate('spu');
        if (!userToEdit) {
            return res.status(404).json({ message: "User not found." });
        }
    

        if (!username || username.trim() === '') {
            return res.status(400).json({ message: "Username is required." });
        }
        
        if (!email || email.trim() === '') {
            return res.status(400).json({ message: "Email is required." });
        }
        
        if (!contact_number || contact_number.trim() === '') {
            return res.status(400).json({ message: "Contact number is required." });
        }
        if (!/^\d{11}$/.test(contact_number)) {
            return res.status(400).json({ message: "Contact number must be exactly 11 numerical digits." });
        }   
        if (!first_name || first_name.trim() === '') {
            return res.status(400).json({ message: "First name is required." });
        }
        
        if (!last_name || last_name.trim() === '') {
            return res.status(400).json({ message: "Last name is required." });
        }


        if (username !== userToEdit.username) {
            const existingUser = await Employee.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists." });
            }
        }


        let spuUpdate = {};
        if (spu_id) {
            const spuObject = await Spu.findOne({ spu_name: spu_id });
            if (!spuObject) {
                return res.status(400).json({ message: "SPU not found." });
            }
            spuUpdate = { spu: spuObject._id };
        }


        let passwordUpdate = {};

        if ('password' in req.body) {
            if (req.body.password.trim() === '') {
                return res.status(400).json({ message: "Password cannot be empty." });
            } else if (req.body.password.length < 8) {
                return res.status(400).json({ message: "Password must be at least 8 characters long." });
            } else {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
                passwordUpdate = { password: hashedPassword };
            }
        }

        const updatedUser = await Employee.findByIdAndUpdate(id, {
            username,
            email,
            contact_number,
            first_name,
            last_name,
            ...(middle_name !== undefined && { middle_name }),
            ...spuUpdate,
            ...passwordUpdate
        },
        {new: true});

        return res.status(200).json({ message: "Account updated successfully." , updatedUser });
    } catch (error) {
        console.error("Error updating account:", error);
        return res.status(500).json({ message: "Internal server error." , });
    }
};

module.exports = {
    editAccount
};