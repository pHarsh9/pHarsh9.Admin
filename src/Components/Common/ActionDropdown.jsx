import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { FiMoreHorizontal, FiEdit, FiTrash } from "react-icons/fi";

const ActionDropdown = ({
  row,
  onEdit,
  onDelete,
  permissions = { edit: true, delete: true, write: false }
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDropdownOpen((prevState) => !prevState);
  };

  const hasPermissions = permissions.edit || permissions.delete;

  if (!hasPermissions) {
    return <span className="text-muted fs-13">No actions</span>;
  }

  return (
    <div className="saas-action-dropdown" onClick={(e) => e.stopPropagation()}>
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
        <DropdownToggle
          tag="button"
          className="saas-btn-ghost"
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            borderRadius: "8px",
            width: "30px",
            height: "30px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <FiMoreHorizontal size={18} />
        </DropdownToggle>
        
        {/* container="body" renders it on body level so it never hides under borders. 
            We do NOT pass saas-dropdown-menu as a className here because its position/right styles override Popper's positioning,
            forcing it to the edge of the screen. Instead we style the container exactly like the class. */}
        <DropdownMenu
          container="body"
          style={{
            minWidth: "140px",
            width: "140px",
            padding: "4px",
            backgroundColor: "#ffffff",
            border: "1px solid var(--saas-border)",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
            zIndex: 10000
          }}
        >
          {permissions.edit && onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDropdownOpen(false);
                onEdit(row._id || row);
              }}
              className="saas-dropdown-item"
              style={{
                border: "none",
                background: "transparent",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                cursor: "pointer",
                padding: "8px 12px",
                fontSize: "13px"
              }}
            >
              <FiEdit size={14} />
              Edit
            </button>
          )}

          {permissions.delete && onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDropdownOpen(false);
                onDelete(row._id || row);
              }}
              className="saas-dropdown-item danger"
              style={{
                border: "none",
                background: "transparent",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                cursor: "pointer",
                padding: "8px 12px",
                fontSize: "13px"
              }}
            >
              <FiTrash size={14} />
              Delete
            </button>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ActionDropdown;
