import React, { useState } from "react";
import {
    Input,
    Label,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import "./IconPicker.css";

// React Icons (SVG-based, no font files needed)
import {
    RiHomeLine,
    RiDashboardLine,
    RiSettings3Line,
    RiUserLine,
    RiTeamLine,
    RiFileLine,
    RiFolderLine,
    RiMailLine,
    RiCalendarLine,
    RiTimeLine,
    RiNotificationLine,
    RiBarChartLine,
    RiGridLine,
    RiListCheck,
    RiMenuLine,
    RiSearchLine,
    RiFilterLine,
    RiEditLine,
    RiDeleteBinLine,
    RiAddLine,
    RiCloseLine,
    RiCheckLine,
    RiInformationLine,
    RiErrorWarningLine,
    RiStarLine,
    RiHeartLine,
    RiLockLine,
    RiLockUnlockLine,
    RiEyeLine,
    RiDownloadLine,
    RiUploadLine,
    RiShareLine,
    RiLinkM,
    RiExternalLinkLine,
    RiPhoneLine,
    RiMapPinLine,
    RiBuildingLine,
    RiBankLine,
    RiStoreLine,
    RiShoppingCartLine,
    RiMoneyDollarCircleLine,
    RiWalletLine,
    RiBankCardLine,
    RiBookLine,
    RiBookmarkLine,
    RiAwardLine,
    RiTrophyLine,
    RiGiftLine,
    RiImageLine,
    RiCameraLine,
    RiVideoLine,
    RiMusicLine,
    RiGlobalLine,
    RiPriceTag3Line,
    RiShieldLine,
    RiMapLine,
    RiFlag2Line,
    RiEarthLine,
    RiDatabase2Line,
    RiPieChartLine,
    RiLineChartLine,
    RiLayoutLine,
    RiPaletteLine,
    RiCodeLine,
    RiTerminalBoxLine,
    RiChat1Line,
    RiCustomerServiceLine,
    RiTruckLine,
    RiHandHeartLine,
    RiFileListLine,
    RiClipboardLine,
    RiPrinterLine,
    RiKeyLine,
    RiCompass3Line,
    RiGroupLine,
    // New page-relevant icons
    RiBuilding2Line,
    RiBuilding4Line,
    RiGovernmentLine,
    RiCommunityLine,
    RiMapPin2Line,
    RiRoadMapLine,
    RiUserSettingsLine,
    RiUserStarLine,
    RiAdminLine,
    RiShieldUserLine,
    RiMailSettingsLine,
    RiMailSendLine,
    RiMailCheckLine,
    RiFileTextLine,
    RiExchangeDollarLine,
    RiExchangeLine,
    RiHistoryLine,
    RiLoginBoxLine,
    RiMenuAddLine,
    RiMenuSearchLine,
    RiOrganizationChart,
    RiProfileLine,
    RiContactsLine,
    RiContactsBook2Line,
    RiUserAddLine,
    RiPassportLine,
    RiFlagLine,
    RiRoadsterLine,
    RiSurveyLine,
    RiTaskLine,
    RiTodoLine,
    RiShieldCheckLine,
    RiShieldKeyholeLine,
    RiSpeedLine,
    RiDoorLockLine,
    RiTableLine,
    RiPagesLine,
    RiAppsLine,
    RiWindow2Line,
    RiFundsLine,
    RiPercentLine,
    RiCoinLine,
    RiCoinsLine,
    RiCurrencyLine,
    RiExchangeFundsLine,
    RiSecurePaymentLine,
} from "react-icons/ri";

// Icon registry: maps a string key to a React Icon component
// The key is what gets stored in the database
const ICON_REGISTRY = {
    "RiHomeLine": RiHomeLine,
    "RiDashboardLine": RiDashboardLine,
    "RiSettings3Line": RiSettings3Line,
    "RiUserLine": RiUserLine,
    "RiTeamLine": RiTeamLine,
    "RiFileLine": RiFileLine,
    "RiFolderLine": RiFolderLine,
    "RiMailLine": RiMailLine,
    "RiCalendarLine": RiCalendarLine,
    "RiTimeLine": RiTimeLine,
    "RiNotificationLine": RiNotificationLine,
    "RiBarChartLine": RiBarChartLine,
    "RiGridLine": RiGridLine,
    "RiListCheck": RiListCheck,
    "RiMenuLine": RiMenuLine,
    "RiSearchLine": RiSearchLine,
    "RiFilterLine": RiFilterLine,
    "RiEditLine": RiEditLine,
    "RiDeleteBinLine": RiDeleteBinLine,
    "RiAddLine": RiAddLine,
    "RiCloseLine": RiCloseLine,
    "RiCheckLine": RiCheckLine,
    "RiInformationLine": RiInformationLine,
    "RiErrorWarningLine": RiErrorWarningLine,
    "RiStarLine": RiStarLine,
    "RiHeartLine": RiHeartLine,
    "RiLockLine": RiLockLine,
    "RiLockUnlockLine": RiLockUnlockLine,
    "RiEyeLine": RiEyeLine,
    "RiDownloadLine": RiDownloadLine,
    "RiUploadLine": RiUploadLine,
    "RiShareLine": RiShareLine,
    "RiLinkM": RiLinkM,
    "RiExternalLinkLine": RiExternalLinkLine,
    "RiPhoneLine": RiPhoneLine,
    "RiMapPinLine": RiMapPinLine,
    "RiBuildingLine": RiBuildingLine,
    "RiBankLine": RiBankLine,
    "RiStoreLine": RiStoreLine,
    "RiShoppingCartLine": RiShoppingCartLine,
    "RiMoneyDollarCircleLine": RiMoneyDollarCircleLine,
    "RiWalletLine": RiWalletLine,
    "RiBankCardLine": RiBankCardLine,
    "RiBookLine": RiBookLine,
    "RiBookmarkLine": RiBookmarkLine,
    "RiAwardLine": RiAwardLine,
    "RiTrophyLine": RiTrophyLine,
    "RiGiftLine": RiGiftLine,
    "RiImageLine": RiImageLine,
    "RiCameraLine": RiCameraLine,
    "RiVideoLine": RiVideoLine,
    "RiMusicLine": RiMusicLine,
    "RiGlobalLine": RiGlobalLine,
    "RiPriceTag3Line": RiPriceTag3Line,
    "RiShieldLine": RiShieldLine,
    "RiMapLine": RiMapLine,
    "RiFlag2Line": RiFlag2Line,
    "RiEarthLine": RiEarthLine,
    "RiDatabase2Line": RiDatabase2Line,
    "RiPieChartLine": RiPieChartLine,
    "RiLineChartLine": RiLineChartLine,
    "RiLayoutLine": RiLayoutLine,
    "RiPaletteLine": RiPaletteLine,
    "RiCodeLine": RiCodeLine,
    "RiTerminalBoxLine": RiTerminalBoxLine,
    "RiChat1Line": RiChat1Line,
    "RiCustomerServiceLine": RiCustomerServiceLine,
    "RiTruckLine": RiTruckLine,
    "RiHandHeartLine": RiHandHeartLine,
    "RiFileListLine": RiFileListLine,
    "RiClipboardLine": RiClipboardLine,
    "RiPrinterLine": RiPrinterLine,
    "RiKeyLine": RiKeyLine,
    "RiCompass3Line": RiCompass3Line,
    "RiGroupLine": RiGroupLine,
    // New page-relevant icons
    "RiBuilding2Line": RiBuilding2Line,
    "RiBuilding4Line": RiBuilding4Line,
    "RiGovernmentLine": RiGovernmentLine,
    "RiCommunityLine": RiCommunityLine,
    "RiMapPin2Line": RiMapPin2Line,
    "RiRoadMapLine": RiRoadMapLine,
    "RiUserSettingsLine": RiUserSettingsLine,
    "RiUserStarLine": RiUserStarLine,
    "RiAdminLine": RiAdminLine,
    "RiShieldUserLine": RiShieldUserLine,
    "RiMailSettingsLine": RiMailSettingsLine,
    "RiMailSendLine": RiMailSendLine,
    "RiMailCheckLine": RiMailCheckLine,
    "RiFileTextLine": RiFileTextLine,
    "RiExchangeDollarLine": RiExchangeDollarLine,
    "RiExchangeLine": RiExchangeLine,
    "RiHistoryLine": RiHistoryLine,
    "RiLoginBoxLine": RiLoginBoxLine,
    "RiMenuAddLine": RiMenuAddLine,
    "RiMenuSearchLine": RiMenuSearchLine,
    "RiOrganizationChart": RiOrganizationChart,
    "RiProfileLine": RiProfileLine,
    "RiContactsLine": RiContactsLine,
    "RiContactsBook2Line": RiContactsBook2Line,
    "RiUserAddLine": RiUserAddLine,
    "RiPassportLine": RiPassportLine,
    "RiFlagLine": RiFlagLine,
    "RiRoadsterLine": RiRoadsterLine,
    "RiSurveyLine": RiSurveyLine,
    "RiTaskLine": RiTaskLine,
    "RiTodoLine": RiTodoLine,
    "RiShieldCheckLine": RiShieldCheckLine,
    "RiShieldKeyholeLine": RiShieldKeyholeLine,
    "RiSpeedLine": RiSpeedLine,
    "RiDoorLockLine": RiDoorLockLine,
    "RiTableLine": RiTableLine,
    "RiPagesLine": RiPagesLine,
    "RiAppsLine": RiAppsLine,
    "RiWindow2Line": RiWindow2Line,
    "RiFundsLine": RiFundsLine,
    "RiPercentLine": RiPercentLine,
    "RiCoinLine": RiCoinLine,
    "RiCoinsLine": RiCoinsLine,
    "RiCurrencyLine": RiCurrencyLine,
    "RiExchangeFundsLine": RiExchangeFundsLine,
    "RiSecurePaymentLine": RiSecurePaymentLine,
};

// Display names for the picker grid
const ICON_LIST = [
    { name: "No Icon", key: "" },
    // --- Page-specific icons ---
    { name: "Dashboard", key: "RiDashboardLine" },
    { name: "Company", key: "RiBuilding2Line" },
    { name: "Department", key: "RiOrganizationChart" },
    { name: "Employee", key: "RiUserSettingsLine" },
    { name: "Employee Roles", key: "RiShieldUserLine" },
    { name: "Country", key: "RiEarthLine" },
    { name: "State", key: "RiGovernmentLine" },
    { name: "City", key: "RiCommunityLine" },
    { name: "Email Setup", key: "RiMailSettingsLine" },
    { name: "Email For", key: "RiMailSendLine" },
    { name: "Email Template", key: "RiMailCheckLine" },
    { name: "Menu Group", key: "RiMenuAddLine" },
    { name: "Menu Master", key: "RiMenuSearchLine" },
    { name: "Role Master", key: "RiAdminLine" },
    { name: "Currency", key: "RiCurrencyLine" },
    { name: "Login Logs", key: "RiLoginBoxLine" },
    { name: "Profile", key: "RiProfileLine" },
    // --- General icons ---
    { name: "Home", key: "RiHomeLine" },
    { name: "Settings", key: "RiSettings3Line" },
    { name: "User", key: "RiUserLine" },
    { name: "User Add", key: "RiUserAddLine" },
    { name: "User Star", key: "RiUserStarLine" },
    { name: "Team", key: "RiTeamLine" },
    { name: "Group", key: "RiGroupLine" },
    { name: "Contacts", key: "RiContactsLine" },
    { name: "Contacts Book", key: "RiContactsBook2Line" },
    { name: "Org Chart", key: "RiOrganizationChart" },
    // --- Buildings & Places ---
    { name: "Building", key: "RiBuildingLine" },
    { name: "Building 2", key: "RiBuilding2Line" },
    { name: "Building 4", key: "RiBuilding4Line" },
    { name: "Government", key: "RiGovernmentLine" },
    { name: "Community", key: "RiCommunityLine" },
    { name: "Bank", key: "RiBankLine" },
    { name: "Store", key: "RiStoreLine" },
    // --- Location ---
    { name: "Map Pin", key: "RiMapPinLine" },
    { name: "Map Pin 2", key: "RiMapPin2Line" },
    { name: "Map", key: "RiMapLine" },
    { name: "Road Map", key: "RiRoadMapLine" },
    { name: "Globe", key: "RiGlobalLine" },
    { name: "Earth", key: "RiEarthLine" },
    { name: "Flag", key: "RiFlagLine" },
    { name: "Flag 2", key: "RiFlag2Line" },
    { name: "Compass", key: "RiCompass3Line" },
    { name: "Passport", key: "RiPassportLine" },
    // --- Mail & Communication ---
    { name: "Mail", key: "RiMailLine" },
    { name: "Mail Settings", key: "RiMailSettingsLine" },
    { name: "Mail Send", key: "RiMailSendLine" },
    { name: "Mail Check", key: "RiMailCheckLine" },
    { name: "Chat", key: "RiChat1Line" },
    { name: "Phone", key: "RiPhoneLine" },
    { name: "Support", key: "RiCustomerServiceLine" },
    // --- Security & Roles ---
    { name: "Shield", key: "RiShieldLine" },
    { name: "Shield User", key: "RiShieldUserLine" },
    { name: "Shield Check", key: "RiShieldCheckLine" },
    { name: "Shield Key", key: "RiShieldKeyholeLine" },
    { name: "Admin", key: "RiAdminLine" },
    { name: "Lock", key: "RiLockLine" },
    { name: "Unlock", key: "RiLockUnlockLine" },
    { name: "Key", key: "RiKeyLine" },
    { name: "Door Lock", key: "RiDoorLockLine" },
    { name: "Login", key: "RiLoginBoxLine" },
    { name: "Secure Pay", key: "RiSecurePaymentLine" },
    // --- Finance & Money ---
    { name: "Money", key: "RiMoneyDollarCircleLine" },
    { name: "Wallet", key: "RiWalletLine" },
    { name: "Credit Card", key: "RiBankCardLine" },
    { name: "Currency", key: "RiCurrencyLine" },
    { name: "Coin", key: "RiCoinLine" },
    { name: "Coins", key: "RiCoinsLine" },
    { name: "Exchange", key: "RiExchangeLine" },
    { name: "Exchange $", key: "RiExchangeDollarLine" },
    { name: "Funds", key: "RiFundsLine" },
    { name: "Exchange Funds", key: "RiExchangeFundsLine" },
    { name: "Percent", key: "RiPercentLine" },
    { name: "Price Tag", key: "RiPriceTag3Line" },
    { name: "Shopping Cart", key: "RiShoppingCartLine" },
    // --- Files & Documents ---
    { name: "File", key: "RiFileLine" },
    { name: "File Text", key: "RiFileTextLine" },
    { name: "File List", key: "RiFileListLine" },
    { name: "Folder", key: "RiFolderLine" },
    { name: "Clipboard", key: "RiClipboardLine" },
    { name: "Survey", key: "RiSurveyLine" },
    { name: "Book", key: "RiBookLine" },
    { name: "Bookmark", key: "RiBookmarkLine" },
    // --- Menu & Layout ---
    { name: "Menu", key: "RiMenuLine" },
    { name: "Menu Add", key: "RiMenuAddLine" },
    { name: "Menu Search", key: "RiMenuSearchLine" },
    { name: "Grid", key: "RiGridLine" },
    { name: "Apps", key: "RiAppsLine" },
    { name: "Layout", key: "RiLayoutLine" },
    { name: "Pages", key: "RiPagesLine" },
    { name: "Table", key: "RiTableLine" },
    { name: "Window", key: "RiWindow2Line" },
    { name: "List", key: "RiListCheck" },
    // --- Charts & Data ---
    { name: "Bar Chart", key: "RiBarChartLine" },
    { name: "Pie Chart", key: "RiPieChartLine" },
    { name: "Line Chart", key: "RiLineChartLine" },
    { name: "Speed", key: "RiSpeedLine" },
    { name: "Database", key: "RiDatabase2Line" },
    // --- Tasks & Actions ---
    { name: "Task", key: "RiTaskLine" },
    { name: "Todo", key: "RiTodoLine" },
    { name: "History", key: "RiHistoryLine" },
    { name: "Calendar", key: "RiCalendarLine" },
    { name: "Clock", key: "RiTimeLine" },
    { name: "Search", key: "RiSearchLine" },
    { name: "Filter", key: "RiFilterLine" },
    { name: "Edit", key: "RiEditLine" },
    { name: "Delete", key: "RiDeleteBinLine" },
    { name: "Add", key: "RiAddLine" },
    { name: "Check", key: "RiCheckLine" },
    { name: "Close", key: "RiCloseLine" },
    { name: "Download", key: "RiDownloadLine" },
    { name: "Upload", key: "RiUploadLine" },
    { name: "Printer", key: "RiPrinterLine" },
    { name: "Share", key: "RiShareLine" },
    { name: "Link", key: "RiLinkM" },
    { name: "External Link", key: "RiExternalLinkLine" },
    // --- Status & Info ---
    { name: "Info", key: "RiInformationLine" },
    { name: "Warning", key: "RiErrorWarningLine" },
    { name: "Bell", key: "RiNotificationLine" },
    { name: "Eye", key: "RiEyeLine" },
    { name: "Star", key: "RiStarLine" },
    { name: "Heart", key: "RiHeartLine" },
    { name: "Award", key: "RiAwardLine" },
    { name: "Trophy", key: "RiTrophyLine" },
    { name: "Gift", key: "RiGiftLine" },
    // --- Media & Creative ---
    { name: "Image", key: "RiImageLine" },
    { name: "Camera", key: "RiCameraLine" },
    { name: "Video", key: "RiVideoLine" },
    { name: "Music", key: "RiMusicLine" },
    { name: "Palette", key: "RiPaletteLine" },
    // --- Dev & Tech ---
    { name: "Code", key: "RiCodeLine" },
    { name: "Terminal", key: "RiTerminalBoxLine" },
    // --- Misc ---
    { name: "Truck", key: "RiTruckLine" },
    { name: "Charity", key: "RiHandHeartLine" },
    { name: "Roadster", key: "RiRoadsterLine" },
];

// Helper: render an icon by its registry key
export const renderIcon = (iconKey, props = {}) => {
    if (!iconKey) return null;
    const IconComponent = ICON_REGISTRY[iconKey];
    if (!IconComponent) return null;
    return <IconComponent {...props} />;
};

// Export the registry for use in sidebar and other components
export { ICON_REGISTRY };

const IconPicker = ({ value, onChange, label, error, required }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const toggle = () => setDropdownOpen(!dropdownOpen);

    const filteredIcons = ICON_LIST.filter(
        (icon) =>
            icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            icon.key.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleIconSelect = (iconKey) => {
        onChange(iconKey);
        setDropdownOpen(false);
        setSearchTerm("");
    };

    const selectedIcon = ICON_LIST.find((icon) => icon.key === value);

    return (
        <div className="icon-picker-wrapper mb-3">
            <Label>
                {label} {required && <span className="text-danger">*</span>}
            </Label>
            <Dropdown isOpen={dropdownOpen} toggle={toggle} className="w-100">
                <DropdownToggle
                    caret
                    className="w-100 d-flex align-items-center justify-content-between icon-picker-toggle"
                    style={{
                        backgroundColor: "white",
                        border: "1px solid #ced4da",
                        color: "#495057",
                        padding: "0.65rem 1rem",
                        borderRadius: "0.375rem",
                        height: "48px",
                    }}
                >
                    <div className="d-flex align-items-center">
                        {value && renderIcon(value, { size: 18, className: "me-2" })}
                        <span>
                            {selectedIcon ? selectedIcon.name : "Select Icon"}
                        </span>
                    </div>
                </DropdownToggle>
                <DropdownMenu
                    className="icon-picker-menu"
                    style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        width: "100%",
                    }}
                >
                    <div
                        className="p-2"
                        style={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: "white",
                            borderBottom: "1px solid #dee2e6",
                            zIndex: 1,
                        }}
                    >
                        <Input
                            type="text"
                            placeholder="Search icons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="p-2">
                        <div
                            className="icon-grid"
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(120px, 1fr))",
                                gap: "8px",
                            }}
                        >
                            {filteredIcons.map((icon, index) => (
                                <DropdownItem
                                    key={index}
                                    onClick={() => handleIconSelect(icon.key)}
                                    className={`icon-item ${
                                        value === icon.key ? "active" : ""
                                    }`}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        padding: "12px 8px",
                                        cursor: "pointer",
                                        borderRadius: "4px",
                                        border:
                                            value === icon.key
                                                ? "2px solid #009069"
                                                : "1px solid transparent",
                                        backgroundColor:
                                            value === icon.key
                                                ? "rgba(0, 144, 105, 0.1)"
                                                : "transparent",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (value !== icon.key) {
                                            e.currentTarget.style.backgroundColor =
                                                "#f8f9fa";
                                            e.currentTarget.style.borderColor =
                                                "#dee2e6";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (value !== icon.key) {
                                            e.currentTarget.style.backgroundColor =
                                                "transparent";
                                            e.currentTarget.style.borderColor =
                                                "transparent";
                                        }
                                    }}
                                >
                                    {icon.key ? (
                                        <div style={{ fontSize: "24px", marginBottom: "4px", lineHeight: 1 }}>
                                            {renderIcon(icon.key, { size: 24 })}
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                height: "24px",
                                                marginBottom: "4px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#999",
                                                }}
                                            >
                                                None
                                            </span>
                                        </div>
                                    )}
                                    <small
                                        style={{
                                            fontSize: "10px",
                                            textAlign: "center",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {icon.name}
                                    </small>
                                </DropdownItem>
                            ))}
                        </div>
                        {filteredIcons.length === 0 && (
                            <div className="text-center text-muted p-3">
                                No icons found
                            </div>
                        )}
                    </div>
                </DropdownMenu>
            </Dropdown>
            {error && <p className="text-danger mt-1 small">{error}</p>}
            <small className="form-text text-muted">
                Icon will be displayed in the sidebar menu
            </small>
        </div>
    );
};

export default IconPicker;
