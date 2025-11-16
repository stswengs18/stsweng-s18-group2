const mongoose = require('mongoose');

/**
 * Checks if a user has access to a specific case based on their role
 * @param {Object} user - The user object from session
 * @param {Object} sponsoredMember - The sponsored member (case) object
 * @returns {Object} - { authorized: boolean, error: string|null }
 */
const checkCaseAccess = (user, sponsoredMember) => {
    // Check if user exists
    if (!user) {
        return {
            authorized: false,
            error: "Authentication required.",
            statusCode: 401
        };
    }

    // Check if sponsored member exists
    if (!sponsoredMember) {
        return {
            authorized: false,
            error: "Case not found.",
            statusCode: 404
        };
    }

    // Authorization logic based on role
    switch (user.role) {
        case 'head':
            // Head can access any case
            return { authorized: true, error: null };

        case 'supervisor':
            // Supervisor can access cases in their SPU
            if (sponsoredMember.spu !== user.spu_id) {
                return {
                    authorized: false,
                    error: "Access denied. Case is not in your SPU.",
                    statusCode: 403,
                    details: {
                        userSpu: user.spu_id,
                        caseSpu: sponsoredMember.spu
                    }
                };
            }
            return { authorized: true, error: null };

        case 'sdw':
            // SDWs can access cases assigned to them
            if (!sponsoredMember.assigned_sdw || 
                sponsoredMember.assigned_sdw.toString() !== user._id.toString()) {
                return {
                    authorized: false,
                    error: "Access denied. Case is not assigned to you.",
                    statusCode: 403,
                    details: {
                        assignedSdw: sponsoredMember.assigned_sdw,
                        currentUser: user._id
                    }
                };
            }
            return { authorized: true, error: null };

        default:
            return {
                authorized: false,
                error: "Access denied. Invalid user role.",
                statusCode: 403,
                details: { userRole: user.role }
            };
    }
};

/** 
 * Middleware to require case access for specific routes
 * 
 * @returns {Function} - Next middleware function or error response
 */
const requireCaseAccess = async (req, res, next) => {
    try {
        const user = req.session?.user;
        const caseId = req.params.id || req.params.caseId || req.body.caseId;
        
        // Get the sponsored member
        const Sponsored_Member = require('../model/sponsored_member');
        const sponsoredMember = await Sponsored_Member.findById(caseId);
        
        const authResult = checkCaseAccess(user, sponsoredMember);
        
        if (!authResult.authorized) {
            return res.status(authResult.statusCode).json({
                message: authResult.error,
                details: authResult.details
            });
        }

        next();
    } catch (error) {
        console.error('Case authorization error:', error);
        return res.status(500).json({ message: "Authorization server error" });
    }
};

module.exports = {
    checkCaseAccess,
    requireCaseAccess,
};