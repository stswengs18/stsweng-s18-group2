const Employee = require('../model/employee');
const Sponsored_Member = require('../model/sponsored_member');
const Case_Closure = require('../model/case_closure');
const Intervention_Correspondence = require('../model/intervention_correspondence');
const Intervention_Counseling = require('../model/intervention_counseling');
const Intervention_Financial = require('../model/intervention_financial');
const Intervention_Homevisit = require('../model/intervention_homevisit');
const Spu = require('../model/spu');
const Progress_Report = require('../model/progress_report');

const mongoose = require('mongoose');

//case demographic
const Family_Member = require('../model/family_member');
const Family_Relationship = require('../model/family_relationship');

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
        const filter = { is_active: true };
        if (req.query.spuId) {
            filter.spu = req.query.spuId;
        }
        const activeCasesCount = await Sponsored_Member.countDocuments(filter);
        res.status(200).json({ activeCases: activeCasesCount });
    } catch (error) {
        console.error("Error fetching active cases count:", error);
        res.status(500).json({ message: "Error fetching active cases count", error: error.message });
    }
};

const getClosedCasesCount = async (req, res) => {
    try {
        const filter = { is_active: false };
        if (req.query.spuId) {
            filter.spu = req.query.spuId;
        }
        const closedCasesCount = await Sponsored_Member.countDocuments(filter);
        res.status(200).json({ closedCases: closedCasesCount });
    } catch (error) {
        console.error("Error fetching closed cases count:", error);
        res.status(500).json({ message: "Error fetching closed cases count", error: error.message });
    }
};

const getInterventionCorrespondenceCount = async (req, res) => {
    try {
        const rawDays = req.query.days;
        const spuId = req.query.spuId || '';
        const now = new Date();
        const daysNum = rawDays === undefined ? 0 : Number(rawDays);
        const hasWindow = Number.isFinite(daysNum) && daysNum > 0;

        const filter = {};
        if (spuId) {
            if (!mongoose.Types.ObjectId.isValid(spuId)) {
                return res.status(400).json({ message: 'Invalid spuId' });
            }
            filter.spu = new mongoose.Types.ObjectId(spuId);
        }
        if (hasWindow) {
            const cutoff = new Date(now.getTime() - daysNum * 24 * 60 * 60 * 1000);
            filter.createdAt = { $gte: cutoff, $lte: now };
        }

        const count = await Intervention_Correspondence.countDocuments(filter);
        res.status(200).json({ interventionCorrespondenceCount: count });
    } catch (error) {
        console.error("Error fetching intervention correspondence count:", error);
        res.status(500).json({ message: "Error fetching intervention correspondence count", error: error.message });
    }
};

const getInterventionCounselingCount = async (req, res) => {
    try {
        const rawDays = req.query.days;
        const spuId = req.query.spuId || '';
        const now = new Date();
        const daysNum = rawDays === undefined ? 0 : Number(rawDays);
        const hasWindow = Number.isFinite(daysNum) && daysNum > 0;

        const filter = {};
        if (spuId) {
            if (!mongoose.Types.ObjectId.isValid(spuId)) {
                return res.status(400).json({ message: 'Invalid spuId' });
            }
            filter.spu = new mongoose.Types.ObjectId(spuId);
        }
        if (hasWindow) {
            const cutoff = new Date(now.getTime() - daysNum * 24 * 60 * 60 * 1000);
            filter.createdAt = { $gte: cutoff, $lte: now };
        }

        const count = await Intervention_Counseling.countDocuments(filter);
        res.status(200).json({ interventionCounselingCount: count });
    } catch (error) {
        console.error("Error fetching intervention counseling count:", error);
        res.status(500).json({ message: "Error fetching intervention counseling count", error: error.message });
    }
};

