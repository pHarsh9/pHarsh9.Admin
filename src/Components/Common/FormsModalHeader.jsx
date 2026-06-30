import React, { useState } from "react";
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { FiSearch, FiDownload } from "react-icons/fi";

const FormsHeader = ({
  formName,
  filter,
  handleFilter,
  tog_list,
  setQuery,
  showAddButton = true,
}) => {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  // Convert internal boolean/undefined state to select values
  const getSelectValue = () => {
    if (filter === undefined || filter === null) return "all";
    return filter ? "active" : "inactive";
  };

  const handleDropdownChange = (val) => {
    let mappedVal;
    if (val === "all") mappedVal = undefined;
    else if (val === "active") mappedVal = true;
    else mappedVal = false;

    if (handleFilter) {
      handleFilter({ target: { checked: mappedVal } });
    }
  };

  return (
    <React.Fragment>
      {/* Top Row: Title and Subtitle */}
      <Row className="mb-3 w-100 m-0">
        <Col lg={12} className="p-0">
          <h1 className="saas-page-title">{formName}</h1>
          <p className="saas-page-desc">
            Manage and configure all {formName.toLowerCase()} settings and system parameters.
          </p>
        </Col>
      </Row>

      {/* Bottom Row: Actions */}
      <Row className="align-items-center mb-0 g-3 w-100 m-0">
        <Col md={4} sm={12} className="d-flex align-items-center justify-content-start p-0">
          {handleFilter && (
            <Dropdown
              isOpen={filterDropdownOpen}
              toggle={() => setFilterDropdownOpen(!filterDropdownOpen)}
              style={{ width: "160px" }}
            >
              <DropdownToggle
                tag="button"
                className="form-select saas-input text-start w-100 d-flex align-items-center justify-content-between"
              >
                <span>
                  {getSelectValue() === "all" && "All"}
                  {getSelectValue() === "active" && "Active Only"}
                  {getSelectValue() === "inactive" && "Inactive Only"}
                </span>
              </DropdownToggle>
              <DropdownMenu className="w-100">
                <DropdownItem onClick={() => handleDropdownChange("all")}>
                  All
                </DropdownItem>
                <DropdownItem onClick={() => handleDropdownChange("active")}>
                  Active Only
                </DropdownItem>
                <DropdownItem onClick={() => handleDropdownChange("inactive")}>
                  Inactive Only
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </Col>
        <Col md={8} sm={12} className="d-flex align-items-center justify-content-md-end gap-2 flex-wrap p-0">
          {/* Search Box */}
          {setQuery && (
            <div className="saas-input-group" style={{ width: "240px" }}>
              <FiSearch className="saas-input-icon" />
              <input
                type="text"
                className="form-control saas-input saas-input-with-icon w-100"
                placeholder="Search"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}

          {/* Export button */}
          <button 
            type="button" 
            className="saas-btn-secondary"
            onClick={() => {
              alert(`${formName} data exported successfully.`);
            }}
          >
            <FiDownload size={16} />
          </button>

          {/* Add Button */}
          {showAddButton && (
            <button
              type="button"
              className="saas-btn-primary"
              onClick={() => tog_list()}
            >
              Add {formName}
            </button>
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default FormsHeader;
