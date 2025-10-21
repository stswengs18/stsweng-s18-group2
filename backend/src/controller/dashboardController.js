const Sponsored_Member = require('../model/sponsored_member');

/**
 *   DASHBOARD CONTROLLER
 *        > handles viewing of dashboard
 */

// ================================================== //

/**
 *   Renders the home page
 *        > handles filters 
 *        > must depend on the signed in user
 *             > ADMIN: can see all client
 *             > SUPERVISOR: --
 *             > SDW: --
 */
const renderHomePage = async (req, res) => {
     // code here
}

const getActiveCasesCount = async (req, res) => {
    try {
        const activeCasesCount = await Sponsored_Member.countDocuments({ is_active: true });
        res.status(200).json({ activeCases: activeCasesCount });
    } catch (error) {
        console.error("Error fetching active cases count:", error);
        res.status(500).json({ message: "Error fetching active cases count", error: error.message });
    }
};

const getClosedCasesCount = async (req, res) => {
    try {
        const closedCasesCount = await Sponsored_Member.countDocuments({ is_active: false });
        res.status(200).json({ closedCases: closedCasesCount });
    } catch (error) {
        console.error("Error fetching closed cases count:", error);
        res.status(500).json({ message: "Error fetching closed cases count", error: error.message });
    }
};

module.exports = {
    renderHomePage,
    getActiveCasesCount,
    getClosedCasesCount
};
