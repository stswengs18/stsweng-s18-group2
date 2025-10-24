const Sponsored_Member = require('../model/sponsored_member');
const Case_Closure = require('../model/case_closure');
const Intervention_Correspondence = require('../model/intervention_correspondence');
const Intervention_Counseling = require('../model/intervention_counseling');
const Intervention_Financial = require('../model/intervention_financial');
const Intervention_Homevisit = require('../model/intervention_homevisit');
const Spu = require('../model/spu');
//case demographic
const Family_Member = require('../model/family_member');



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

//case demographic routes
// 1. Gender Distribution
const getGenderDistribution = async (req, res) => {
  try {
    const maleCount = await Sponsored_Member.countDocuments({ sex: 'Male', is_active: true });
    const femaleCount = await Sponsored_Member.countDocuments({ sex: 'Female', is_active: true });
    res.status(200).json({ male: maleCount, female: femaleCount });
  } catch (error) {
    console.error("Error fetching gender distribution:", error);
    res.status(500).json({ message: "Error fetching gender data", error: error.message });
  }
};

// 2. Average Age of Clients
const getAverageAge = async (req, res) => {
  try {
    const clients = await Sponsored_Member.find({ is_active: true }, 'dob');
    if (clients.length === 0) {
      return res.status(200).json({ averageAge: 0 });
    }

    const now = new Date();
    const totalAge = clients.reduce((sum, client) => {
      const dob = new Date(client.dob);
      let age = now.getFullYear() - dob.getFullYear();
      const m = now.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
      return sum + age;
    }, 0);

    const averageAge = totalAge / clients.length;
    res.status(200).json({ averageAge: parseFloat(averageAge.toFixed(1)) });
  } catch (error) {
    console.error("Error fetching average age:", error);
    res.status(500).json({ message: "Error calculating average age", error: error.message });
  }
};

// 3. Average Number of Family Members per Case
const getAverageFamilySizeByLastName = async (req, res) => {
  try {
    const result = await Family_Member.aggregate([
      {
        $group: {
          _id: '$last_name',        
          count: { $sum: 1 }        
        }
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$count' } 
        }
      }
    ]);

    const average = result.length > 0 ? result[0].average : 0;
    res.status(200).json({ averageFamilySize: parseFloat(average.toFixed(1)) || 0 });
  } catch (error) {
    console.error('Error calculating average family size by last name:', error);
    res.status(500).json({ message: 'Failed to compute average family size' });
  }
};

// 4. Average Family Income (only earners: income > 0)
const getAverageFamilyIncome = async (req, res) => {
  try {
    const cases = await Sponsored_Member.find({ is_active: true }, '_id');
    if (cases.length === 0) {
      return res.status(200).json({ averageFamilyIncome: 0 });
    }

    const caseIds = cases.map(c => c._id);
    const result = await Family_Member.aggregate([
      { $match: { sponsored_member_id: { $in: caseIds }, income: { $gt: 0 } } },
      { $group: { _id: "$sponsored_member_id", totalIncome: { $sum: "$income" } } }
    ]);

    if (result.length === 0) {
      return res.status(200).json({ averageFamilyIncome: 0 });
    }

    const totalIncome = result.reduce((sum, fam) => sum + fam.totalIncome, 0);
    const averageIncome = totalIncome / cases.length;
    res.status(200).json({ averageFamilyIncome: parseFloat(averageIncome.toFixed(2)) });
  } catch (error) {
    console.error("Error fetching average family income:", error);
    res.status(500).json({ message: "Error calculating family income", error: error.message });
  }
};

// 5. Average Number of Interventions per Case
const getAverageInterventionsPerCase = async (req, res) => {
  try {
    const cases = await Sponsored_Member.find({ is_active: true }, 'interventions');
    if (cases.length === 0) {
      return res.status(200).json({ averageInterventions: 0 });
    }

    const totalInterventions = cases.reduce((sum, c) => sum + (c.interventions?.length || 0), 0);
    const average = totalInterventions / cases.length;
    res.status(200).json({ averageInterventions: parseFloat(average.toFixed(1)) });
  } catch (error) {
    console.error("Error fetching average interventions:", error);
    res.status(500).json({ message: "Error calculating interventions per case", error: error.message });
  }
};

// 6. Average Case Time Length in days (need updated model from branch creationdate)
const getAverageCaseDuration = async (req, res) => {
  try {
    const activeCases = await Sponsored_Member.find({ is_active: true }, 'createdAt');
    const closedCases = await Case_Closure.find({}).populate({
      path: 'case_id',
      select: 'createdAt',
      model: 'Sponsored Member'
    });

    const durations = [];

    activeCases.forEach(c => {
      const durationMs = Date.now() - new Date(c.createdAt).getTime();
      durations.push(durationMs / (1000 * 60 * 60 * 24)); 
    });

    closedCases.forEach(cc => {
      if (cc.case_id && cc.createdAt) {
        const start = new Date(cc.case_id.createdAt);
        const end = new Date(cc.createdAt);
        if (start && end && end > start) {
          const durationMs = end - start;
          durations.push(durationMs / (1000 * 60 * 60 * 24)); 
        }
      }
    });

    if (durations.length === 0) {
      return res.status(200).json({ averageCaseDurationDays: 0 });
    }

    const avgDays = durations.reduce((a, b) => a + b, 0) / durations.length;
    res.status(200).json({ averageCaseDurationDays: parseFloat(avgDays.toFixed(1)) });
  } catch (error) {
    console.error("Error fetching average case duration:", error);
    res.status(500).json({ message: "Error calculating case duration", error: error.message });
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
    //case demographics
    getGenderDistribution,
    getAverageAge,
    getAverageFamilySizeByLastName,
    getAverageFamilyIncome,
    getAverageInterventionsPerCase,
    getAverageCaseDuration
};