const getInterventionFinancialCount = async (req, res) => {
    try {
        const rawDays = req.query.days;
        const spuId = req.query.spuId || '';
        const now = new Date();
        const daysNum = rawDays === undefined ? 0 : Number(rawDays);
        const hasWindow = Number.isFinite(daysNum) && daysNum > 0;

        const filter = {};
        if (spuId) {
            if (!mongoose.Types.ObjectId.isValid(spuId)) {
                return res.status(400).json({ message: 'Invalid spuId' });
            }
            filter.spu = new mongoose.Types.ObjectId(spuId);
        }
        if (hasWindow) {
            const cutoff = new Date(now.getTime() - daysNum * 24 * 60 * 60 * 1000);
            filter.createdAt = { $gte: cutoff, $lte: now };
        }

        const count = await Intervention_Financial.countDocuments(filter);
        res.status(200).json({ interventionFinancialCount: count });
    } catch (error) {
        console.error("Error fetching intervention financial count:", error);
        res.status(500).json({ message: "Error fetching intervention financial count", error: error.message });
    }
};

const getInterventionHomeVisitCount = async (req, res) => {
    try {
        const rawDays = req.query.days;
        const spuId = req.query.spuId || '';

        console.log("Received request for Intervention Home Visit Count with spuId:", spuId, "and days:", rawDays);

        // Use UTC "now" for consistent filtering
        const now = new Date();
        const daysNum = rawDays === undefined ? 0 : Number(rawDays);
        const hasWindow = Number.isFinite(daysNum) && daysNum > 0;

        const filter = {};
        if (spuId) {
            if (!mongoose.Types.ObjectId.isValid(spuId)) {
                return res.status(400).json({ message: 'Invalid spuId' });
            }
            filter.spu = new mongoose.Types.ObjectId(spuId);
        }
        if (hasWindow) {
            // Use UTC for cutoff and now
            const cutoff = new Date(now.getTime() - daysNum * 24 * 60 * 60 * 1000);
            filter.createdAt = { $gte: cutoff, $lte: now };
        }

        // Debug: log filter and now
        console.log("HomeVisit filter:", filter, "now:", now.toISOString());

        const count = await Intervention_Homevisit.countDocuments(filter);
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
    const { spuId } = req.query;

    const employeeFilter = { role: "sdw", is_active: true };
    const caseFilter = { is_active: true };

    if (spuId) {
      employeeFilter.spu_id = spuId;
      caseFilter.spu = spuId;
    }

    const [workerCount, caseCount] = await Promise.all([
      Employee.countDocuments(employeeFilter),
      Sponsored_Member.countDocuments(caseFilter)
    ]);

    res.status(200).json({
      spuId: spuId || "all",
      workers: workerCount,
      cases: caseCount,
      ratio: workerCount > 0 ? (caseCount / workerCount).toFixed(2) : "N/A"
    });
  } catch (error) {
    console.error("Error fetching worker-to-case ratio:", error);
    res.status(500).json({ message: "Error fetching worker-to-case ratio", error: error.message });
  }
};

const getWorkerToSupervisorRatio = async (req, res) => {
  try {
    const { spuId } = req.query;

    const workerFilter = { role: "sdw", is_active: true };
    const supervisorFilter = { role: "supervisor", is_active: true };

    if (spuId) {
      workerFilter.spu_id = spuId;
      supervisorFilter.spu_id = spuId;
    }

    const [workerCount, supervisorCount] = await Promise.all([
      Employee.countDocuments(workerFilter),
      Employee.countDocuments(supervisorFilter)
    ]);

    res.status(200).json({
      spuId: spuId || "all",
      workers: workerCount,
      supervisors: supervisorCount,
      ratio: supervisorCount > 0 ? (workerCount / supervisorCount).toFixed(2) : "N/A"
    });
  } catch (error) {
    console.error("Error fetching worker-to-supervisor ratio:", error);
    res.status(500).json({ message: "Error fetching worker-to-supervisor ratio", error: error.message });
  }
};

