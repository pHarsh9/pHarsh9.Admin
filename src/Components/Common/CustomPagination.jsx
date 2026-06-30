import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CustomPagination = ({
  rowsPerPage,
  rowCount,
  onChangePage,
  onChangeRowsPerPage,
  currentPage
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const totalPages = Math.ceil(rowCount / rowsPerPage) || 1;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onChangePage(page);
  };

  const handleRowsPerPageChange = (val) => {
    onChangeRowsPerPage(val, currentPage);
  };

  return (
    <div className="saas-pagination border-0 w-100 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <span className="fs-13 text-muted d-none d-md-inline">Rows per page:</span>
        <Dropdown
          isOpen={dropdownOpen}
          toggle={() => setDropdownOpen(!dropdownOpen)}
          style={{ width: "70px" }}
          direction="up"
        >
          <DropdownToggle
            tag="button"
            className="form-select saas-input text-start w-100 d-flex align-items-center justify-content-between py-0 px-2"
            style={{ height: "30px", fontSize: "13px" }}
          >
            <span>{rowsPerPage}</span>
          </DropdownToggle>
          <DropdownMenu style={{ minWidth: "70px" }} className="p-0">
            <DropdownItem onClick={() => handleRowsPerPageChange(10)}>10</DropdownItem>
            <DropdownItem onClick={() => handleRowsPerPageChange(25)}>25</DropdownItem>
            <DropdownItem onClick={() => handleRowsPerPageChange(50)}>50</DropdownItem>
            <DropdownItem onClick={() => handleRowsPerPageChange(100)}>100</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <span className="fs-13 text-muted ms-2 d-none d-sm-inline">
          Showing {rowCount > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, rowCount)} of {rowCount}
        </span>
      </div>

      <div className="d-flex align-items-center gap-1">
        <button
          type="button"
          className="saas-btn-ghost"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          style={{ height: "30px", width: "30px" }}
        >
          <FiChevronLeft size={16} />
        </button>
        <span className="fs-13 fw-semibold px-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          className="saas-btn-ghost"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          style={{ height: "30px", width: "30px" }}
        >
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;
