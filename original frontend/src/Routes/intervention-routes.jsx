import { Routes, Route } from "react-router-dom";
import HomeVisitationForm from "../pages/intervention-forms/home-visitation";
import FinancialAssessmentForm from "../pages/intervention-forms/financial-assessment";
import CounselingForm from "../pages/intervention-forms/counseling";
import CorrespondenceForm from "../pages/intervention-forms/correspondence";

const InterventionRoutes = () => (
    <>
        <Route path="/counseling-form" element={<CounselingForm />} />
        <Route path="/home-visitation-form" element={<HomeVisitationForm />} />
        <Route
            path="/financial-assessment-form"
            element={<FinancialAssessmentForm />}
        />
        <Route path="/correspondence-form" element={<CorrespondenceForm />} />
    </>
);

export default InterventionRoutes;