const getEmployeeCountsByRole = async (req, res) => {
  try {
    const { spuId } = req.query;
    const rawDays = req.query.days;
    const now = new Date();

    // Same window handling pattern as your other endpoints
    const daysNum = rawDays === undefined ? 0 : Number(rawDays);
    const hasWindow = Number.isFinite(daysNum) && daysNum > 0;

    // Base match: limit by SPU if provided
    const matchFilter = {};
    if (spuId) matchFilter.spu_id = spuId;

    // If a time window is requested, count only NEW employees in that window
    // (i.e., hired/created within the last N days)
    if (hasWindow) {
      const cutoff = new Date(now.getTime() - daysNum * 24 * 60 * 60 * 1000);
      matchFilter.createdAt = { $gte: cutoff, $lte: now };
    }

    const roleCounts = await Employee.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    const roles = roleCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const total = Object.values(roles).reduce((a, b) => a + b, 0);

    res.status(200).json({
      spuId: spuId || "all",
      window: hasWindow
        ? {
            days: daysNum,
            from: new Date(now.getTime() - daysNum * 24 * 60 * 60 * 1000).toISOString(),
            to: now.toISOString(),
          }
        : null, // no window => all-time counts
      total,     // total new employees in window (or all-time if no window)
      roles      // { sdw: X, supervisor: Y, head: Z, ... }
    });
  } catch (error) {
    console.error("Error fetching employee counts by role:", error);
    res.status(500).json({ message: "Error fetching employee counts by role", error: error.message });
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
    // Accept caseIds from query or body (comma-separated or array)
    let caseIds = [];
    if (req.body.caseIds && Array.isArray(req.body.caseIds)) {
      caseIds = req.body.caseIds;
    } else if (req.query.caseIds) {
      caseIds = Array.isArray(req.query.caseIds)
        ? req.query.caseIds
        : String(req.query.caseIds).split(',').map(id => id.trim());
    }

    // If no caseIds provided, fallback to all active cases
    if (caseIds.length === 0) {
      const cases = await Sponsored_Member.find({ is_active: true }, '_id');
      caseIds = cases.map(c => c._id);
    }

    if (caseIds.length === 0) {
      return res.status(200).json({ averageFamilyIncome: 0 });
    }

    // Convert to ObjectId if needed
    caseIds = caseIds.map(id => mongoose.Types.ObjectId(id));

    const result = await Family_Member.aggregate([
      { $match: { sponsored_member_id: { $in: caseIds }, income: { $gt: 0 } } },
      { $group: { _id: "$sponsored_member_id", totalIncome: { $sum: "$income" } } }
    ]);

    if (result.length === 0) {
      return res.status(200).json({ averageFamilyIncome: 0 });
    }

    const totalIncome = result.reduce((sum, fam) => sum + fam.totalIncome, 0);
    const averageIncome = totalIncome / caseIds.length;
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

const getPeriodCases = async (req, res) => {
  try {
    const rawDays = req.query.days;
    const spuId   = req.query.spuId || '';

    const now = new Date();                         // what the server thinks "now" is
    const daysNum = rawDays === undefined ? 0 : Number(rawDays);
    const hasWindow = Number.isFinite(daysNum) && daysNum > 0;

    const filter = { is_active: true };             // active only
    if (spuId) {
      if (!mongoose.Types.ObjectId.isValid(spuId)) {
        return res.status(400).json({ message: 'Invalid spuId' });
      }
      filter.spu = new mongoose.Types.ObjectId(spuId);
    }

    if (hasWindow) {
      const cutoff = new Date(now.getTime() - daysNum * 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: cutoff, $lte: now };
    }

    const cases = await Sponsored_Member.find(filter).lean();

    return res.status(200).json({
      cases,
      meta: {
        matched: cases.length,
        received: { spuId, rawDays, daysNum, hasWindow },
        serverClock: now.toISOString(),
        appliedFilter: filter,
        // show 3 example createdAt’s to eyeball
        sampleCreatedAt: cases.slice(0,3).map(c => c.createdAt),
      },
    });
  } catch (error) {
    console.error('Error fetching period cases:', error);
    res.status(500).json({ message: 'Error fetching period cases', error: error.message });
  }
};

const getProgressReportCount = async (req, res) => {
    try {
        const rawDays = req.query.days;
        const spuId = req.query.spuId || '';

        console.log("Received request for Progress Report Count with spuId:", spuId, "and days:", rawDays);

        const now = new Date();
        const daysNum = rawDays === undefined ? 0 : Number(rawDays);
        const hasWindow = Number.isFinite(daysNum) && daysNum > 0;

        const filter = {};
        // If you want to filter by SPU, you need to join Sponsored_Member (not direct in Progress_Report)
        // If Progress_Report has a reference to Sponsored_Member, e.g. progress_report.sponsored_member_id
        if (spuId) {
            if (!mongoose.Types.ObjectId.isValid(spuId)) {
                return res.status(400).json({ message: 'Invalid spuId' });
            }
            filter.sponsored_member_id = new mongoose.Types.ObjectId(spuId);
        }
        if (hasWindow) {
            const cutoff = new Date(now.getTime() - daysNum * 24 * 60 * 60 * 1000);
            filter.createdAt = { $gte: cutoff, $lte: now };
        }

        console.log("ProgressReport filter:", filter, "now:", now.toISOString());

        const count = await Progress_Report.countDocuments(filter);
        res.status(200).json({ progressReportCount: count });
    } catch (error) {
        console.error("Error fetching progress report count:", error);
        res.status(500).json({ message: "Error fetching progress report count", error: error.message });
    }
};

const getFamilyDetails = async (req, res) => {
  try {
    // 1) Parse caseIds from body or query
    let caseIds = [];
    if (Array.isArray(req.body?.caseIds)) caseIds = req.body.caseIds;
    else if (req.query.caseIds) {
      caseIds = Array.isArray(req.query.caseIds)
        ? req.query.caseIds
        : String(req.query.caseIds).split(',').map(s => s.trim());
    }

    if (caseIds.length === 0) {
      return res.status(200).json({ averageFamilyIncome: 0, averageFamilyMembers: 0 });
    }

    // 2) Normalize to ObjectId
    const caseObjectIds = caseIds
      .map(id => {
        try { return new mongoose.Types.ObjectId(id); } catch { return null; }
      })
      .filter(Boolean);

    if (caseObjectIds.length === 0) {
      return res.status(200).json({ averageFamilyIncome: 0, averageFamilyMembers: 0 });
    }

    // 3) Aggregate via Family Relationship → Family Member
    // Only count members where status is "Living"
    const groups = await Family_Relationship.aggregate([
      { $match: { sponsor_id: { $in: caseObjectIds } } },
      {
        $lookup: {
          from: 'family members',
          localField: 'family_id',
          foreignField: '_id',
          as: 'member'
        }
      },
      { $unwind: '$member' },
      { $match: { 'member.status': 'Living' } }, // Only living members
      {
        $group: {
          _id: '$sponsor_id',
          membersCount: { $sum: 1 },
          totalIncome: {
            $sum: {
              $cond: [
                { $and: [ { $gt: ['$member.income', 0] }, { $eq: ['$member.status', 'Living'] } ] },
                '$member.income',
                0
              ]
            }
          }
        }
      }
    ]);

    // 4) Post-process to include cases with 0 relationships
    const membersByCase = new Map(groups.map(g => [String(g._id), g.membersCount]));
    const incomeByCase  = new Map(groups.map(g => [String(g._id), g.totalIncome]));

    let totalMembers = 0;
    let incomeCasesCount = 0;  // number of cases where totalIncome > 0
    let totalIncomeAllIncomeCases = 0;

    for (const id of caseObjectIds) {
      const key = String(id);
      const members = membersByCase.get(key) || 0;
      totalMembers += members;

      const inc = incomeByCase.get(key) || 0;
      if (inc > 0) {
        incomeCasesCount += 1;
        totalIncomeAllIncomeCases += inc;
      }
    }

    const averageFamilyMembers =
      caseObjectIds.length > 0 ? Number((totalMembers / caseObjectIds.length).toFixed(2)) : 0;

    const averageFamilyIncome =
      incomeCasesCount > 0 ? Number((totalIncomeAllIncomeCases / incomeCasesCount).toFixed(2)) : 0;

    return res.status(200).json({
      averageFamilyMembers,
      averageFamilyIncome
    });
  } catch (error) {
    console.error('Error fetching family details:', error);
    return res.status(500).json({ message: 'Error calculating family details', error: error.message });
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
    getEmployeeCountsByRole,
    getAverageInterventionsPerCase,
    //case demographics
    getGenderDistribution,
    getAverageAge,
    getAverageFamilySizeByLastName,
    getAverageFamilyIncome,
    getAverageInterventionsPerCase,
    getAverageCaseDuration,
    getPeriodCases,
    getProgressReportCount,
    getFamilyDetails,
};
