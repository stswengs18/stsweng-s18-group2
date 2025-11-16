const express = require('express');
const router = express.Router();
const Employee = require('../model/employee');
const editProfileController = require('../controller/editProfileController.js')


//hardcoded for testing,,, not sure if this was implemnted already
const authenticateToken = (req, res, next) => {
    // For testing
    if (req.headers['x-test-user-id'] && req.headers['x-test-user-role']) {
        req.user = {
            _id: req.headers['x-test-user-id'],
            role: req.headers['x-test-user-role']
        };
    } else {
        // For now, using mock data
        req.user = { 
            _id: '686e92a03c1f53d3ee65962b', 
            role: 'head' 
        }; 
    }
    next(); 
};


router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await Employee.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
router.put('/edit/:id', authenticateToken, editProfileController.editAccount);

module.exports = router;