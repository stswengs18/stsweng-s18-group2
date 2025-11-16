const mongoose = require('mongoose');
const Employee = require('../model/employee');
const Sponsored_Member = require('../model/sponsored_member');
const bcrypt = require('bcrypt');``
const Spu = require('../model/spu')
const Case_Closure = require('../model/case_closure')

/**
 * Fetches a single employee by its ObjectId.
 * - Requires a valid ObjectId in req.params.id
 * - Only accessible if user is authenticated
 *
 * @route   GET /api/employees/:id
 */
const getEmployeeById = async (req, res) => {
  const user = req.session ? req.session.user : req.user;
  const employeeId = req.params.id;

  // console.log("Employee fetch controller", req.params);

  // Validate session & ObjectId
  if (!user || !mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ message: "Invalid session or Employee ID." });
  }

  try {
    const employee = await Employee.findById(employeeId).populate('spu_id').lean();

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    return res.status(200).json(employee);

  } catch (error) {
    console.error('Error fetching employee:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getEmployeeByUsername = async (req, res) => {
  const user = req.session ? req.session.user : req.user;
  const username = req.params.username;

  if (!user) {
    return res.status(400).json({ message: "Invalid session." });
  }

  if (!username) {
    return res.status(400).json({ message: "Invalid Username provided." });
  }

  try {
    const employee = await Employee.findOne({ username: username }).populate('spu_id').lean();

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    return res.status(200).json(employee);

  } catch (error) {
    console.error('Error fetching employee by username:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getEmployeeBySDWId = async (req, res) => {
  const user = req.session ? req.session.user : req.user;
  const sdwId = req.params.sdw_id;

  // console.log("Employee fetch by SDW ID:", sdwId);

  if (!user) {
    return res.status(400).json({ message: "Invalid session." });
  }

  if (!sdwId || isNaN(Number(sdwId))) {
    return res.status(400).json({ message: "Invalid SDW ID provided." });
  }

  try {
    const employee = await Employee.findOne({ sdw_id: Number(sdwId) }).populate('spu_id').lean();

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    return res.status(200).json(employee);

  } catch (error) {
    console.error('Error fetching employee by SDW ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const editEmployeeCore = async (req, res) => {
  const user = req.session ? req.session.user : req.user;
  const employeeId = req.params.id;
  const updatedEmployeeData = req.body;//spu id of employee here is actually the name


  // if (!user) {
  //   return res.status(401).json({ message: "Authentication Error" });
  // }

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ message: 'Invalid employee ID format' });
  }

  try {
    const existingEmployee = await Employee.findById(employeeId);
    if (!existingEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    if (updatedEmployeeData.spu_id) {
      const spuObject = await Spu.findOne({ spu_name: updatedEmployeeData.spu_id });
      if (!spuObject) {
        return res.status(400).json({ message: 'SPU not found' });
      }
      updatedEmployeeData.spu_id = spuObject._id; // Set reference

    }
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updatedEmployeeData,
      { new: true }
    ).lean();


    if (user && user._id.toString() === employeeId) {
      req.session.user = {_id: employeeId, ...updatedEmployeeData};
    }
    
    return res.status(200).json({
      message: 'Employee updated successfully',
      employee: updatedEmployee
    });

  } catch (error) {
    console.error('Error updating employee:', error);
    return res.status(500).json({
      message: 'Failed to update employee',
      error: error.message
    });
  }
};

const editEmployeePassword = async (req, res) => {
  const employeeId = req.params.id;
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  try {
    const existingEmployee = await Employee.findById(employeeId);
    if (!existingEmployee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    existingEmployee.password = hashedPassword;
    await existingEmployee.save();

    return res.status(200).json({ message: 'Password updated successfully.' });

  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ message: 'Failed to update password.', error: error.message });
  }
};

module.exports = {
  editEmployeePassword
};

/**
 * Retrieves all active sponsored members and all employees for the Head view.
 * - Only accessible by users with the 'Head' role.
 * - Returns simplified lists of sponsored members and employees.
 * - Each sponsored member includes assigned SDW info if available.
 * - Each employee includes basic identifying info and role.
 * 
 * @param {Object} req - Express request object, expects user session or user object.
 * @param {Object} res - Express response object, used to send JSON data or error.
 * @returns {Object} JSON response with 'cases' (sponsored members) and 'employees' arrays.
 */
// controller/employeeFetchController.js
const getHeadView = async (req, res) => {
  const rawUser = req.user || (req.session && req.session.user) || null;

  try {
    if (!rawUser) return res.status(401).json({ message: "Authentication Error" });

    const role = String(rawUser.role || '').trim().toLowerCase();
    if (role !== 'head') {
      return res.status(403).json({ message: "Permission Error: Head access required" });
    }

    const cases = await Sponsored_Member.find({ is_active: true })
      .populate('assigned_sdw', 'first_name middle_name last_name')
      .populate('spu', 'spu_name')  // _id is included automatically
      .lean();

    const employees = await Employee.find({})
      .populate('spu_id', 'spu_name') // _id is included automatically
      .lean();

    const simplifiedCases = cases.map(c => ({
      id: c._id,
      name: `${c.first_name} ${c.middle_name || ''} ${c.last_name}`.trim(),
      sm_number: c.sm_number,
      spu_id: c.spu?._id ?? null,               // <— added
      spu: c.spu?.spu_name ?? null,
      is_active: c.is_active,
      assigned_sdw: c.assigned_sdw?._id ?? null,
      assigned_sdw_name: c.assigned_sdw
        ? `${c.assigned_sdw.first_name} ${c.assigned_sdw.middle_name || ''} ${c.assigned_sdw.last_name}`.trim()
        : null
    }));

    const simplifiedEmployees = employees.map(e => ({
      id: e._id,
      name: `${e.first_name} ${e.middle_name || ''} ${e.last_name}`.trim(),
      spu_id: e.spu_id?._id ?? null,            // <— added
      spu: e.spu_id?.spu_name ?? null,
      role: e.role,
      is_active: e.is_active ?? true
    }));

    return res.status(200).json({
      cases: simplifiedCases,
      employees: simplifiedEmployees
    });

  } catch (error) {
    console.error('getHeadView error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Retrieves all active sponsored members and employees for a specific SPU for the Head view.
 * - Only accessible by users with the 'Head' role.
 * - Filters sponsored members and employees by the given SPU.
 * - Each sponsored member includes assigned SDW info if available.
 * - Each employee includes basic identifying info and role.
 * 
 * @param {Object} req - Express request object, expects user session or user object and body.spu.
 * @param {Object} res - Express response object, used to send JSON data or error.
 * @returns {Object} JSON response with 'cases' (sponsored members) and 'employees' arrays.
 */
const getHeadViewbySpu = async (req, res) => {
  const user = req.session ? req.session.user : req.user;
  const spuFilter = req.query.spu
  try {
    // if (!user) {
    //   return res.status(401).json({ message: "Authentication Error what" });
    // }

    let cases = [];
    let employee = [];
    
    let spuObject = null;
    if (mongoose.Types.ObjectId.isValid(spuFilter)) {
      spuObject = await Spu.findById(spuFilter);
    }
    if (!spuObject) {
      spuObject = await Spu.findOne({ spu_name: spuFilter });
    }
    if (!spuObject) {
      return res.status(400).json({ message: 'SPU not found' });
    }

    if (user.role == 'head') {
      cases = await Sponsored_Member.find({ is_active: true, spu:spuObject._id})
        .populate('assigned_sdw')
        .populate('spu')
        .lean();

      employee = await Employee.find({spu_id:spuObject._id}).populate('spu_id').lean();
    } else {
      return res.status(403).json({ message: "Permission Error: Head access required" });
    }

    const smIds = cases.map(c => c._id);
    const pendingClosures = await Case_Closure.find({
      sm: { $in: smIds },
      status: "Pending",
    }).select("sm").lean();
    const pendingIds = pendingClosures.map(pc => pc.sm.toString());
    // console.log("PEND", pendingIds)
    // console.log("SM", smIds)


    // Simplify Sponsored Members
    const simplifiedCases = cases.map(c => ({
      id: c._id,
      name: `${c.first_name} ${c.middle_name || ''} ${c.last_name}`.trim(),
      sm_number: c.sm_number,
      spu: c.spu.spu_name,
      is_active: c.is_active,
      assigned_sdw: c.assigned_sdw?._id || null,
      assigned_sdw_name: c.assigned_sdw
        ? `${c.assigned_sdw.first_name} ${c.assigned_sdw.middle_name || ''} ${c.assigned_sdw.last_name}`.trim()
        : null,
      pendingTermination: pendingIds.includes(c._id.toString()) ?? false,
    }));

    // Simplify Employees
    const simplifiedEmployees = employee.map(e => ({
      id: e._id,
      name: `${e.first_name} ${e.middle_name || ''} ${e.last_name}`.trim(),
      // sdw_id: e.sdw_id,
      spu_id: e.spu_id.spu_name,
      role: e.role,
      is_active: e.is_active,
    }));

    return res.status(200).json({
      cases: simplifiedCases,
      employees: simplifiedEmployees
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Retrieves all active sponsored members and employees for the Supervisor view, filtered by the supervisor's SPU.
 * - Only accessible by users with the 'Supervisor' role.
 * - Excludes employees with roles 'Head', 'head', or 'admin'.
 * - Each sponsored member includes assigned SDW info if available.
 * - Each employee includes basic identifying info and role.
 * 
 * @param {Object} req - Express request object, expects user session or user object.
 * @param {Object} res - Express response object, used to send JSON data or error.
 * @returns {Object} JSON response with 'cases' (sponsored members) and 'employees' arrays.
 */
const getSupervisorViewbySpu = async (req, res) => {
  const user = req.session ? req.session.user : req.user;
  try {
    // if (!user) {
    //   return res.status(401).json({ message: "Authentication Error what" });
    // }

    let cases = [];
    let employee = [];

    if (user.role == 'super' || user.role == 'supervisor') {//changed depending on what actual value
      cases = await Sponsored_Member.find({ is_active: true, spu:user.spu_id})
        .populate('assigned_sdw')
        .populate('spu')
        .lean();

       employee = await Employee.find({role: {$nin: ['head','admin']}, spu_id: user.spu_id}).populate('spu_id').lean(); 
    } else {
      return res.status(403).json({ message: "Permission Error: Supervisor access required" });
    }

    const smIds = cases.map(c => c._id);
    const pendingClosures = await Case_Closure.find({
      sm: { $in: smIds },
      status: "Pending",
    }).select("sm").lean();
    const pendingIds = pendingClosures.map(pc => pc.sm.toString());

    // Simplify Sponsored Members
    const simplifiedCases = cases.map(c => ({
      id: c._id,
      name: `${c.first_name} ${c.middle_name || ''} ${c.last_name}`.trim(),
      sm_number: c.sm_number,
      spu: c.spu.spu_name,
      is_active: c.is_active,
      assigned_sdw: c.assigned_sdw?._id || null,
      assigned_sdw_name: c.assigned_sdw
        ? `${c.assigned_sdw.first_name} ${c.assigned_sdw.middle_name || ''} ${c.assigned_sdw.last_name}`.trim()
        : null,
      pendingTermination: pendingIds.includes(c._id.toString()) ?? false,
    }));

    // Simplify Employees
    const simplifiedEmployees = employee.map(e => ({
      id: e._id,
      name: `${e.first_name} ${e.middle_name || ''} ${e.last_name}`.trim(),
      // sdw_id: e.sdw_id,
      spu_id: e.spu_id.spu_name,
      spu: e.spu_id.spu_name,
      role: e.role,
      is_active: e.is_active
    }));

    return res.status(200).json({
      cases: simplifiedCases,
      employees: simplifiedEmployees
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


/**
 * Retrieves all active sponsored members assigned to the logged-in SDW for the SDW view.
 * - Only accessible by users with the 'sdw' role.
 * - Filters sponsored members by the SDW's user ID and SPU.
 * - Each sponsored member includes assigned SDW info if available.
 * 
 * @param {Object} req - Express request object, expects user session or user object.
 * @param {Object} res - Express response object, used to send JSON data or error.
 * @returns {Object} JSON response with 'cases' (sponsored members) array.
 */

const getSDWView = async (req, res) => {
  const user = req.session ? req.session.user : req.user;
  
  try {
    // if (!user) {
    //   return res.status(401).json({ message: "Authentication Error what" });
    // }
    const userId = user._id;
    let cases = [];
    let employee = [];

    if (user.role == 'sdw') {//changed depending on what actual value
      cases = await Sponsored_Member.find({assigned_sdw: userId, is_active: true, spu:user.spu_id})
        .populate('assigned_sdw')
        .populate('spu')
        .lean();
    }else{
      return res.status(403).json({ message: "Permission Error: SDW access required" });
    }


    // Simplify Sponsored Members
    const simplifiedCases = cases.map(c => ({
      id: c._id,
      name: `${c.first_name} ${c.middle_name || ''} ${c.last_name}`.trim(),
      sm_number: c.sm_number,
      spu: c.spu.spu_name,
      is_active: c.is_active,
      assigned_sdw: c.assigned_sdw?._id || null,
      assigned_sdw_name: c.assigned_sdw
        ? `${c.assigned_sdw.first_name} ${c.assigned_sdw.middle_name || ''} ${c.assigned_sdw.last_name}`.trim()
        : null
    }));
    return res.status(200).json({
      cases: simplifiedCases,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getHeadViewbySupervisor = async(req,res) =>{
    const user = req.session ? req.session.user : req.user;
    const supervisorId = req.params.supervisorId;
    // if (!user || !mongoose.Types.ObjectId.isValid(supervisorId)) {
    //   return res.status(401).json({ message: "Authentication Error" });
    // }
    // if(user.role != 'head'){//change when needed
    // return res.status(401).json({ message: "Permission Error" });
    // }
    try{
        let sdws = []

        sdws = await Employee.find({manager:supervisorId})
        .populate('spu_id')
        .lean()

        const simplifiedsdws = sdws.map(e => ({
        id: e._id,
        name: `${e.first_name} ${e.middle_name || ''} ${e.last_name}`.trim(),
        // sdw_id: e.sdw_id,
        spu_id: e.spu_id.spu_name,
        role: e.role,
        is_active: e.is_active,
        }));

        return res.status(200).json(simplifiedsdws);
    }catch(error){
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });     
    }
}

const getSDWViewbyParam = async(req,res) =>{
    const user = req.session ? req.session.user : req.user;
    const sdwId = req.params.sdwId;
    // if (!user || !mongoose.Types.ObjectId.isValid(sdwId)) {
    //   return res.status(401).json({ message: "Authentication Error" });
    // }
    try{
        let cases = []

        cases = await Sponsored_Member.find({assigned_sdw: sdwId})
        .populate('assigned_sdw')
        .populate('spu')
        .lean()

        // console.log("CASES FOUND", cases);

        const smIds = cases.map(c => c._id);
        const pendingClosures = await Case_Closure.find({
          sm: { $in: smIds },
          status: "Pending",
        }).select("sm").lean();
        const pendingIds = pendingClosures.map(pc => pc.sm.toString());
        // console.log("PEND", pendingIds)
        // console.log("SM", smIds)

        const simplifiedCases = cases.map(c => ({
            id: c._id,
            name: `${c.first_name} ${c.middle_name || ''} ${c.last_name}`.trim(),
            sm_number: c.sm_number,
            spu: c.spu.spu_name,
            is_active: c.is_active,
            assigned_sdw: c.assigned_sdw?._id || null,
            assigned_sdw_name: c.assigned_sdw
                ? `${c.assigned_sdw.first_name} ${c.assigned_sdw.middle_name || ''} ${c.assigned_sdw.last_name}`.trim()
                : null,
            pendingTermination: pendingIds.includes(c._id.toString()) ?? false,
        }));

        return res.status(200).json(simplifiedCases);
    }catch(error){
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });     
    }
}

module.exports = {
    getHeadView,
    getHeadViewbySpu,
    getSupervisorViewbySpu,
    getSDWView,
    getHeadViewbySupervisor,
    getSDWViewbyParam,
    getEmployeeById,
    getEmployeeByUsername,
    getEmployeeBySDWId,
    editEmployeeCore,
    editEmployeePassword
}
