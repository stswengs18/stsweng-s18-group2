/**
 *   CASE CLOSURE FORM CONTROLLER
 */

const mongoose = require('mongoose');

const Sponsored_Member = require('../model/sponsored_member');
const Case_Closure = require('../model/case_closure');
const Employee = require('../model/employee');

// ================================================== //

/**
 *   Loads the case closure form
 *   @returns  if form does not exist, case object
 *             if form exists, case object AND form object
 */
const loadCaseClosureForm = async(req, res) => {
     try {
          const caseSelected = await Sponsored_Member.findById(req.params.caseID) 
               .populate('spu') 
               .lean();
          if (!caseSelected)
               return res.status(404).json({ message: "Sponsored member not found" });
          caseSelected.spu = caseSelected.spu.spu_name
          caseSelected.spu = caseSelected.spu

          // assuming sessions is already set up
          const active_user = req.session.user
          // const active_user = await Employee.findById("68732fa1c9de746d02ac3755") 
          if (!active_user)
               return res.status(403).json({ message: "Unauthorized access." })

          // check if it is the appropriate supervisor or head
          const handler = await Employee.findById(caseSelected.assigned_sdw)
          var supervisor
          if (active_user.role === "head") {
               // no restrictions
          }
          else if (active_user.role == "super" || active_user.role == "supervisor") {
               /*if (caseSelected.spu!== active_user.spu_name)
                    return res.status(403).json({ message: "Unauthorized access." });*/

               if (handler.role === "sdw") {
                    supervisor = await Employee.findById(handler.manager);
                    if (!supervisor || !supervisor._id.equals(active_user._id)) {
                         return res.status(403).json({ message: "Unauthorized access." });
                    }
               } else if (handler.role === "super" || handler.role === "supervisor") {
                    if (!handler._id.equals(active_user._id)) {
                         return res.status(403).json({ message: "Unauthorized access." });
                    }
               } else if (handler.role === "head") {
                    if (!active_user.manager || !active_user.manager.equals(handler._id)) {
                         return res.status(403).json({ message: "Unauthorized access." });
                    }
               }
          } 
          else if (active_user.role === "sdw") {
               if (!handler._id.equals(active_user._id)) {
                    return res.status(403).json({ message: "Unauthorized access." });
               }
          }
          else {
               return res.status(403).json({ message: "Unauthorized access." });
          }

          // const formSelected = await Case_Closure.findOne({ sm: caseSelected._id.toString() })
          const formSelected = await Case_Closure.findOne({ sm: caseSelected._id })

          if (formSelected)
                return res.status(200).json({form: formSelected, case: caseSelected, active_user_role: active_user.role})

          return res.status(200).json(caseSelected)
     } catch(error) {

     }
} 

/**
 *   Creates new case closure form and updates the sponsored member to inactive
 *   @returns New intervention made
 */
const createCaseClosureForm = async(req, res) => {
     try {
          const caseSelected = await Sponsored_Member.findById(req.params.caseID) 
          if (!caseSelected)
               return res.status(404).json({ message: "Sponsored member not found" });

          if (!caseSelected.is_active)
               return res.status(400).json({ message: "The case has already been closed." })

          // if a form is found, load the form immediately
          const formSelected = await Case_Closure.findOne({ sm: caseSelected._id.toString() })
          if (formSelected)
               return res.status(200).json({ form: formSelected, case: caseSelected })

          // Uses sessions already, please comment out if needed or force assign an employee
          const active_user = req.session.user
          if (!active_user)
               return res.status(404).json({ message: "Unauthorized access." });
          if (!caseSelected.assigned_sdw.equals(active_user._id))
               return res.status(404).json({ message: "Unauthorized access." });

          // proceed to creation of form
          const formData = req.body

          // Validation
          const requiredFields = [
               "closure_date",
               "reason_for_retirement",
               "sm_awareness",
               "evaluation",
               "recommendation",
          ];
          const missingFields = requiredFields.filter(field => formData[field] === undefined || formData[field] === null || formData[field] === "");
          if (missingFields.length > 0) {
               // console.log("Missing field/s found.")
               return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
          }

          if (formData.sm_awareness == "yes" || formData.sm_awareness == true) {
               formData.sm_awareness = true

               if (!formData.sm_notification || formData.sm_notification === "") {
                    // console.log("Missing field/s found.")
                    return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
               }
          }
          else { 
               formData.sm_awareness = false
               formData.sm_notification = ""
          }

          // New Object
          const newCaseClose = new Case_Closure({
               sm: caseSelected._id,
               closure_date: formData.closure_date,
               sponsorship_date: formData.sponsorship_date,
               reason_for_retirement: formData.reason_for_retirement,
               sm_awareness: formData.sm_awareness,
               sm_notification: formData.sm_notification,
               services_provided: formData.services_provided,
               evaluation: formData.evaluation,
               recommendation: formData.recommendation
          })
          await newCaseClose.validate()
          await newCaseClose.save()

          return res.status(200).json(newCaseClose)
     } catch(error) {
          console.error('Error creating new case closure:', error);
          res.status(500).json({ message: 'Failed to create case closure', error });
     }
} 

