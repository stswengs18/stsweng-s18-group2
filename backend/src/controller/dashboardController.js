const Employee = require('../model/employee');
const Sponsored_Member = require('../model/sponsored_member');
const Case_Closure = require('../model/case_closure');
const Intervention_Correspondence = require('../model/intervention_correspondence');
const Intervention_Counseling = require('../model/intervention_counseling');
const Intervention_Financial = require('../model/intervention_financial');
const Intervention_Homevisit = require('../model/intervention_homevisit');
const Spu = require('../model/spu');

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

const getInterventionCounselingCount = async (req, res) => {
    try {
        const count = await Intervention_Counseling.countDocuments({});
        res.status(200).json({ interventionCounselingCount: count });
    } catch (error) {
        console.error("Error fetching intervention counseling count:", error);
        res.status(500).json({ message: "Error fetching intervention counseling count", error: error.message });
    }
};

const getInterventionFinancialCount = async (req, res) => {
    try {
        const count = await Intervention_Financial.countDocuments({});
        res.status(200).json({ interventionFinancialCount: count });
    } catch (error) {
        console.error("Error fetching intervention financial count:", error);
        res.status(500).json({ message: "Error fetching intervention financial count", error: error.message });
    }
};

const getInterventionHomeVisitCount = async (req, res) => {
    try {
        const count = await Intervention_Homevisit.countDocuments({});
        res.status(200).json({ interventionHomeVisitCount: count });
    } catch (error) {
        console.error("Error fetching intervention home visit count:", error);
        res.status(500).json({ message: "Error fetching intervention home visit count", error: error.message });
    }
};

const getActiveCasesPerSpu = async (req, res) => {
    try {
        const spus = await Spu.find({ is_active: true });
        const activeCasesPerSpu = await Promise.all(
            spus.map(async (spu) => {
                const count = await Sponsored_Member.countDocuments({ spu: spu._id, is_active: true });
                return { spu_name: spu.spu_name, count };
            })
        );
        res.status(200).json(activeCasesPerSpu);
    } catch (error) {
        console.error("Error fetching active cases per SPU:", error);
        res.status(500).json({ message: "Error fetching active cases per SPU", error: error.message });
    }
};

const getWorkerToCaseRatio = async (req, res) => {
    try {
        const workerCount = await Employee.countDocuments({ role: "sdw" });
        const caseCount = await Sponsored_Member.countDocuments({ is_active: true });
        res.status(200).json({
            workers: workerCount,
            cases: caseCount,
        });
    } catch (error) {
        console.error("Error fetching worker to case ratio:", error);
        res.status(500).json({ message: "Error fetching worker to case ratio", error: error.message });
    }
};

const getWorkerToSupervisorRatio = async (req, res) => {
    try {
        const workerCount = await Employee.countDocuments({ role: "sdw" });
        const supervisorCount = await Employee.countDocuments({ role: "supervisor" }); // Assuming "supervisor" is the role
        res.status(200).json({
            workers: workerCount,
            supervisors: supervisorCount,
        });
    } catch (error) {
        console.error("Error fetching worker to supervisor ratio:", error);
        res.status(500).json({ message: "Error fetching worker to supervisor ratio", error: error.message });
    }
};

const getNewEmployeesLast30Days = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newEmployeesCount = await Employee.countDocuments({
            _id: { $gte: thirtyDaysAgo.toISOString() } // ObjectId contains timestamp
        });

        res.status(200).json({ newEmployeesLast30Days: newEmployeesCount });
    } catch (error) {
        console.error("Error fetching new employees for the last 30 days:", error);
        res.status(500).json({ message: "Error fetching new employees for the last 30 days", error: error.message });
    }
};



const getEmployeeCountsByRole = async (req, res) => {
    try {
        const roleCounts = await Employee.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const formattedCounts = roleCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        res.status(200).json(formattedCounts);
    } catch (error) {
        console.error("Error fetching employee counts by role:", error);
        res.status(500).json({ message: "Error fetching employee counts by role", error: error.message });
    }
};

const getAverageInterventionsPerCase = async (req, res) => {
    try {
        const cases = await Sponsored_Member.find({});
        let totalInterventions = 0;
        let totalCases = cases.length;

        if (totalCases === 0) {
            return res.status(200).json({ averageInterventionsPerCase: 0 });
        }

        cases.forEach(caseItem => {
            totalInterventions += caseItem.interventions.length;
        });

        const average = totalInterventions / totalCases;
        res.status(200).json({ averageInterventionsPerCase: average });
    } catch (error) {
        console.error("Error fetching average interventions per case:", error);
        res.status(500).json({ message: "Error fetching average interventions per case", error: error.message });
    }
};

module.exports = {
    renderHomePage,
    getActiveCasesCount,
    getClosedCasesCount,
    getInterventionCorrespondenceCount,
    getInterventionCounselingCount,
    getInterventionFinancialCount,
    getInterventionHomeVisitCount,
    getActiveCasesPerSpu,
    getWorkerToCaseRatio,
    getWorkerToSupervisorRatio,
    getNewEmployeesLast30Days,
    getEmployeeCountsByRole,
    getAverageInterventionsPerCase
};
