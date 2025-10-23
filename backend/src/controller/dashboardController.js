const Sponsored_Member = require('../model/sponsored_member');
const Case_Closure = require('../model/case_closure');
const Intervention_Correspondence = require('../model/intervention_correspondence');

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
        const closedCasesCount = await Case_Closure.countDocuments({ });
        res.status(200).json({ closedCases: closedCasesCount });
    } catch (error) {
        console.error("Error fetching closed cases count:", error);
        res.status(500).json({ message: "Error fetching closed cases count", error: error.message });
    }
};

const getInterventionCorrespondenceCount = async (req, res) => {
    try {
        const count = await Intervention_Correspondence.countDocuments({});
        res.status(200).json({ interventionCorrespondenceCount: count });
    } catch (error) {
        console.error("Error fetching intervention correspondence count:", error);
        res.status(500).json({ message: "Error fetching intervention correspondence count", error: error.message });
    }
};

module.exports = {
    renderHomePage,
    getActiveCasesCount,
    getClosedCasesCount,
    getInterventionCorrespondenceCount
};
