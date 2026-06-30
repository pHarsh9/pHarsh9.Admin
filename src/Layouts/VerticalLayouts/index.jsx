import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Collapse } from "reactstrap";
import withRouter from "../../Components/Common/withRouter";
import { MenuContext } from "../../context/MenuContext";
import { renderIcon } from "../../Components/Common/IconPicker";

const VerticalLayout = (props) => {
    const { menuData, loading, updateCurrentPagePermissions } =
        useContext(MenuContext);
    const [expandedItems, setExpandedItems] = useState({});

    const path = props.router.location.pathname;

    const cleanUrl = (url) => {
        if (!url) return "";
        return url.split('?')[0].replace(/\/+$/, '').trim().toLowerCase();
    };

    // Find parent menu/group IDs for a given URL path
    const findParentIds = (menuItems, targetPath, parentIds = []) => {
        const cleanTarget = cleanUrl(targetPath);
        if (!cleanTarget) return null;
        for (const item of menuItems) {
            const cleanItemUrl = cleanUrl(item.url);
            // Only match if both URLs are non-empty and they match exactly
            if (cleanItemUrl && cleanItemUrl === cleanTarget) {
                return parentIds;
            }
            // If this item has children, search recursively
            if (item.children && item.children.length > 0) {
                const found = findParentIds(item.children, targetPath, [...parentIds, String(item.id)]);
                if (found) return found;
            }
            // If this is a menu group with menus
            if (item.menus && item.menus.length > 0) {
                const found = findParentIds(item.menus, targetPath, [...parentIds, String(item.groupId)]);
                if (found) return found;
            }
        }
        return null;
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        const initMenu = () => {
            const pathName = path;
            const ul = document.getElementById("navbar-nav");
            if (!ul) return;
            const items = ul.getElementsByTagName("a");
            let itemsArray = [...items];
            removeActivation(itemsArray);
            let matchingMenuItem = itemsArray.find((x) => {
                // Skip collapsible parent headers — their .pathname falsely
                // matches the current page because they render as <a href="#">
                if (x.classList.contains("menu-link")) return false;
                return x.pathname === pathName;
            });
            if (matchingMenuItem) {
                activateParentDropdown(matchingMenuItem);
            }
        };
        if (props.layoutType === "vertical") {
            initMenu();
        }
    }, [path, props.layoutType]);

    // Toggle expanded state for any menu item (accordion behavior - only one open at a time per level)
    // siblingIds contains the IDs of all sibling items at the same level
    const toggleItem = (itemId, siblingIds = []) => {
        setExpandedItems((prev) => {
            const isCurrentlyOpen = prev[itemId];

            // If we're opening this item, close all siblings
            if (!isCurrentlyOpen) {
                const newState = { ...prev };
                // Close all sibling items
                siblingIds.forEach((id) => {
                    if (id !== itemId) {
                        newState[id] = false;
                    }
                });
                // Open the clicked item
                newState[itemId] = true;
                return newState;
            } else {
                // If we're closing, just toggle this item
                return {
                    ...prev,
                    [itemId]: false,
                };
            }
        });
    };

    function activateParentDropdown(item) {
        item.classList.add("active");
        return false;
    }

    const removeActivation = (items) => {
        let actiItems = items.filter((x) => x.classList.contains("active"));

        actiItems.forEach((item) => {
            if (item.classList.contains("menu-link")) {
                if (!item.classList.contains("active")) {
                    item.setAttribute("aria-expanded", false);
                }
            }
            if (item.classList.contains("nav-link")) {
                item.setAttribute("aria-expanded", false);
            }
            item.classList.remove("active");
        });
    };

    // Handle menu item click to update current page permissions
    const handleMenuItemClick = (menuId) => {
        if (menuId) {
            updateCurrentPagePermissions(menuId);
        }
        // Automatically close sidebar drawer on mobile after clicking a link
        document.body.classList.remove("vertical-sidebar-enable");
    };

    // Recursive function to render menu items at any nesting level
    // siblingIds contains IDs of all sibling items at this level for accordion behavior
    const renderMenuItem = (item, siblingIds = []) => {
        // Handle edge cases
        if (!item || !item.name) {
            return null;
        }

        // Render icon: SVG-based (react-icons) or small dot fallback
        const renderMenuIcon = (iconKey) => {
            if (iconKey) {
                const icon = renderIcon(iconKey, { size: 16, style: { marginRight: "8px", flexShrink: 0 } });
                if (icon) return icon;
            }
            // Fallback: tiny circle dot
            return (
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#9CA3AF", display: "inline-block", marginRight: "8px", flexShrink: 0, opacity: 0.5 }}></span>
            );
        };

        // If this item has children, render a collapsible menu
        if (item.isParent && item.children && item.children.length > 0) {
            // Get sibling IDs for children (for nested accordion behavior)
            const childSiblingIds = item.children
                .filter(
                    (child) =>
                        child.isParent &&
                        child.children &&
                        child.children.length > 0
                )
                .map((child) => child.id);

            return (
                <li className="nav-item" key={item.id}>
                    <Link
                        className="nav-link menu-link"
                        to="#"
                        onClick={() => toggleItem(item.id, siblingIds)}
                        style={{ justifyContent: " !important" }}
                        aria-expanded={
                            expandedItems[item.id] ? "true" : "false"
                        }
                    >
                        {renderMenuIcon(item.icon)}
                        <span data-key="t-apps">{item.name}</span>
                    </Link>
                    <Collapse
                        className="menu-dropdown"
                        isOpen={expandedItems[item.id]}
                        data-group-name={item.name}
                    >
                        <ul className="nav nav-sm flex-column">
                            {/* Recursively render child items with their sibling IDs */}
                            {item.children.map((child) =>
                                renderMenuItem(child, childSiblingIds)
                            )}
                        </ul>
                    </Collapse>
                </li>
            );
        }
        // Otherwise, render a regular link
        else {
            return (
                <li className="nav-item" key={item.id}>
                    <Link
                        className="nav-link"
                        to={item.url}
                        onClick={() => handleMenuItemClick(item.id)}
                    >
                        {renderMenuIcon(item.icon)}
                        <span data-key="t-apps">{item.name}</span>
                    </Link>
                </li>
            );
        }
    };

    // Function to render a direct link menu group
    const renderDirectLinkMenuGroup = (group) => {
        // Validate the group object has the necessary properties
        if (!group || !group.groupName || !group.url) {
            return null;
        }

        return (
            <li className="nav-item" key={group.groupId}>
                <Link
                    className="nav-link menu-link level-0-group"
                    to={group.url}
                    onClick={() => handleMenuItemClick(group.groupId)}
                >
                    {group.icon && renderIcon(group.icon, { size: 16, style: { marginRight: "8px" } })}
                    <span data-key="t-apps">{group.groupName}</span>
                </Link>
            </li>
        );
    };

    // Function to render a menu group with its menu items
    // siblingGroupIds contains IDs of all sibling groups for accordion behavior
    const renderMenuGroup = (group, siblingGroupIds = []) => {
        // Check if this is a direct link menu group
        if (group.isLink) {
            return renderDirectLinkMenuGroup(group);
        }

        // Validate the group object has the necessary properties
        if (!group || !group.groupName || !group.menus) {
            return null;
        }

        // Get sibling IDs for menu items within this group (for nested accordion behavior)
        const menuSiblingIds = group.menus
            .filter(
                (menu) =>
                    menu.isParent && menu.children && menu.children.length > 0
            )
            .map((menu) => menu.id);

        return (
            <li className="nav-item" key={group.groupId}>
                <Link
                    className="nav-link menu-link level-0-group"
                    to="#"
                    aria-expanded="true"
                >
                    {group.icon && renderIcon(group.icon, { size: 16, style: { marginRight: "8px" } })}
                    <span data-key="t-apps">{group.groupName}</span>
                </Link>

                <Collapse
                    className="menu-dropdown"
                    isOpen={true}
                    data-group-name={group.groupName}
                >
                    <ul className="nav nav-sm flex-column">
                        {group.menus &&
                            group.menus.map((menu) =>
                                renderMenuItem(menu, menuSiblingIds)
                            )}
                    </ul>
                </Collapse>
            </li>
        );
    };

    return (
        <React.Fragment>
            <div className="mb-5">
                {/* menu Items */}

                {loading ? (
                    <li className="nav-item">
                        <span className="nav-link">Loading menus...</span>
                    </li>
                ) : (
                    <>
                        {Array.isArray(menuData) && menuData.length > 0 ? (
                            (() => {
                                // Get all sibling group IDs for top-level accordion behavior
                                const siblingGroupIds = menuData
                                    .filter(
                                        (g) =>
                                            !g.isLink &&
                                            g.menus &&
                                            g.menus.length > 0
                                    )
                                    .map((g) => g.groupId);
                                return menuData.map((group) =>
                                    renderMenuGroup(group, siblingGroupIds)
                                );
                            })()
                        ) : (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">
                                        No menu items available.
                                    </span>
                                </li>
                            </>
                        )}
                    </>
                )}
            </div>
        </React.Fragment>
    );
};

VerticalLayout.propTypes = {
    location: PropTypes.object,
};

export default withRouter(VerticalLayout);
