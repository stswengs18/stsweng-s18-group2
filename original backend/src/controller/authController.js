/**
 *   AUTHENTICATION CONTROLLER
 *        > handles login, logout, and signup
 */
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Employee = require('../model/employee');

// ================================================== //

/**
 *   Renders the log in page
 */
const renderLoginPage = async (req, res) => {
     // code here
}

/**
 *   Handles logging in, username and password must match
 *   @returns  active_user : an Employee object (if success)
 *             errorMsg if fail
 */
const loginUser = async (req, res) => {
     try {
          const { username, password, rememberMe } = req.body;

          // console.log("Incoming username:", username);
          // console.log("Incoming password:", password);


          const active_user = await Employee.findOne({ username }).populate('spu_id');
          if (!active_user) {
               return res.status(401).json({ errorMsg: "Username does not exist." });
          }

          // console.log("CURRENT USER", active_user);

          const isPasswordValid = await bcrypt.compare(password, active_user.password);
          if (!isPasswordValid) {
               return res.status(401).json({ errorMsg: "Username and password do not match." });
          }

          const userForSession = {
               ...active_user.toObject(),
               spu_id: active_user.spu_id?._id || null,
               spu_name: active_user.spu_id?.spu_name || null
          };
          
          req.session.user = userForSession;
          console.log("session saved ",req.session.user);
          if (rememberMe) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
          } 
          return res.status(200).json(userForSession);
     } catch (error) {
          console.error("Login error:", error);
          return res.status(500).json({ errorMsg: "An error occurred. Please refresh and try again." });
     }
};

/**
 *   Handles log out feature
 *   @returns true
 */
const logoutUser = async (req, res) => {
     req.session.destroy();
     res.clearCookie('connect.sid');
     return res.status(200).json(true);
};



module.exports = {
     loginUser,
     logoutUser,
};