/**
 *   Loads the existing case closure form; only assigned sdw, supervisor of the assigned sdw
 *   and heads can access
 *   @returns case object AND form object
 */
const loadExistingCaseClosureForm = async (req, res) => {
     try {          
          const caseSelected = await Sponsored_Member.findById(req.params.caseID)
          if (!caseSelected)
               return res.status(404).json({ message: "Sponsored member (case) not found." });

          // assuming sessions is already set up
          const active_user = req.session.user
          // const active_user = await Employee.findById("68732fa1c9de746d02ac3755") 
          if (!active_user)
               return res.status(403).json({ message: "Unauthorized access." })

          // check if it is the appropriate supervisor or head
          const handler = await Employee.findById(caseSelected.assigned_sdw)
          var supervisor
          if (active_user.role === "head") {
               // no restrictions
          }
          else if (active_user.role == "super" || active_user.role == "supervisor") {
               /*if (caseSelected.spu.toString() !== active_user.spu_id.toString())
                    return res.status(403).json({ message: "Unauthorized access." });*/

               if (handler.role === "sdw") {
                    supervisor = await Employee.findById(handler.manager);
                    if (!supervisor || !supervisor._id.equals(active_user._id)) {
                         return res.status(403).json({ message: "Unauthorized access." });
                    }
               } else if (handler.role === "super" || handler.role === "supervisor") {
                    if (!handler._id.equals(active_user._id)) {
                         return res.status(403).json({ message: "Unauthorized access." });
                    }
               } else if (handler.role === "head") {
                    if (!active_user.manager || !active_user.manager.equals(handler._id)) {
                         return res.status(403).json({ message: "Unauthorized access." });
                    }
               }
          } 
          else if (active_user.role === "sdw") {
               if (!handler._id.equals(active_user._id)) {
                    return res.status(403).json({ message: "Unauthorized access." });
               }
          }
          else {
               return res.status(403).json({ message: "Unauthorized access." });
          }

          const formSelected = await Case_Closure.findOne({ sm: caseSelected._id })
          if (!formSelected)
               return res.status(404).json({ message: "No termination request found." })

          return res.status(200).json({ form: formSelected, case: caseSelected })
     } catch(error) {
          return res.status(500).json({ message: "An error occured. Please try again." });
     }
}

/**
 *   [NOT USED] Edits the case closure form
 *   @returns the updated form object
 */
const editCaseClosureForm = async (req, res) => {
     try {
          const caseSelected = await Sponsored_Member.findById(req.params.caseID) 
          var formSelected
          if (req.params.formID)
               formSelected = await Case_Closure.findById(req.params.formID)
          else
               formSelected = await Case_Closure.findOne({ sm: caseSelected._id })

          const formData = req.body

          if (!caseSelected || !formSelected)
               return res.status(400).json({ message: "Case or form not found." })
          if (!caseSelected._id.equals(formSelected.sm))
               return res.status(400).json({ message: "Case selected does not match the form." })

          // Uses sessions already, please comment out if needed or force assign an employee
          const active_user = req.session.user
          if (!active_user)
               return res.status(400).json({ message: "Unauthorized access." })
          if (active_user && !caseSelected.assigned_sdw.equals(active_user._id))
               return res.status(400).json({ message: "You do not have permissions for this case." })

          if (formData.sm_awareness == "yes" || formData.sm_awareness == true) {
                    formData.sm_awareness = true

               if (!formData.sm_notification || formData.sm_notification === "") {
                    // console.log("Missing field/s found.")
                    return res.status(400).json({ message: `Missing field found.` });
               }
          }
          else  {
               formData.sm_awareness = false
               formData.sm_notification = ""
          }

          const updatedFormData = {
               sm: caseSelected._id,
               closure_date: formData.closure_date || formSelected.closure_date,
               reason_for_retirement: formData.reason_for_retirement || formSelected.reason_for_retirement,
               sm_awareness: formData.sm_awareness !== undefined ? formData.sm_awareness : formSelected.sm_awareness,
               sm_notification: formData.sm_notification,
               evaluation: formData.evaluation || formSelected.evaluation,
               recommendation: formData.recommendation || formSelected.recommendation
          }
          // console.log(updatedFormData)

          // update
          Object.assign(formSelected, updatedFormData);
          await formSelected.save();

          return res.status(200).json({ message: "Case closure form updated successfully.", case: caseSelected, form: formSelected });
     } catch (error) {
          return res.status(500).json({ message: "An error occured. Please try again." });
     }
}

/**
 *   Deletes the case closure form, mainly for rejecting the request  
 *   @returns a message AND case object
 */
