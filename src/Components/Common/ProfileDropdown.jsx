import React, { useState, useContext } from "react";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from "reactstrap";
import { FiUser, FiLogOut } from "react-icons/fi";

//import images
import logo from "../../assets/images/gemini-svg.svg";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { logout } from "../../api/auth.api";
import config from "../../config";

const getFullImageUrl = (path) => {
    if (!path || typeof path !== "string") return "";
    if (path.startsWith("blob:")) {
        return path;
    }
    const uploadIndex = path.indexOf("uploads/");
    if (uploadIndex !== -1) {
        const cleanPath = path.substring(uploadIndex).replace(/\\/g, "/");
        return `${config.api.API_URL}/${cleanPath}`;
    }
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    const cleanPath = path.replace(/^\/+/, "").replace(/\\/g, "/");
    return `${config.api.API_URL}/${cleanPath}`;
};

const ProfileDropdown = () => {
    const navigate = useNavigate();
    const { adminData, setAdminData, role } = useContext(AuthContext);

    const handleLogout = async () => {
        setAdminData(null);
        await logout(); // This will call the server and clear localStorage
        // Note: logout() already redirects to "/", so no need to navigate here
    };

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    return (
        <React.Fragment>
            <Dropdown
                isOpen={isProfileDropdown}
                toggle={toggleProfileDropdown}
                className="ms-sm-3 header-item topbar-user"
            // style={{height: "50px"}}
            >
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <img
                            className="rounded-circle header-profile-user"
                            src={adminData?.favicon ? getFullImageUrl(adminData.favicon) : logo}
                            alt="Header Avatar"
                        />
                        <span className="text-start ms-2">
                            <span className="d-inline-block fw-medium user-name-text">
                                {/* {userName} */}
                                {/* {adminData?.companyName} */}
                                {role}
                            </span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <h6 className="dropdown-header">
                        Welcome {adminData?.companyName || adminData?.employeeName}!
                    </h6>
                    <DropdownItem
                        href={role === "ADMIN" ? "/company-details" : "/employee-profile"}
                        as="Link"
                    >
                        <FiUser className="me-2 text-muted" style={{ fontSize: "16px" }} />
                        <span className="align-middle">Profile</span>
                    </DropdownItem>

                    <DropdownItem onClick={handleLogout}>
                        <FiLogOut className="me-2 text-muted" style={{ fontSize: "16px" }} />
                        <span className="align-middle" data-key="t-logout">
                            Logout
                        </span>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;
