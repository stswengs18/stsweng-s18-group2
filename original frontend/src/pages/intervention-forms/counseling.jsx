import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { TextInput, TextArea, DateInput } from "../../Components/TextField";
import Signature from "../../Components/Signature";
import SimpleModal from "../../Components/SimpleModal";
import { fetchSession, fetchEmployeeById } from "../../fetch-connections/account-connection";
import Loading from "../loading";

import { fetchCaseData as fetchCaseOriginal } from '../../fetch-connections/case-connection';


// API Imports
import {
    fetchCaseData,
    fetchCounselingIntervention,
    addCounselingIntervention,
    editCounselingIntervention,
    deleteCounselingIntervention
} from "../../fetch-connections/intervention-connection";
import { editAssessment } from "../../fetch-connections/case-connection";
import { generateCounselingForm } from "../../generate-documents/generate-documents";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function CounselingForm() {

    // ===== START :: Setting Data ===== //

    const query = useQuery();
    const action = query.get('action') || "";
    const caseID = query.get('caseID') || "";
    const formID = query.get('formID') || "";
    const navigate = useNavigate();

    const [data, setData] = useState({
        form_num: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        ch_number: "",
        grade_year_level: "",
        school: "",
        address: "",
        subproject: "",
        area_self_help: "",
        counseling_date: "",
        reason_for_counseling: "",
        corrective_action: "",
        recommendation: "",
        sm_comments: "",
    });

    const [newformID, setnewformID] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [noFormFound, setNoFormFound] = useState(false);
    const [noCaseFound, setNoCaseFound] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState("");
    const [modalImageCenter, setModalImageCenter] = useState(null);
    const [modalConfirm, setModalConfirm] = useState(false);
    const [modalOnConfirm, setModalOnConfirm] = useState(() => { });
    const [modalOnCancel, setModalOnCancel] = useState(undefined);

    const [loadingStage, setLoadingStage] = useState(0);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [user, setUser] = useState(null);
    const [authorized, setAuthorized] = useState(false);

    /********** TEST DATA **********/

    /********** USE STATES **********/

    // < START :: Auto-Filled Data > //

    // [TO UPDATE] :: Temporary state
    const viewForm = action !== 'create' ? true : false;

    useEffect(() => {
        setLoadingStage(0);
        const loadSession = async () => {
            const sessionData = await fetchSession();
            const currentUser = sessionData?.user;
            setUser(currentUser);

            if (!currentUser) {
                console.error("No user session found");
                navigate("/unauthorized");
                return;
            }
        };
        loadSession();
    }, []);

    // LOAD DATA
    if (!viewForm) {
        useEffect(() => {
            const loadData = async () => {
                setLoadingStage(1);

                // setLoading(true);
                const fetchedData = await fetchCaseData(caseID);

                if (!fetchedData) {
                    setNoCaseFound(true)
                    return
                }
                setData(fetchedData);
                // setLoading(false);

                setFormNum(fetchedData.intervention_number || 1);
                setLastName(fetchedData.last_name || "");
                setMiddleName(fetchedData.middle_name || "");
                setFirstName(fetchedData.first_name || "");
                setCHNumber(fetchedData.ch_number || "");
                setGradeYearLevel(fetchedData.grade_year_level || "");
                setSchool(fetchedData.school || "");
                setAddress(fetchedData.address || "");
                setSubproject(fetchedData.subproject || "");
                setAreaSelfHelp(fetchedData.area_self_help || "");
                setCounselingDate(fetchedData.counseling_date || "");
                setReasonForCounseling(fetchedData.reason_for_counseling || "");
                setCorrectiveAction(fetchedData.corrective_action || "");
                setRecommendation(fetchedData.recommendation || "");
                setSMComments(fetchedData.sm_comments || "");
            };

            loadData();
            setLoadingStage(2);
            setLoadingComplete(true);
        }, []);
    }

    // < END :: Auto-Filled Data > //

    // < START :: View Form > //

    // View Form
    if (viewForm) {
        useEffect(() => {
            const loadData = async () => {
                // setLoading(true);
                const fetchedData = await fetchCounselingIntervention(caseID, formID);
                if (!fetchedData) {
                    setNoFormFound(true)
                    return
                }
                setData(fetchedData);
                // setLoading(false);

                // console.log("Fetched Counselling Form: ", fetchedData);

                setLastName(fetchedData.last_name || "");
                setMiddleName(fetchedData.middle_name || "");
                setFirstName(fetchedData.first_name || "");
                setCHNumber(fetchedData.ch_number || "");
                setFormNum(fetchedData.intervention_number || "");
                setGradeYearLevel(fetchedData.grade_year_level || "");
                setSchool(fetchedData.school || "");
                setAddress(fetchedData.address || "");
                setSubproject(fetchedData.subproject || "");
                setAreaSelfHelp(fetchedData.area_self_help || "");
                setCounselingDate(fetchedData.counseling_date || "");
                setReasonForCounseling(fetchedData.reason_for_counseling || "");
                setCorrectiveAction(fetchedData.corrective_action || "");
                setRecommendation(fetchedData.recommendation || "");
                setSMComments(fetchedData.sm_comments || "");
            };

            loadData();

            setLoadingStage(2);
            setLoadingComplete(true);
        }, []);
    }

    // < END :: View Form > //

    // ===== END :: Setting Data ===== //

    // ===== START :: Backend Connection ===== //

    // < START :: Create Form > //

    const [errors, setErrors] = useState({});

    function formatListWithAnd(arr) {
        if (arr.length === 0) return "";
        if (arr.length === 1) return arr[0];
        if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
        const last = arr[arr.length - 1];
        return `${arr.slice(0, -1).join(", ")}, and ${last}`;
    }

    /*const validateForm = () => {
        const missing = [];

        if (!grade_year_level || grade_year_level.trim() === "") missing.push("Grade/Year Level");
        if (!school || school.trim() === "") missing.push("School");
        if (!area_self_help || area_self_help.trim() === "") missing.push("Area of Self-Help");
        if (!counseling_date || counseling_date.trim() === "") missing.push("Date of Counseling");
        if (!reason_for_counseling || reason_for_counseling.trim() === "") missing.push("Reason for Counseling");
        if (!corrective_action || corrective_action.trim() === "") missing.push("Corrective Action");
        if (!recommendation || recommendation.trim() === "") missing.push("Recommendation");
        if (!sm_comments || sm_comments.trim() === "") missing.push("Sponsored Member's Comments");

        if (missing.length > 0) {
            setModalTitle("Missing / Invalid Fields");
            setModalBody(`The following fields are missing or invalid: ${formatListWithAnd(missing)}`);
            setModalImageCenter(<div className="warning-icon mx-auto" />);
            setModalConfirm(false);
            setShowModal(true);
            return false;
        }

        return true;
    };*/

    const validateForm = () => {
        const fieldErrors = {};

        if (!grade_year_level || grade_year_level.trim() === "") { fieldErrors.grade_year_level = "Grade/Year Level is required."; }
        if (!school || school.trim() === "") { fieldErrors.school = "School is required."; }
        if (!area_self_help || area_self_help.trim() === "") { fieldErrors.area_self_help = "Area of Self-Help is required."; }
        if (!counseling_date || counseling_date.trim() === "") { fieldErrors.counseling_date = "Date of Counseling is required."; }
        if (!reason_for_counseling || reason_for_counseling.trim() === "") { fieldErrors.reason_for_counseling = "Reason for Counseling is required."; }
        if (!corrective_action || corrective_action.trim() === "") { fieldErrors.corrective_action = "Corrective Action is required."; }
        if (!recommendation || recommendation.trim() === "") { fieldErrors.recommendation = "Recommendation is required."; }
        if (!sm_comments || sm_comments.trim() === "") { fieldErrors.sm_comments = "Sponsored Member's Comments are required."; }

        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);

            const fieldNames = Object.values(fieldErrors);
            setModalTitle("Missing / Invalid Fields");
            // setModalBody(`The following fields are missing or invalid: ${formatListWithAnd(fieldNames)}`);
            setModalBody(
                <>
                    <p className="font-medium text-gray-700 mb-2">
                        Please correct the following errors before submitting:
                    </p>
                    <p className="body-sm text-gray-700 mb-2">
                        (Write N/A if necessary)
                    </p>
                    <br />
                    <div className="flex justify-center">
                        <ul className="list-disc list-inside mt-2 text-left">
                            {fieldNames.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                </>
            );
            setModalImageCenter(<div className="warning-icon mx-auto" />);
            setModalConfirm(false);
            setShowModal(true);
            return false;
        }

        setErrors({});
        return true;
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();

        const isValid = validateForm();
        if (!isValid) {
            setModalOnConfirm(() => () => { });
            setModalOnCancel(() => () => { });
            setModalConfirm(false);
            setIsProcessing(false);
            return false
        };

        setModalTitle("Confirm Creation");
        setModalBody("Are you sure you want to save this Counseling Form? This cannot be edited or deleted after creation.");
        setModalImageCenter(<div className="info-icon mx-auto" />);
        setModalConfirm(true);
        setModalOnConfirm(() => async () => {
            setShowModal(false);
            setIsProcessing(true);

            const created = await handleCreate();

            // console.log(created);

            if (created) {
                setShowSuccessModal(true);
            } else {
                setModalTitle("Error");
                setModalBody("An error occurred while saving. Please try again.");
                setModalImageCenter(<div className="warning-icon mx-auto" />);
                setModalConfirm(false);
                setShowModal(true);
            }

            setIsProcessing(false);
        });
        setModalOnCancel(() => () => {
            setShowModal(false);
        });
        setShowModal(true);
    };

    const handleCreate = async () => {
        const payload = {
            grade_year_level,
            school,
            area_self_help,
            counseling_date,
            reason_for_counseling,
            corrective_action,
            recommendation,
            sm_comments
        };
        // console.log("Payload: ", payload);

        const response = await addCounselingIntervention(payload, caseID);
        if (response?.intervention?._id) {
            setnewformID(response.intervention._id);
            return true;
        } else {
            return false;
        }
    };

    // < END :: Create Form > //

    // < START :: Edit Form > //

    const handleUpdate = async () => {
        const updatedPayload = {
            grade_year_level,
            school,
            area_self_help,
            counseling_date,
            reason_for_counseling,
            corrective_action,
            recommendation,
            sm_comments
        };

        // console.log("Payload: ", updatedPayload);
        const response = await editCounselingIntervention(updatedPayload, formID);
    };

    // < END :: Edit Form > //

    // < START :: Delete Form > //

    const handleDelete = async () => {
        const response = await deleteCounselingIntervention(formID);
    };

    // < END :: Delete Form > //

    // ===== END :: Backend Connection ===== //

    // ===== START :: Use States ===== //

    const [last_name, setLastName] = useState(data?.last_name || "");
    const [middle_name, setMiddleName] = useState(data?.middle_name || "");
    const [first_name, setFirstName] = useState(data?.first_name || "");
    const [ch_number, setCHNumber] = useState(data?.ch_number || "");
    const [form_num, setFormNum] = useState(data?.form_num || "");
    const [grade_year_level, setGradeYearLevel] = useState(
        data?.grade_year_level || "",
    );
    const [school, setSchool] = useState(data?.school || "");
    const [address, setAddress] = useState(data?.address || "");
    const [subproject, setSubproject] = useState(data?.subproject || "");
    const [area_self_help, setAreaSelfHelp] = useState(
        data?.area_self_help || "",
    );
    const [counseling_date, setCounselingDate] = useState(
        data?.counseling_date || "",
    );
    const [reason_for_counseling, setReasonForCounseling] = useState(
        data?.reason_for_counseling || "",
    );
    const [corrective_action, setCorrectiveAction] = useState(
        data?.corrective_action || "",
    );
    const [recommendation, setRecommendation] = useState(
        data?.recommendation || "",
    );
    const [sm_comments, setSMComments] = useState(data?.sm_comments || "");
    const [showConfirm, setShowConfirm] = useState(false);

    // ===== END :: Use States ===== //

    // ===== START :: Local Functions  ===== //

    const [savedTime, setSavedTime] = useState(null);
    const timeoutRef = useRef(null);
    const [sectionEdited, setSectionEdited] = useState("");

    const [showErrorOverlay, setShowErrorOverlay] = useState(false);

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            setShowErrorOverlay(true);
        }
    }, [errors]);

    const handleChange = (section) => (e) => {
        setSectionEdited(section);

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        setSavedTime(`Saved at ${timeString}`);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setSavedTime(null);
        }, 3000);
    };

    // ===== END :: Local Functions  ===== //

    useEffect(() => {
        const authorizeAccess = async () => {
            if (!user || !data) return;

            const returnData = await fetchCaseOriginal(caseID);

            // console.log("RETURN DATA: ", returnData);

            const assignedSDWId = returnData.assigned_sdw._id;

            // console.log("RAW DATA: ", assignedSDWId);

            if (user?.role === "head") {
                setAuthorized(true);
                return;
            }

            if (user?.role === "sdw") {
                if (assignedSDWId === user._id) {
                    setAuthorized(true);
                } else {
                    navigate("/unauthorized");
                }
                return;
            }

            if (user?.role === "supervisor") {
                try {
                    const res = await fetchEmployeeById(assignedSDWId);
                    // console.log("FETCHING EMPLOYEE", res.data.manager, user._id);
                    if (res.ok && res.data.manager === user._id) {
                        setAuthorized(true);
                        return
                    } else {
                        navigate("/unauthorized");
                    }
                } catch (err) {
                    console.error("Supervisor access check failed:", err);
                    navigate("/unauthorized");
                }
                return;
            }

            navigate("/unauthorized");
        };

        authorizeAccess();
    }, [data, user]);


    if (!data) return <div className="font-label">No data found.</div>;

    if (noFormFound) {
        return (
            <main className="flex justify-center w-full p-16">
                <div className="flex w-full flex-col items-center justify-center gap-16 rounded-lg border border-[var(--border-color)] p-16">
                    <div className="flex w-full justify-between">
                        <button
                            onClick={() => navigate(`/case/${caseID}`)}
                            className="flex items-center gap-5 label-base arrow-group">
                            <div className="arrow-left-button"></div>
                            Go Back
                        </button>
                    </div>
                    <h3 className="header-md">Counseling Form</h3>
                    <p className="text-3xl red"> No form found. </p>
                </div>
            </main>
        )
    }

    if (noCaseFound) {
        return (
            <main className="flex justify-center w-full p-16">
                <div className="flex w-full flex-col items-center justify-center gap-16 rounded-lg border border-[var(--border-color)] p-16">
                    <div className="flex w-full justify-between">
                        <button
                            onClick={() => navigate(`/case/${caseID}`)}
                            className="flex items-center gap-5 label-base arrow-group">
                            <div className="arrow-left-button"></div>
                            Go Back
                        </button>
                    </div>
                    <h3 className="header-md">Counseling Form</h3>
                    <p className="text-3xl red"> No case found. </p>
                </div>
            </main>
        )
    }


    useEffect(() => {
        if (viewForm && form_num) {
            document.title = `Counseling Form #${form_num}`;
        } else if (!viewForm) {
            document.title = `Create Counseling Form`;
        }

    }, [form_num]);


    const loadingColor = loadingStage === 0 ? "red" : loadingStage === 1 ? "blue" : "green";
    if (!loadingComplete || !authorized) return <Loading color={loadingColor} />;

    return (
        <>
            {showModal && (
                <SimpleModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={modalTitle}
                    bodyText={modalBody}
                    imageCenter={modalImageCenter}
                    confirm={modalConfirm}
                    onConfirm={modalOnConfirm}
                    onCancel={modalOnCancel}
                />
            )}


            <main className="flex w-full flex-col items-center justify-center gap-16 rounded-lg border border-[var(--border-color)] p-16">
                <div className="flex w-full justify-between">
                    <button
                        onClick={() => navigate(`/case/${caseID}`)}
                        className="flex items-center gap-5 label-base arrow-group">
                        <div className="arrow-left-button"></div>
                        Go Back
                    </button>
                    <h4 className="header-sm self-end">Form #: {form_num}</h4>
                </div>
                <h3 className="header-md">Counseling Form</h3>

                {/* Sponsored Member and General Info */}
                <section className="flex w-full flex-col gap-16">
                    <div className="flex w-full flex-col gap-8 rounded-[0.8rem] border border-[var(--border-color)] p-8">
                        <div className="flex border-b border-[var(--border-color)]">
                            <h4 className="header-sm">Sponsored Member</h4>
                        </div>
                        <div className="inline-flex items-start justify-center gap-16">
                            <div className="flex flex-col gap-8">
                                <TextInput
                                    label="Last Name"
                                    value={last_name}
                                    disabled={true}
                                ></TextInput>
                                <TextInput
                                    label="First Name"
                                    value={first_name}
                                    disabled={true}
                                ></TextInput>
                                <TextInput
                                    label="Middle Name"
                                    value={middle_name}
                                    disabled={true}
                                ></TextInput>
                                <TextInput
                                    label="CH ID #"
                                    value={ch_number}
                                    disabled={true}
                                ></TextInput>
                            </div>
                            <div className="flex flex-col gap-8">
                                <TextInput
                                    label="Grade/Year Level"
                                    value={grade_year_level}
                                    setValue={setGradeYearLevel}
                                    handleChange={handleChange("Sponsored Member")}
                                    error={errors["grade_year_level"]}
                                    disabled={viewForm}
                                ></TextInput>
                                <TextInput
                                    label="School"
                                    value={school}
                                    setValue={setSchool}
                                    handleChange={handleChange("Sponsored Member")}
                                    error={errors["school"]}
                                    disabled={viewForm}
                                ></TextInput>
                                <div className="flex gap-16">
                                    <p className="label-base w-72">Address</p>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        disabled={true}
                                        className={"body-base text-input w-96 cursor-not-allowed bg-gray-200"}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        {savedTime && sectionEdited === "Sponsored Member" && (
                            <p className="text-sm self-end mt-2">{savedTime}</p>
                        )}
                    </div>
                    <div className="flex w-full flex-col gap-8 rounded-[0.8rem] border border-[var(--border-color)] p-8">
                        <div className="flex border-b border-[var(--border-color)]">
                            <h4 className="header-sm">General Information</h4>
                        </div>
                        <div className="inline-flex items-start justify-center gap-16">
                            <div className="flex flex-col gap-8">
                                <TextInput
                                    label="Sub-Project"
                                    value={subproject}
                                    disabled={true}
                                ></TextInput>
                                <TextInput
                                    label="Area/Self-Help Group"
                                    value={area_self_help}
                                    setValue={setAreaSelfHelp}
                                    handleChange={handleChange("General Information")}
                                    error={errors["area_self_help"]}
                                    disabled={viewForm}
                                ></TextInput>
                            </div>
                            <div className="flex flex-col gap-8">
                                <DateInput
                                    label="Date of Counseling"
                                    value={counseling_date}
                                    setValue={setCounselingDate}
                                    handleChange={handleChange("General Information")}
                                    error={errors["counseling_date"]}
                                    disabled={viewForm}
                                ></DateInput>
                            </div>
                        </div>
                        {savedTime && sectionEdited === "General Information" && (
                            <p className="text-sm self-end mt-2">{savedTime}</p>
                        )}
                    </div>
                </section>

                <section className="flex w-full items-start gap-10">
                    <TextArea
                        label="Purpose/Reason for Counseling"
                        value={reason_for_counseling}
                        setValue={setReasonForCounseling}
                        error={errors["reason_for_counseling"]}
                        disabled={viewForm}
                    ></TextArea>
                    <TextArea
                        label="Corrective and/or Disciplinary Action To Be Taken"
                        value={corrective_action}
                        setValue={setCorrectiveAction}
                        error={errors["corrective_action"]}
                        disabled={viewForm}
                    ></TextArea>
                </section>

                {/* Recommendation and Comments */}
                <section className="flex w-full flex-col gap-16">
                    <TextArea
                        label="Recommendation for Improvement (Intervention)"
                        sublabel="Sponsor Member (SM)"
                        description="Please Note: Failure to improve performance or further violation of policy will result in additional disciplinary action up to and possible retirement."
                        value={recommendation}
                        setValue={setRecommendation}
                        error={errors["recommendation"]}
                        disabled={viewForm}
                    ></TextArea>
                    <TextArea
                        label="SM's Comments/Remarks"
                        value={sm_comments}
                        setValue={setSMComments}
                        error={errors["sm_comments"]}
                        disabled={viewForm}
                    ></TextArea>
                </section>

                {/* Buttons */}
                <div className="flex w-full justify-center gap-20">
                    {viewForm ? (
                        <>
                            <button
                                className="btn-blue font-bold-label w-min"
                                onClick={() => {
                                    generateCounselingForm(formID)
                                }}
                            >
                                Download Form
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={`btn-outline font-bold-label ${isProcessing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''
                                    }`}
                                onClick={() => {
                                    if (!isProcessing) {
                                        navigate(`/case/${caseID}`);
                                    }
                                }}
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`btn-primary font-bold-label w-min ${isProcessing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''
                                    }`}
                                onClick={async (e) => {
                                    e.preventDefault();
                                    setIsProcessing(true);
                                    const success = await handleSubmit(e);
                                    if (success) {
                                        setShowSuccessModal(true);
                                    }
                                    setIsProcessing(false);
                                }}
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Creating..." : "Create Intervention"}
                            </button>
                        </>
                    )}

                    {/* Saved Intervention */}
                    <AnimatePresence>
                        {showSuccessModal && (
                            <motion.div
                                key="success-modal"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col bg-white p-16 rounded-lg shadow-xl w-full max-w-3xl mx-4 gap-8"
                                >
                                    <h2 className="header-sm font-semibold mb-4">Counseling Form #{form_num} Saved</h2>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={() => {
                                                setShowSuccessModal(false);
                                                navigate(`/case/${caseID}`);
                                            }}
                                            className="btn-outline font-bold-label"
                                        >
                                            Go Back to Case
                                        </button>

                                        <button
                                            onClick={() => {
                                                setShowSuccessModal(false);
                                                navigate(`/counseling-form/?action=view&caseID=${caseID}&formID=${newformID}`);
                                            }}
                                            className="btn-primary font-bold-label"
                                        >
                                            View Form
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>


                    {/* Confirm Delete Form */}
                    {showConfirm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="flex flex-col bg-white p-16 rounded-lg shadow-xl w-full max-w-3xl mx-4 gap-8">
                                <h2 className="header-md font-semibold mb-4">Delete Form</h2>
                                <p className="label-base mb-6">Are you sure you want to delete this form?</p>
                                <div className="flex justify-end gap-4">

                                    {/* Cancel */}
                                    <button
                                        onClick={() =>
                                            setShowConfirm(false)
                                        }
                                        className="btn-outline font-bold-label"
                                    >
                                        Cancel
                                    </button>

                                    {/* Delete Form */}
                                    <button
                                        onClick={async () => {
                                            await handleDelete();
                                            setShowConfirm(false);
                                            navigate(`/case/${caseID}`);
                                        }}
                                        className="btn-primary font-bold-label"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Missing / Invalid Input */}
                    {/*showErrorOverlay && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 p-8 flex flex-col items-center gap-12
                                    animate-fadeIn scale-100 transform transition duration-300">
                                <div className="flex items-center gap-4 border-b-1 ]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[2.4rem] w-[2.4rem] text-red-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v2m0 4h.01M4.93 19h14.14a2 2 0 001.84-2.75L13.41 4.58a2 2 0 00-3.41 0L3.09 16.25A2 2 0 004.93 19z"
                                        />
                                    </svg>
                                    <h2 className="header-sm font-bold text-red-600 text-center">
                                        Missing / Invalid Input Detected
                                    </h2>
                                </div>
                                <p className="body-base text-[var(--text-color)] text-center max-w-xl">
                                    Please fill out all required fields before submitting the form.
                                </p>
                                <p className="body-base text-[var(--text-color)] text-center max-w-xl">
                                    Write N/A if necessary.
                                </p>

                                {/* OK Button }
                                <button
                                    onClick={() => setShowErrorOverlay(false)}
                                    className="bg-red-600 text-white text-2xl px-6 py-2 rounded-lg hover:bg-red-700 transition"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    )*/}
                </div>
            </main>
        </>
    );
}
export default CounselingForm;
