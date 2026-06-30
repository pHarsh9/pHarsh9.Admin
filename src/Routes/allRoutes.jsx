import { Navigate } from "react-router-dom";
import Login from "../pages/Authentication/Login";
import UserProfile from "../pages/Authentication/user-profile";
import CompanyDetails from "../pages/Setup/CompanyDetails";
import Department from "../pages/Setup/Department";
import Employee from "../pages/Setup/Employee";
import Country from "../pages/Master/Country";
import State from "../pages/Master/State";
import City from "../pages/Master/City";
import EmailSetup from "../pages/CMS/EmailSetup";
import EmailFor from "../pages/CMS/EmailFor";
import EmailTemplate from "../pages/CMS/EmailTemplate";
import Dashboard from "../pages/Dashboard/Dashboard";
import MenuGroup from "../pages/Master/MenuGroup";
import MenuMaster from "../pages/Master/MenuMaster";
import EmployeeRoles from "../pages/Setup/EmployeeRoles";
import RoleMaster from "../pages/Master/RoleMaster";
import CurrencyMaster from "../pages/Master/CurrencyMaster";
import LoginAttemptLogs from "../pages/Master/LoginAttemptLogs";
import ProjectMaster from "../pages/Master/ProjectMaster";
import ProjectForm from "../pages/Master/ProjectForm";
import ExperienceMaster from "../pages/Master/ExperienceMaster";
import SkillMaster from "../pages/Master/SkillMaster";
import InquiryLogs from "../pages/Master/InquiryLogs";
import ProfileMaster from "../pages/Master/ProfileMaster";

const authProtectedRoutes = [
    { path: "/profile", component: <UserProfile /> },
    { path: "/company-details", component: <CompanyDetails /> },
    { path: "/department", component: <Department /> },
    { path: "/employee", component: <Employee /> },
    { path: "/employee-roles", component: <EmployeeRoles /> },
    { path: "/country", component: <Country /> },
    { path: "/state", component: <State /> },
    { path: "/city", component: <City /> },
    { path: "/email-setup", component: <EmailSetup /> },
    { path: "/email-for", component: <EmailFor /> },
    { path: "/email-template", component: <EmailTemplate /> },
    { path: "/dashboard", component: <Dashboard /> },
    { path: "/menu-group", component: <MenuGroup /> },
    { path: "/menu-master", component: <MenuMaster /> },
    { path: "/role-master", component: <RoleMaster /> },
    { path: "/currency-master", component: <CurrencyMaster /> },
    { path: "/login-attempt-logs", component: <LoginAttemptLogs /> },
    { path: "/project-master", component: <ProjectMaster /> },
    { path: "/project-master/add", component: <ProjectForm /> },
    { path: "/project-master/edit/:id", component: <ProjectForm /> },
    { path: "/experience-master", component: <ExperienceMaster /> },
    { path: "/skill-master", component: <SkillMaster /> },
    { path: "/inquiry-logs", component: <InquiryLogs /> },
    { path: "/profile-master", component: <ProfileMaster /> },
    {
        path: "/",
        exact: true,
        component: <Navigate to="/dashboard" />,
    },
    { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
    { path: "/", component: <Login /> },
    // { path: "*", component: <Navigate to="/" /> },
];

export { authProtectedRoutes, publicRoutes };
