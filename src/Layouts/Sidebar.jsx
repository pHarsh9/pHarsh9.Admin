import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import logo from "../assets/images/gemini-svg.svg";

//Import Components
import VerticalLayout from "./VerticalLayouts";
import TwoColumnLayout from "./TwoColumnLayout";
import { Container } from "reactstrap";
import HorizontalLayout from "./HorizontalLayout";
import { AuthContext } from "../context/AuthContext";
import config from "../config";

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

const Sidebar = ({ layoutType }) => {
    const { adminData } = useContext(AuthContext);

    useEffect(() => {
        var verticalOverlay =
            document.getElementsByClassName("vertical-overlay");
        if (verticalOverlay) {
            verticalOverlay[0].addEventListener("click", function () {
                document.body.classList.remove("vertical-sidebar-enable");
            });
        }
    });

    const addEventListenerOnSmHoverMenu = () => {
        console.log("Toggle button clicked!");
        const currentSize =
            document.documentElement.getAttribute("data-sidebar-size");
        console.log("Current sidebar size:", currentSize);

        // add listener Sidebar Hover icon on change layout from setting
        if (currentSize === "sm-hover") {
            console.log("Setting to sm-hover-active");
            document.documentElement.setAttribute(
                "data-sidebar-size",
                "sm-hover-active"
            );
        } else if (currentSize === "sm-hover-active") {
            console.log("Setting to sm-hover");
            document.documentElement.setAttribute(
                "data-sidebar-size",
                "sm-hover"
            );
        } else {
            console.log("Setting to sm-hover (from default)");
            document.documentElement.setAttribute(
                "data-sidebar-size",
                "sm-hover"
            );
        }

        const newSize =
            document.documentElement.getAttribute("data-sidebar-size");
        console.log("New sidebar size:", newSize);
    };

    return (
        <React.Fragment>
            <style>
                {`
                    /* Minimal Sidebar Styling matching the screenshot */
                    .minimal-sidebar {
                        background: #ffffff;
                        border-right: 1px solid #E5E7EB;
                    }
                    
                    .minimal-logo-box {
                        background: #ffffff;
                        border-bottom: 1px solid #E5E7EB;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 15px;
                        height: 80px;
                    }
                    
                    /* Menu styling */
                    .menu-title {
                        color: #9CA3AF !important;
                        font-size: 11px;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                        padding: 20px 24px 8px;
                        margin-top: 5px;
                    }
                    
                    .navbar-nav .nav-item {
                        margin: 2px 0;
                    }
                    
                    .navbar-nav .nav-link {
                        color: #4B5563 !important;
                        font-size: 14px;
                        font-weight: 500;
                        padding: 10px 12px 10px 0px !important;
                        border-radius: 8px;
                        transition: all 0.15s ease;
                        display: flex;
                        align-items: center;
                    }
                    
                    #scrollbar .container-fluid {
                        padding-left: 0px !important;
                        padding-right: 0px !important;
                    }
                    
                    .navbar-nav .nav-link:hover {
                        background: #F3F4F6;
                        color: #111827 !important;
                    }
                    
                    .navbar-nav .nav-link.active {
                        background: #F3F4F6;
                        color: #111827 !important;
                        font-weight: 600;
                        border-radius: 8px;
                    }
                    
                    .navbar-nav .menu-link {
                        display: flex;
                        align-items: center;
                    }
                    
                    .navbar-nav .menu-link::after {
                        font-size: 16px;
                        opacity: 0.6;
                        transition: transform 0.2s;
                    }
                    
                    .navbar-nav .menu-link[aria-expanded="true"]::after {
                        transform: rotate(90deg);
                    }
                    
                    .menu-dropdown {
                        margin: 2px 0;
                        padding: 2px 0;
                    }
                    
                    .menu-dropdown .nav-link,
                    .navbar-menu .navbar-nav .nav-sm .nav-link {
                        padding-left: 10px !important;
                        font-size: 13px;
                    }
                    
                    .navbar-menu .navbar-nav .nav-sm {
                        padding-left: 10px !important;
                    }
                    
                    /* Remove bullet prefix dash from submenus */
                    .navbar-menu .navbar-nav .nav-sm .nav-link::before {
                        display: none !important;
                    }
                    
                    /* Light gray background for first-level menu groups */
                    .navbar-nav .level-0-group {
                        background-color: #F3F4F6 !important;
                        border: none !important;
                        margin-left: 0px !important;
                        margin-right: 0px !important;
                        margin-top: 8px !important;
                        margin-bottom: 2px !important;
                        font-weight: 700 !important;
                        color: #000000 !important;
                        padding-top: 8px !important;
                        padding-bottom: 8px !important;
                        padding-left: 12px !important;
                        border-radius: 0px !important;
                        width: 100% !important;
                        justify-content: flex-start !important;
                    }
                    
                    .navbar-nav .level-0-group:hover {
                        background-color: #E5E7EB !important;
                        color: #000000 !important;
                    }
                    
                    /* Icon spacing */
                    .navbar-nav i,
                    .navbar-nav svg {
                        margin-right: 10px;
                        font-size: 16px;
                        color: #6B7280;
                        fill: currentColor;
                        transition: color 0.15s ease;
                    }
                    
                    .navbar-nav .nav-link:hover i,
                    .navbar-nav .nav-link:hover svg,
                    .navbar-nav .nav-link.active i,
                    .navbar-nav .nav-link.active svg {
                        color: #111827 !important;
                    }
                    
                    /* Hide level-0-group icons by default in expanded state */
                    .navbar-nav .level-0-group svg {
                        display: none !important;
                        color: #000000 !important;
                    }
                    
                    .navbar-nav .level-0-group:hover svg {
                        color: #000000 !important;
                    }
                    
                    /* Show level-0-group icons only when sidebar is collapsed (hamburger X / sm state) */
                    html[data-sidebar-size="sm"] .navbar-nav .level-0-group svg,
                    html[data-sidebar-size="sm-hover"] .navbar-nav .level-0-group svg,
                    body[data-sidebar-size="sm"] .navbar-nav .level-0-group svg,
                    body[data-sidebar-size="sm-hover"] .navbar-nav .level-0-group svg,
                    [data-sidebar-size="sm"] .navbar-nav .level-0-group svg,
                    [data-sidebar-size="sm-hover"] .navbar-nav .level-0-group svg {
                        display: inline-block !important;
                        margin-right: 0px !important;
                    }
                    
                    /* Toggle button visibility */
                    .btn-vertical-sm-hover {
                        background: #F3F4F6 !important;
                        border: 1px solid #E5E7EB !important;
                        border-radius: 6px !important;
                        padding: 4px 8px !important;
                        color: #4B5563 !important;
                    }
                    
                    .btn-vertical-sm-hover:hover {
                        background: #E5E7EB !important;
                        color: #111827 !important;
                    }
                    
                    /* Collapsed Sidebar (sm or sm-hover) - Support both */
                    html[data-sidebar-size="sm"] .navbar-menu,
                    html[data-sidebar-size="sm-hover"] .navbar-menu,
                    body[data-sidebar-size="sm"] .navbar-menu,
                    body[data-sidebar-size="sm-hover"] .navbar-menu,
                    [data-sidebar-size="sm"] .navbar-menu,
                    [data-sidebar-size="sm-hover"] .navbar-menu {
                        width: 70px !important;
                    }
                    
                    html[data-sidebar-size="sm"] .main-content,
                    html[data-sidebar-size="sm-hover"] .main-content,
                    body[data-sidebar-size="sm"] .main-content,
                    body[data-sidebar-size="sm-hover"] .main-content,
                    [data-sidebar-size="sm"] .main-content,
                    [data-sidebar-size="sm-hover"] .main-content {
                        margin-left: 70px !important;
                    }
                    
                    html[data-sidebar-size="sm"] .navbar-nav .nav-link span,
                    html[data-sidebar-size="sm"] .navbar-nav .nav-link::after,
                    html[data-sidebar-size="sm-hover"] .navbar-nav .nav-link span,
                    html[data-sidebar-size="sm-hover"] .navbar-nav .nav-link::after,
                    [data-sidebar-size="sm"] .navbar-nav .nav-link span,
                    [data-sidebar-size="sm"] .navbar-nav .nav-link::after,
                    [data-sidebar-size="sm-hover"] .navbar-nav .nav-link span,
                    [data-sidebar-size="sm-hover"] .navbar-nav .nav-link::after {
                        display: none !important;
                    }
                    
                    html[data-sidebar-size="sm"] .navbar-nav .nav-link i,
                    html[data-sidebar-size="sm-hover"] .navbar-nav .nav-link i,
                    [data-sidebar-size="sm"] .navbar-nav .nav-link i,
                    [data-sidebar-size="sm-hover"] .navbar-nav .nav-link i {
                        font-size: 20px !important;
                        margin-right: 0 !important;
                    }
                    
                    html[data-sidebar-size="sm"] .navbar-nav .nav-link,
                    html[data-sidebar-size="sm-hover"] .navbar-nav .nav-link,
                    [data-sidebar-size="sm"] .navbar-nav .nav-link,
                    [data-sidebar-size="sm-hover"] .navbar-nav .nav-link {
                        justify-content: center !important;
                        text-align: center !important;
                        font-size: 0 !important;
                    }
                    
                    html[data-sidebar-size="sm"] .menu-title,
                    html[data-sidebar-size="sm-hover"] .menu-title,
                    [data-sidebar-size="sm"] .menu-title,
                    [data-sidebar-size="sm-hover"] .menu-title {
                        text-align: center !important;
                        font-size: 0 !important;
                    }
                    
                    html[data-sidebar-size="sm"] .menu-title span,
                    html[data-sidebar-size="sm-hover"] .menu-title span,
                    [data-sidebar-size="sm"] .menu-title span,
                    [data-sidebar-size="sm-hover"] .menu-title span {
                        display: none !important;
                        font-size: 0 !important;
                    }
                    
                    /* Hide ALL text content in collapsed state */
                    html[data-sidebar-size="sm"] .navbar-nav span,
                    html[data-sidebar-size="sm-hover"] .navbar-nav span,
                    [data-sidebar-size="sm"] .navbar-nav span,
                    [data-sidebar-size="sm-hover"] .navbar-nav span {
                        display: none !important;
                        font-size: 0 !important;
                    }
                    
                    /* Show only icons - restore font size for icons */
                    html[data-sidebar-size="sm"] .navbar-nav i,
                    html[data-sidebar-size="sm-hover"] .navbar-nav i,
                    [data-sidebar-size="sm"] .navbar-nav i,
                    [data-sidebar-size="sm-hover"] .navbar-nav i {
                        display: inline-block !important;
                        font-size: 20px !important;
                    }
                    
                    html[data-sidebar-size="sm"] .menu-dropdown,
                    html[data-sidebar-size="sm-hover"] .menu-dropdown,
                    [data-sidebar-size="sm"] .menu-dropdown,
                    [data-sidebar-size="sm-hover"] .menu-dropdown {
                        display: none !important;
                    }
                    
                    html[data-sidebar-size="sm"] .navbar-brand-box,
                    html[data-sidebar-size="sm-hover"] .navbar-brand-box,
                    [data-sidebar-size="sm"] .navbar-brand-box,
                    [data-sidebar-size="sm-hover"] .navbar-brand-box {
                        padding: 15px 5px !important;
                    }
                    
                    html[data-sidebar-size="sm"] .logo-lg,
                    html[data-sidebar-size="sm-hover"] .logo-lg,
                    [data-sidebar-size="sm"] .logo-lg,
                    [data-sidebar-size="sm-hover"] .logo-lg {
                        display: none !important;
                    }
                    
                    html[data-sidebar-size="sm"] .logo-sm img,
                    html[data-sidebar-size="sm-hover"] .logo-sm img,
                    [data-sidebar-size="sm"] .logo-sm img,
                    [data-sidebar-size="sm-hover"] .logo-sm img {
                        height: 32px !important;
                        width: auto !important;
                    }
                    
                    /* Hide toggle circle in collapsed state */
                    html[data-sidebar-size="sm"] #vertical-hover,
                    html[data-sidebar-size="sm-hover"] #vertical-hover,
                    [data-sidebar-size="sm"] #vertical-hover,
                    [data-sidebar-size="sm-hover"] #vertical-hover {
                        display: none !important;
                    }
                    
                    /* Hover on individual item - show submenu */
                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-link,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-link,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-link,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-link {
                        position: relative !important;
                        width: 250px !important;
                        background-color: #ffffff !important;
                        color: #111827 !important;
                        z-index: 999 !important;
                        font-size: 13px !important;
                        border: 1px solid #E5E7EB !important;
                        border-right: none !important;
                        border-top-left-radius: 6px !important;
                        border-bottom-left-radius: 6px !important;
                    }
                    
                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-link span,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-link span,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-link span,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-link span {
                        display: inline-block !important;
                        padding-left: 8px !important;
                        font-size: 13px !important;
                        color: #111827 !important;
                    }

                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-link svg,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-link svg,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-link svg,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-link svg {
                        color: #111827 !important;
                        fill: currentColor !important;
                    }
                    
                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown,
                    html[data-sidebar-size="sm"] .menu-dropdown:hover,
                    html[data-sidebar-size="sm-hover"] .menu-dropdown:hover,
                    [data-sidebar-size="sm"] .menu-dropdown:hover,
                    [data-sidebar-size="sm-hover"] .menu-dropdown:hover {
                        display: block !important;
                        position: absolute !important;
                        left: 70px !important;
                        top: 0 !important;
                        min-width: 200px !important;
                        max-width: 250px !important;
                        background: #ffffff !important;
                        border: 1px solid #E5E7EB !important;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02) !important;
                        border-radius: 6px !important;
                        border-top-left-radius: 0px !important;
                        border-bottom-left-radius: 0px !important;
                        padding: 0 !important;
                        z-index: 1000 !important;
                        margin: 0 !important;
                        overflow: hidden;
                    }
                    
                    /* Keep panel visible slightly after hover ends */
                    html[data-sidebar-size="sm"] .nav-item .menu-dropdown,
                    html[data-sidebar-size="sm-hover"] .nav-item .menu-dropdown,
                    [data-sidebar-size="sm"] .nav-item .menu-dropdown,
                    [data-sidebar-size="sm-hover"] .nav-item .menu-dropdown {
                        transition: opacity 0.2s ease 0.1s, visibility 0s linear 0.3s !important;
                    }
                    
                    html[data-sidebar-size="sm"] .nav-item:hover .menu-dropdown,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover .menu-dropdown,
                    [data-sidebar-size="sm"] .nav-item:hover .menu-dropdown,
                    [data-sidebar-size="sm-hover"] .nav-item:hover .menu-dropdown {
                        transition-delay: 0s !important;
                    }
                    
                    /* Create invisible bridge between icon and panel to maintain hover */
                    html[data-sidebar-size="sm"] .nav-item .menu-dropdown::after,
                    html[data-sidebar-size="sm-hover"] .nav-item .menu-dropdown::after,
                    [data-sidebar-size="sm"] .nav-item .menu-dropdown::after,
                    [data-sidebar-size="sm-hover"] .nav-item .menu-dropdown::after {
                        content: '' !important;
                        position: absolute !important;
                        left: -70px !important;
                        top: 0 !important;
                        width: 70px !important;
                        height: 100% !important;
                        background: transparent !important;
                        z-index: -1 !important;
                    }
                    
                    /* Make nav-item fill full width to catch hover */
                    html[data-sidebar-size="sm"] .nav-item,
                    html[data-sidebar-size="sm-hover"] .nav-item,
                    [data-sidebar-size="sm"] .nav-item,
                    [data-sidebar-size="sm-hover"] .nav-item {
                        position: relative !important;
                    }
                    
                    /* Add group title header to dropdown */
                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown::before,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown::before,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown::before,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown::before {
                        content: attr(data-group-name) !important;
                        display: block !important;
                        padding: 12px 16px 10px !important;
                        background: #F9FAFB !important;
                        border-bottom: 1px solid #F3F4F6 !important;
                        font-size: 11px !important;
                        font-weight: 700 !important;
                        color: #6B7280 !important;
                        text-transform: uppercase !important;
                        letter-spacing: 0.05em !important;
                    }
                    
                    /* Adjust padding for dropdown items */
                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-sm,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-sm,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-sm,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-sm {
                        padding: 6px 0 !important;
                    }
                    
                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-item,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-item,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-item,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-item {
                        position: relative !important;
                        width: 100% !important;
                        margin: 0 !important;
                    }
                    
                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-link,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-link,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-link,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-link {
                        padding: 8px 16px !important;
                        width: 100% !important;
                        text-align: left !important;
                        justify-content: flex-start !important;
                        white-space: nowrap !important;
                        position: relative !important;
                        font-size: 13px !important;
                        color: #4B5563 !important;
                        background: transparent !important;
                    }
                    
                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-link:hover,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-link:hover,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-link:hover,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-link:hover {
                        background: #F3F4F6 !important;
                        color: #111827 !important;
                    }
                    
                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-link span,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-link span,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-link span,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-link span {
                        display: inline-block !important;
                        padding-left: 0 !important;
                        font-size: 13px !important;
                    }
                    
                    /* Prevent submenu items from creating their own nested panels */
                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-item .menu-dropdown,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-item .menu-dropdown,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-item .menu-dropdown,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-item .menu-dropdown {
                        position: static !important;
                        box-shadow: none !important;
                        background: transparent !important;
                        padding: 0 0 0 15px !important;
                        margin: 0 !important;
                        display: block !important;
                        left: auto !important;
                        top: auto !important;
                        min-width: auto !important;
                        max-width: none !important;
                        border-radius: 0 !important;
                    }
                    
                    /* Ensure nested items are always visible when parent is hovered */
                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .menu-dropdown,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .menu-dropdown,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .menu-dropdown,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .menu-dropdown {
                        display: block !important;
                    }
                    
                    /* Remove ::before for nested dropdowns */
                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .menu-dropdown::before,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .menu-dropdown::before,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .menu-dropdown::before,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .menu-dropdown::before {
                        display: none !important;
                    }
                    
                    /* Style nested menu items */
                    html[data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-item .menu-dropdown .nav-link,
                    html[data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-item .menu-dropdown .nav-link,
                    [data-sidebar-size="sm"] .nav-item:hover > .menu-dropdown .nav-item .menu-dropdown .nav-link,
                    [data-sidebar-size="sm-hover"] .nav-item:hover > .menu-dropdown .nav-item .menu-dropdown .nav-link {
                        padding: 6px 15px 6px 30px !important;
                        font-size: 11px !important;
                        background: rgba(255, 255, 255, 0.05) !important;
                    }
                    
                    .navbar-nav .nav-link:hover {
                        background: rgba(255, 255, 255, 0.1);
                    }
                    
                    /* Chevron for menu items with children */
                    .navbar-nav .menu-link[data-bs-toggle="collapse"]:after {
                        content: "\\203A";
                        position: absolute;
                        right: 15px;
                        font-size: 28px !important;
                        font-weight: bold;
                        transition: transform 0.3s ease;
                        color: rgba(255, 255, 255, 1) !important;
                        margin-bottom: 10px !important;
                    }
                    
                    .navbar-nav .menu-link[data-bs-toggle="collapse"][aria-expanded="true"]:after {
                        transform: rotate(90deg);
                        color: rgba(255, 255, 255, 0.9);
                    }
                    
                    /* Scrollbar */
                    .simplebar-track.simplebar-vertical {
                        width: 4px;
                        background: rgba(255, 255, 255, 0.05);
                    }
                    
                    .simplebar-scrollbar::before {
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 4px;
                    }
                `}
            </style>
            <div className="app-menu navbar-menu minimal-sidebar">
                <div className="navbar-brand-box minimal-logo-box">
                    <Link to="/dashboard" className="logo logo-dark">
                        <span className="logo-sm">
                            <img src={adminData?.logo ? getFullImageUrl(adminData.logo) : logo} alt="Elevate Golf" height="40" style={{ objectFit: "contain" }} />
                        </span>
                        <span className="logo-lg">
                            <img src={adminData?.logo ? getFullImageUrl(adminData.logo) : logo} alt="Elevate Golf" height="50" style={{ objectFit: "contain" }} />
                        </span>
                    </Link>

                    <Link to="/dashboard" className="logo logo-light">
                        <span className="logo-sm">
                            <img src={adminData?.logo ? getFullImageUrl(adminData.logo) : logo} alt="Elevate Golf" height="40" style={{ objectFit: "contain" }} />
                        </span>
                        <span className="logo-lg">
                            <img src={adminData?.logo ? getFullImageUrl(adminData.logo) : logo} alt="Elevate Golf" height="50" style={{ objectFit: "contain" }} />
                        </span>
                    </Link>
                    <button
                        onClick={addEventListenerOnSmHoverMenu}
                        type="button"
                        className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
                        id="vertical-hover"
                    >
                        <i className="ri-record-circle-line"></i>
                    </button>
                </div>
                {layoutType === "horizontal" ? (
                    <div id="scrollbar">
                        <Container fluid>
                            <div id="two-column-menu"></div>
                            <ul className="navbar-nav" id="navbar-nav">
                                <HorizontalLayout logo={adminData?.data.Logo} />
                            </ul>
                        </Container>
                    </div>
                ) : layoutType === "twocolumn" ? (
                    <React.Fragment>
                        <TwoColumnLayout
                            layoutType={layoutType}
                            logo={adminData?.data.Logo}
                        />
                        <div className="sidebar-background"></div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <SimpleBar id="scrollbar" className="h-100">
                            <Container fluid>
                                <div id="two-column-menu"></div>
                                <ul className="navbar-nav" id="navbar-nav">
                                    <VerticalLayout layoutType={layoutType} />
                                </ul>
                            </Container>
                        </SimpleBar>
                        <div className="sidebar-background"></div>
                    </React.Fragment>
                )}
            </div>
            <div className="vertical-overlay"></div>
        </React.Fragment>
    );
};

export default Sidebar;