const deleteCaseClosureForm = async (req, res) => {
     try {

          const caseSelected = await Sponsored_Member.findById(req.params.caseID)
          if (!caseSelected)
               return res.status(404).json({ message: "Case not found." })

          var formSelected
          if (req.params.formID)
               formSelected = await Case_Closure.findById(req.params.formID)
          else
               formSelected = await Case_Closure.findOne({ sm: caseSelected._id.toString() })

          // console.log("Form Selected: ", formSelected);

          if (!formSelected)
               return res.status(400).json({ message: "No termination request found." })

          if (!caseSelected._id.equals(formSelected.sm))
               return res.status(400).json({ message: "Case selected does not match the form." })

          if (!caseSelected.is_active)
               return res.status(400).json({ message: "The case has already been closed." })

          // Uses sessions already, please comment out if needed or force assign an employee
          const active_user = req.session.user
          const handler = await Employee.findById(caseSelected.assigned_sdw)
          var supervisor
          if (active_user.role === "head") {
               // no restrictions
          }
          else if (active_user.role == "super" || active_user.role == "supervisor") {
               /*if (caseSelected.spu.toString() !== active_user.spu_id.toString())
                    return res.status(403).json({ message: "Unauthorized access." });*/

               if (handler.role === "sdw") {
                    supervisor = await Employee.findById(handler.manager);
                    if (!supervisor || !supervisor._id.equals(active_user._id)) {
                         return res.status(403).json({ message: "Unauthorized access." });
                    }
               } else if (handler.role === "super" || handler.role === "supervisor") {
                    if (!handler._id.equals(active_user._id)) {
                         return res.status(403).json({ message: "Unauthorized access." });
                    }
               } else if (handler.role === "head") {
                    if (!active_user.manager || !active_user.manager.equals(handler._id)) {
                         return res.status(403).json({ message: "Unauthorized access." });
                    }
               }
          } 
          else if (active_user.role === "sdw") {
               if (!handler._id.equals(active_user._id)) {
                    return res.status(403).json({ message: "Unauthorized access." });
               }
          }
          else {
               return res.status(403).json({ message: "Unauthorized access." });
          }

          // delete
          // console.log("passed")
          await formSelected.deleteOne();
          return res.status(200).json({ message: "Case closure form deleted successfully.", case: caseSelected });
     } catch (error) {
          return res.status(500).json({ message: "An error occured. Please try again." });
     }
}

/**
 *   Confirms the case termination; only supervisor and head can access
 *   @returns a message, case object, and form object
 */
const confirmCaseTermination = async (req, res) => {
     try {
          //   console.log("Confirm Termination Enter");
          const caseSelected = await Sponsored_Member.findById(req.params.caseID)
          if (!caseSelected)
               return res.status(404).json({ message: "Case not found." })

          var formSelected
          if (req.params.formID)
               formSelected = await Case_Closure.findById(req.params.formID)
          else
               formSelected = await Case_Closure.findOne({ sm: caseSelected._id })

          if (!formSelected)
               return res.status(404).json({ message: "No termination request found." })
          if (!caseSelected._id.equals(formSelected.sm))
               return res.status(404).json({ message: "Case selected does not match the form." })

          // assuming sessions is already set up
          const active_user = req.session.user
          // const active_user = await Employee.findById("686e92a03c1f53d3ee65962d") 
          if (!active_user)
               return res.status(403).json({ message: "Unauthorized access." })

          // check if it is the appropriate supervisor or head
          const handler = await Employee.findById(caseSelected.assigned_sdw)
          var supervisor
          if (active_user.role == "super" || active_user.role == "supervisor") {
               /*if (caseSelected.spu.toString() !== active_user.spu_id.toString())
                    return res.status(403).json({ message: "Unauthorized access." });*/

               if (handler.role === "sdw") {
                    supervisor = await Employee.findById(handler.manager);
                    if (!supervisor || !supervisor._id.equals(active_user._id)) {
                        return res.status(403).json({ message: "Unauthorized access." });
                    }
                } else if (handler.role === "super" || handler.role === "supervisor") {
                   if (!handler._id.equals(active_user._id)) {
                        return res.status(403).json({ message: "Unauthorized access." });
                    }
                } else if (handler.role === "head") {
                   if (!active_user.manager || !active_user.manager.equals(handler._id)) {
                         return res.status(403).json({ message: "Unauthorized access." });
                    }
               }
          } 
          else if (active_user.role == "head") {
               // no further checks needed
          }
          else {
               return res.status(403).json({ message: "Unauthorized access." })
          }

          // console.log("passed")

          // security checks passed, proceed to deactivation
          caseSelected.is_active = false;
          await caseSelected.save();

          formSelected.status = "Accepted";
          await formSelected.save();

          // return case selected again, status should now be inactive
          return res.status(200).json({ message: "Case successfully terminated.", case: caseSelected, form: formSelected });
     } catch(error) {
          console.error(error);
          return res.status(500).json({ message: "An error occured. Please try again." });
     }
}

module.exports = {
     loadCaseClosureForm,
     createCaseClosureForm,
     loadExistingCaseClosureForm,
     editCaseClosureForm,
     deleteCaseClosureForm,
     confirmCaseTermination
}