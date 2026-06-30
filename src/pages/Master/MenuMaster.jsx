import React, { useContext, useState, useEffect, useRef } from "react";
import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Label,
    Input,
    Row,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import { toast } from "react-toastify";
import {
    createMenu,
    deleteMenu,
    getMenuById,
    updateMenu,
    searchMenus,
    getAllMenuGroups,
    getAllMenus,
} from "../../api/menus.api";
import Select from "react-select";
import { MenuContext } from "../../context/MenuContext";
import IconPicker from "../../Components/Common/IconPicker";

// Import custom styles and react-icons
import "./menuMasterCustom.css";
import ActionDropdown from "../../Components/Common/ActionDropdown";
import { 
    FiSearch, 
    FiFilter, 
    FiDownload, 
    FiMoreHorizontal, 
    FiEdit, 
    FiCopy, 
    FiArchive, 
    FiTrash, 
    FiChevronLeft, 
    FiChevronRight,
    FiCheck,
    FiX,
    FiArrowUp,
    FiArrowDown,
    FiChevronDown
} from "react-icons/fi";

const initialState = {
    menuName: "",
    menuGroup: "",
    menuUrl: "",
    sequence: "",
    isActive: false,
    isParent: false,
    parentMenu: null,
    icon: "",
};

const MenuMaster = () => {
    const { currentPagePermissions } = useContext(MenuContext);
    const [values, setValues] = useState(initialState);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [filter, setFilter] = useState("active");
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [paginationDropdownOpen, setPaginationDropdownOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const [departments, setDepartments] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [activeDropdownRow, setActiveDropdownRow] = useState(null);
    const dropdownRef = useRef(null);

    const [selectedMenuGroup, setSelectedMenuGroup] = useState(null);
    const [menuGroupList, setMenuGroupList] = useState([]);
    const [selectedParentMenu, setSelectedParentMenu] = useState(null);
    const [parentMenuList, setParentMenuList] = useState([]);

    // Handle clicks outside action dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdownRow(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchMenuGroupList = async () => {
        const response = await getAllMenuGroups();
        setMenuGroupList(response.data.data);
    };

    const fetchParentMenus = async (groupId) => {
        if (!groupId) return;

        try {
            const response = await getAllMenus();

            // Check the response structure and extract the data array
            const menuData = response.data.data;

            // Build parent-child relationships and menu paths for display
            const menuMap = new Map();
            const menuHierarchy = [];

            // First, create a map of all menus
            menuData.forEach(menu => {
                if (menu.menuGroup._id === groupId || menu.menuGroup === groupId) {
                    menuMap.set(menu._id.toString(), {
                        ...menu,
                        path: menu.menuName,
                        children: []
                    });
                }
            });

            // Build hierarchy and paths
            menuData.forEach(menu => {
                if (menu.menuGroup._id === groupId || menu.menuGroup === groupId) {
                    const menuId = menu._id.toString();

                    // If menu has parent and parent exists in our map
                    if (menu.parentMenu && menuMap.has(menu.parentMenu.toString())) {
                        const parentId = menu.parentMenu.toString();
                        const parent = menuMap.get(parentId);

                        // Add this menu as child to parent
                        parent.children.push(menuId);

                        // Update path to include parent path
                        const menuWithPath = menuMap.get(menuId);
                        menuWithPath.path = `${parent.path} > ${menuWithPath.path}`;
                        menuMap.set(menuId, menuWithPath);
                    } else if (!menu.parentMenu) {
                        // Top level menu (no parent)
                        menuHierarchy.push(menuId);
                    }
                }
            });

            // Filter menus that can be parents (and aren't the current menu being edited)
            // Allow any menu to be a parent except itself (to prevent circular references)
            const validParentMenus = Array.from(menuMap.values())
                .filter(menu => {
                    // In edit mode, don't allow selecting self as parent
                    if (_id && menu._id.toString() === _id.toString()) {
                        return false;
                    }

                    // Return all menus that are marked as isParent, regardless of whether they have parents
                    return menu.isParent === true;
                })
                .map(menu => ({
                    _id: menu._id,
                    menuName: menu.path, // Use path for display to show hierarchy
                    isParent: menu.isParent
                }));

            setParentMenuList(validParentMenus);
        } catch (error) {
            console.error("Error fetching parent menus:", error);
        }
    };

    useEffect(() => {
        fetchMenuGroupList();
    }, []);

    useEffect(() => {
        if (selectedMenuGroup) {
            fetchParentMenus(selectedMenuGroup.value);
        }
    }, [selectedMenuGroup]);

    const [query, setQuery] = useState("");

    const [_id, set_Id] = useState("");
    const [remove_id, setRemove_id] = useState("");

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log("no errors");
        }
    }, [formErrors, isSubmit]);

    const [modal_list, setmodal_list] = useState(false);
    const tog_list = () => {
        setmodal_list(!modal_list);
        setValues(initialState);
        setSelectedMenuGroup(null);
        setSelectedParentMenu(null);
        setIsSubmit(false);
    };

    const [modal_delete, setmodal_delete] = useState(false);
    const tog_delete = (_id) => {
        setmodal_delete(!modal_delete);
        setRemove_id(_id);
    };

    const [modal_edit, setmodal_edit] = useState(false);

    const handleTog_edit = (_id) => {
        setmodal_edit(!modal_edit);
        setIsSubmit(false);
        set_Id(_id);
        setIsLoading(true);
        getMenuById(_id)
            .then((res) => {
                setValues({
                    ...values,
                    menuName: res.data.data.menuName,
                    menuGroup: res.data.data.menuGroup,
                    menuUrl: res.data.data.menuUrl,
                    sequence: res.data.data.sequence,
                    isActive: res.data.data.isActive,
                    isParent: res.data.data.isParent || false,
                    parentMenu: res.data.data.parentMenu || null,
                    icon: res.data.data.icon || "",
                });
                setSelectedMenuGroup({
                    value: res.data.data.menuGroup._id,
                    label: res.data.data.menuGroup.menuGroupName,
                });

                // Set parent menu if exists
                if (res.data.data.parentMenu) {
                    fetchParentMenus(res.data.data.menuGroup._id).then(() => {
                        const parent = parentMenuList.find(
                            menu => menu._id === res.data.data.parentMenu
                        );
                        if (parent) {
                            setSelectedParentMenu({
                                value: parent._id,
                                label: parent.menuName,
                            });
                        }
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to fetch menu details");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleDuplicate = (row) => {
        setValues({
            menuName: `${row.menuName} (Copy)`,
            menuGroup: row.menuGroup?._id || row.menuGroup,
            menuUrl: row.menuUrl,
            sequence: (Number(row.sequence) + 1).toString(),
            isActive: row.isActive,
            isParent: row.isParent,
            parentMenu: row.parentMenu,
            icon: row.icon,
        });

        if (row.menuGroup) {
            setSelectedMenuGroup({
                value: row.menuGroup._id || row.menuGroup,
                label: row.menuGroup.menuGroupName || "Selected Group",
            });
        }

        setmodal_list(true);
        toast.info("Prefilled duplicate menu. Please review and save.");
    };

    const handleArchive = (row) => {
        setIsLoading(true);
        const dataToSend = {
            menuName: row.menuName,
            menuGroup: row.menuGroup?._id || row.menuGroup,
            menuUrl: row.menuUrl,
            sequence: row.sequence,
            isActive: false,
            isParent: row.isParent,
            parentMenu: row.parentMenu,
            icon: row.icon,
        };

        updateMenu(row._id, dataToSend)
            .then(() => {
                fetchDepartments();
                toast.success("Menu Archived (Deactivated) Successfully!");
            })
            .catch((err) => {
                console.log("Error archiving menu:", err);
                toast.error("Failed to archive menu");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCheck = (e) => {
        const { name, checked } = e.target;
        setValues({ ...values, [name]: checked });
    };

    const handleSubmitCancel = () => {
        setmodal_list(false);
        setValues(initialState);
        setIsSubmit(false);
    };

    const handleClick = (e) => {
        e.preventDefault();
        setFormErrors({});
        let errors = validate(values);
        setFormErrors(errors);
        setIsSubmit(true);

        const dataToSend = {
            ...values,
            menuGroup: selectedMenuGroup ? selectedMenuGroup.value : null,
            parentMenu: selectedParentMenu ? selectedParentMenu.value : null,
            isParent: values.isParent
        };

        if (Object.keys(errors).length === 0) {
            setIsLoading(true);
            createMenu(dataToSend)
                .then((res) => {
                    if (res.data.isOk) {
                        toast.success("Menu Added Successfully!");
                        setmodal_list(!modal_list);
                        setValues(initialState);
                        setSelectedParentMenu(null);
                        fetchDepartments();
                    }
                })
                .catch((error) => {
                    console.log("Error creating menu master:", error);
                    toast.error("Failed to add menu. Please try again.");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        setIsDeleteLoading(true);
        deleteMenu(remove_id)
            .then((res) => {
                setmodal_delete(!modal_delete);
                toast.success("Menu Removed Successfully!");
                fetchDepartments();
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to remove menu. Please try again.");
            })
            .finally(() => {
                setIsDeleteLoading(false);
            });
    };

    const handleDeleteClose = (e) => {
        if (e) e.preventDefault();
        setmodal_delete(false);
    };

    const handleUpdateCancel = (e) => {
        setmodal_edit(false);
        setIsSubmit(false);
        setFormErrors({});
        setValues(initialState);
        setSelectedMenuGroup(null);
        setSelectedParentMenu(null);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        let erros = validate(values);
        setFormErrors(erros);
        setIsSubmit(true);

        if (Object.keys(erros).length === 0) {
            setIsLoading(true);
            const dataToSend = {
                ...values,
                menuGroup: selectedMenuGroup ? selectedMenuGroup.value : null,
                parentMenu: selectedParentMenu ? selectedParentMenu.value : null,
            };
            updateMenu(_id, dataToSend)
                .then((res) => {
                    setmodal_edit(!modal_edit);
                    setValues(initialState);
                    setSelectedMenuGroup(null);
                    setSelectedParentMenu(null);
                    fetchDepartments();
                    toast.success("Menu Updated Successfully!");
                })
                .catch((err) => {
                    console.log("Error updating menu master:", err);
                    toast.error("Failed to update menu. Please try again.");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const validate = (values) => {
        const errors = {};

        if (!values.menuName || values.menuName.trim() === "") {
            errors.menuName = "Menu Name is required!";
        }

        if (selectedMenuGroup === null) {
            errors.menuGroup = "Menu Group is required!";
        }

        // Only require URL for non-parent menus
        if (!values.isParent && (!values.menuUrl || values.menuUrl.trim() === "")) {
            errors.menuUrl = "Menu URL is required for non-parent menus!";
        }

        if (values.sequence === "" || values.sequence === undefined) {
            errors.sequence = "Sequence is required!";
        }

        return errors;
    };

    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(100);
    const [pageNo, setPageNo] = useState(1);
    const [column, setcolumn] = useState("menuName");
    const [sortDirection, setsortDirection] = useState("asc");

    const handleSort = (field) => {
        const isAsc = column === field && sortDirection === "asc";
        setcolumn(field);
        setsortDirection(isAsc ? "desc" : "asc");
    };

    useEffect(() => {
        fetchDepartments();
    }, [pageNo, perPage, column, sortDirection, query, filter]);

    const fetchDepartments = async () => {
        setLoading(true);
        let skip = (pageNo - 1) * perPage;
        if (skip < 0) {
            skip = 0;
        }

        try {
            const response = await searchMenus({
                skip: skip,
                per_page: perPage,
                sorton: column,
                sortdir: sortDirection,
                match: query,
                isActive: filter === "all" ? undefined : (filter === "active" ? true : false),
            });

            if (response.data.data.length > 0) {
                let res = response.data.data[0];
                setTotalRows(res.count);
                setDepartments(res.data);
            } else {
                setDepartments([]);
                setTotalRows(0);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch menus list");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setPageNo(page);
    };

    const handlePerRowsChange = (e) => {
        setPerPage(Number(e.target.value));
        setPageNo(1);
    };

    const totalPages = Math.ceil(totalRows / perPage) || 1;

    document.title = `Menu Master | Shree Balaji Trade-Wing`;

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Breadcrumbs */}
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <BreadCrumb
                            maintitle="Master"
                            title="Menu Master"
                            pageTitle="Master"
                        />
                    </div>

                    {/* Page Header exactly as shown in screenshot */}
                    <Row className="mb-3">
                        <Col lg={12}>
                            <h1 className="saas-page-title">Menu Master</h1>
                            <p className="saas-page-desc">Manage and configure all system menus and their access.</p>
                        </Col>
                    </Row>
                    <Row className="align-items-center mb-4 g-3">
                        <Col md={4} className="d-flex align-items-center justify-content-start">
                            {/* Filter Dropdown on the left side below title */}
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
                                        {filter === "all" && "All"}
                                        {filter === "active" && "Active Only"}
                                        {filter === "inactive" && "Inactive Only"}
                                    </span>
                                </DropdownToggle>
                                <DropdownMenu className="w-100">
                                    <DropdownItem onClick={() => {
                                        setPageNo(1);
                                        setFilter("all");
                                    }}>
                                        All
                                    </DropdownItem>
                                    <DropdownItem onClick={() => {
                                        setPageNo(1);
                                        setFilter("active");
                                    }}>
                                        Active Only
                                    </DropdownItem>
                                    <DropdownItem onClick={() => {
                                        setPageNo(1);
                                        setFilter("inactive");
                                    }}>
                                        Inactive Only
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                        <Col md={8} className="d-flex align-items-center justify-content-md-end gap-2 flex-wrap">
                            <div className="saas-input-group" style={{ width: "240px" }}>
                                <FiSearch className="saas-input-icon" />
                                <input
                                    type="text"
                                    className="form-control saas-input saas-input-with-icon w-100"
                                    placeholder="Search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>

                            <button 
                                type="button" 
                                className="saas-btn-secondary"
                                onClick={() => {
                                    toast.info("Menu data exported successfully");
                                }}
                            >
                                <FiDownload size={16} />
                            </button>

                            {currentPagePermissions.write && (
                                <button 
                                    type="button" 
                                    className="saas-btn-primary"
                                    onClick={tog_list}
                                >
                                    Add Menu
                                </button>
                            )}
                        </Col>
                    </Row>

                    {/* Table Container Card */}
                    <Card className="saas-card">
                        <CardBody className="saas-card-body p-0">
                            <div className="saas-table-container border-0">
                                <table className="saas-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "80px" }}>Sr No</th>
                                            <th className="cursor-pointer" onClick={() => handleSort("menuName")}>
                                                Menu Name
                                                {column === "menuName" ? (
                                                    sortDirection === "asc" ? <FiArrowUp className="sort-indicator active" /> : <FiArrowDown className="sort-indicator active" />
                                                ) : <FiChevronDown className="sort-indicator" style={{ opacity: 0.3 }} />}
                                            </th>
                                            <th className="cursor-pointer" onClick={() => handleSort("menuGroup.menuGroupName")}>
                                                Menu Group
                                                {column === "menuGroup.menuGroupName" ? (
                                                    sortDirection === "asc" ? <FiArrowUp className="sort-indicator active" /> : <FiArrowDown className="sort-indicator active" />
                                                ) : <FiChevronDown className="sort-indicator" style={{ opacity: 0.3 }} />}
                                            </th>
                                            <th>Menu URL</th>
                                            <th className="cursor-pointer" onClick={() => handleSort("sequence")}>
                                                Sequence
                                                {column === "sequence" ? (
                                                    sortDirection === "asc" ? <FiArrowUp className="sort-indicator active" /> : <FiArrowDown className="sort-indicator active" />
                                                ) : <FiChevronDown className="sort-indicator" style={{ opacity: 0.3 }} />}
                                            </th>
                                            <th>Status</th>
                                            <th style={{ width: "100px", textAlign: "right" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-5 text-muted">
                                                    <div className="spinner-border spinner-border-sm text-dark me-2" role="status"></div>
                                                    Loading menu items...
                                                </td>
                                            </tr>
                                        ) : departments.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-5 text-muted">
                                                    No menus found. Try adjusting your search query.
                                                </td>
                                            </tr>
                                        ) : (
                                            departments.map((row, index) => {
                                                const srNo = (pageNo - 1) * perPage + index + 1;
                                                const groupName = row.menuGroup?.menuGroupName || row.menuGroup || "";
                                                
                                                return (
                                                    <tr key={row._id}>
                                                        <td className="fw-semibold text-dark">{srNo}</td>
                                                        <td className="text-dark">{row.menuName}</td>
                                                        <td>{groupName}</td>
                                                        <td className="text-muted">{row.menuUrl || "/"}</td>
                                                        <td className="text-dark">{row.sequence}</td>
                                                        <td>
                                                            {row.isActive ? (
                                                                <span className="saas-status-dot-active">Active</span>
                                                            ) : (
                                                                <span className="saas-status-dot-inactive">Inactive</span>
                                                            )}
                                                        </td>
                                                         <td style={{ textAlign: "right" }}>
                                                             <ActionDropdown
                                                                 row={row}
                                                                 onEdit={handleTog_edit}
                                                                 onDelete={tog_delete}
                                                                 permissions={currentPagePermissions}
                                                             />
                                                         </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>

                                {/* Pagination panel */}
                                <div className="saas-pagination border-0">
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="fs-13 text-muted d-none d-md-inline">Rows per page:</span>
                                        <Dropdown
                                             isOpen={paginationDropdownOpen}
                                             toggle={() => setPaginationDropdownOpen(!paginationDropdownOpen)}
                                             style={{ width: "70px" }}
                                         >
                                             <DropdownToggle
                                                 tag="button"
                                                 className="form-select saas-input text-start w-100 d-flex align-items-center justify-content-between py-0 px-2"
                                                 style={{ height: "30px", fontSize: "13px" }}
                                             >
                                                 <span>{perPage}</span>
                                             </DropdownToggle>
                                             <DropdownMenu style={{ minWidth: "70px" }} className="p-0">
                                                 <DropdownItem onClick={() => handlePerRowsChange({ target: { value: 10 } })}>10</DropdownItem>
                                                 <DropdownItem onClick={() => handlePerRowsChange({ target: { value: 25 } })}>25</DropdownItem>
                                                 <DropdownItem onClick={() => handlePerRowsChange({ target: { value: 50 } })}>50</DropdownItem>
                                                 <DropdownItem onClick={() => handlePerRowsChange({ target: { value: 100 } })}>100</DropdownItem>
                                             </DropdownMenu>
                                         </Dropdown>
                                        <span className="fs-13 text-muted ms-2 d-none d-sm-inline">
                                            Showing {departments.length > 0 ? (pageNo - 1) * perPage + 1 : 0} to {Math.min(pageNo * perPage, totalRows)} of {totalRows}
                                        </span>
                                    </div>

                                    <div className="d-flex align-items-center gap-1">
                                        <button
                                            type="button"
                                            className="saas-btn-ghost"
                                            disabled={pageNo === 1}
                                            onClick={() => handlePageChange(pageNo - 1)}
                                            style={{ height: "30px", width: "30px" }}
                                        >
                                            <FiChevronLeft size={16} />
                                        </button>
                                        <span className="fs-13 fw-semibold px-2">
                                            Page {pageNo} of {totalPages}
                                        </span>
                                        <button
                                            type="button"
                                            className="saas-btn-ghost"
                                            disabled={pageNo === totalPages}
                                            onClick={() => handlePageChange(pageNo + 1)}
                                            style={{ height: "30px", width: "30px" }}
                                        >
                                            <FiChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Container>
            </div>

            {/* Add Modal */}
            <Modal
                isOpen={modal_list}
                toggle={tog_list}
                centered
            >
                <ModalHeader toggle={tog_list} className="bg-white">
                    <span className="fw-semibold fs-16">Add Menu Master</span>
                </ModalHeader>
                <form onSubmit={handleClick}>
                    <ModalBody>
                        <div className="mb-4">
                            <label className="form-label text-muted fs-13 fw-medium mb-1">
                                Menu Group <span className="text-danger">*</span>
                            </label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="Select menu group..."
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        minHeight: "44px",
                                        borderRadius: "8px",
                                        borderColor: state.isFocused ? "#111111" : "#E5E7EB",
                                        boxShadow: state.isFocused ? "0 0 0 2px rgba(17, 24, 39, 0.08)" : "none",
                                        "&:hover": {
                                            borderColor: "#111111"
                                        }
                                    })
                                }}
                                options={menuGroupList.map((menuGroup) => ({
                                    value: menuGroup._id,
                                    label: menuGroup.menuGroupName,
                                }))}
                                value={selectedMenuGroup}
                                onChange={(selectedOption) => {
                                    setSelectedMenuGroup(selectedOption);
                                }}
                            />
                            {isSubmit && formErrors.menuGroup && (
                                <p className="text-danger fs-12 mt-1 mb-0">{formErrors.menuGroup}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-muted fs-13 fw-medium mb-1">
                                Menu Name <span className="text-danger">*</span>
                            </label>
                            <Input
                                type="text"
                                className="saas-input w-100"
                                name="menuName"
                                placeholder="e.g. User Settings"
                                value={values.menuName}
                                onChange={handleChange}
                            />
                            {isSubmit && formErrors.menuName && (
                                <p className="text-danger fs-12 mt-1 mb-0">{formErrors.menuName}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-muted fs-13 fw-medium mb-1">
                                Menu URL <span className="text-danger">*</span>
                            </label>
                            <Input
                                type="text"
                                className="saas-input w-100"
                                name="menuUrl"
                                placeholder="/settings/users"
                                value={values.menuUrl}
                                onChange={handleChange}
                            />
                            {isSubmit && formErrors.menuUrl && (
                                <p className="text-danger fs-12 mt-1 mb-0">{formErrors.menuUrl}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <IconPicker
                                value={values.icon}
                                onChange={(icon) => setValues({ ...values, icon })}
                                label="Menu Icon"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-muted fs-13 fw-medium mb-1">
                                Sequence <span className="text-danger">*</span>
                            </label>
                            <Input
                                type="number"
                                className="saas-input w-100"
                                name="sequence"
                                min={1}
                                placeholder="e.g. 1"
                                value={values.sequence}
                                onChange={handleChange}
                            />
                            {isSubmit && formErrors.sequence && (
                                <p className="text-danger fs-12 mt-1 mb-0">{formErrors.sequence}</p>
                            )}
                        </div>

                        <div className="d-flex flex-column gap-2 mb-4">
                            <div className="form-check d-flex align-items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input saas-checkbox"
                                    name="isActive"
                                    id="isActiveCheckbox"
                                    checked={values.isActive}
                                    onChange={handleCheck}
                                />
                                <label className="form-check-label fs-14 fw-medium text-dark ms-1 mb-0" htmlFor="isActiveCheckbox">
                                    Is Active
                                </label>
                            </div>

                            <div className="form-check d-flex align-items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input saas-checkbox"
                                    name="isParent"
                                    id="isParentCheckbox"
                                    checked={values.isParent}
                                    onChange={handleCheck}
                                />
                                <label className="form-check-label fs-14 fw-medium text-dark ms-1 mb-0" htmlFor="isParentCheckbox">
                                    Is Parent Menu (can contain nested items)
                                </label>
                            </div>
                        </div>

                        <div className="mb-2">
                            <label className="form-label text-muted fs-13 fw-medium mb-1">
                                Parent Menu (Optional)
                            </label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="Select parent menu..."
                                isClearable
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        minHeight: "44px",
                                        borderRadius: "8px",
                                        borderColor: state.isFocused ? "#111111" : "#E5E7EB",
                                        boxShadow: state.isFocused ? "0 0 0 2px rgba(17, 24, 39, 0.08)" : "none",
                                        "&:hover": {
                                            borderColor: "#111111"
                                        }
                                    })
                                }}
                                options={parentMenuList.map((menu) => ({
                                    value: menu._id,
                                    label: menu.menuName,
                                }))}
                                value={selectedParentMenu}
                                onChange={(selectedOption) => {
                                    setSelectedParentMenu(selectedOption);
                                }}
                            />
                            <small className="form-text text-muted d-block mt-1">
                                Nest this menu item under an existing hierarchy.
                            </small>
                        </div>
                    </ModalBody>
                    <ModalFooter className="bg-white">
                        <button type="button" className="saas-btn-secondary" onClick={handleSubmitCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="saas-btn-primary" disabled={isLoading}>
                            Save Menu
                        </button>
                    </ModalFooter>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={modal_edit}
                toggle={handleUpdateCancel}
                centered
            >
                <ModalHeader toggle={handleUpdateCancel} className="bg-white">
                    <span className="fw-semibold fs-16">Edit Menu Master</span>
                </ModalHeader>
                <form onSubmit={handleUpdate}>
                    <ModalBody>
                        <div className="mb-4">
                            <label className="form-label text-muted fs-13 fw-medium mb-1">
                                Menu Group <span className="text-danger">*</span>
                            </label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="Select menu group..."
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        minHeight: "44px",
                                        borderRadius: "8px",
                                        borderColor: state.isFocused ? "#111111" : "#E5E7EB",
                                        boxShadow: state.isFocused ? "0 0 0 2px rgba(17, 24, 39, 0.08)" : "none",
                                        "&:hover": {
                                            borderColor: "#111111"
                                        }
                                    })
                                }}
                                options={menuGroupList.map((menuGroup) => ({
                                    value: menuGroup._id,
                                    label: menuGroup.menuGroupName,
                                }))}
                                value={selectedMenuGroup}
                                onChange={(selectedOption) => {
                                    setSelectedMenuGroup(selectedOption);
                                }}
                            />
                            {isSubmit && formErrors.menuGroup && (
                                <p className="text-danger fs-12 mt-1 mb-0">{formErrors.menuGroup}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-muted fs-13 fw-medium mb-1">
                                Menu Name <span className="text-danger">*</span>
                            </label>
                            <Input
                                type="text"
                                className="saas-input w-100"
                                name="menuName"
                                placeholder="e.g. User Settings"
                                value={values.menuName}
                                onChange={handleChange}
                            />
                            {isSubmit && formErrors.menuName && (
                                <p className="text-danger fs-12 mt-1 mb-0">{formErrors.menuName}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-muted fs-13 fw-medium mb-1">
                                Menu URL <span className="text-danger">*</span>
                            </label>
                            <Input
                                type="text"
                                className="saas-input w-100"
                                name="menuUrl"
                                placeholder="/settings/users"
                                value={values.menuUrl}
                                onChange={handleChange}
                            />
                            {isSubmit && formErrors.menuUrl && (
                                <p className="text-danger fs-12 mt-1 mb-0">{formErrors.menuUrl}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <IconPicker
                                value={values.icon}
                                onChange={(icon) => setValues({ ...values, icon })}
                                label="Menu Icon"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-muted fs-13 fw-medium mb-1">
                                Sequence <span className="text-danger">*</span>
                            </label>
                            <Input
                                type="number"
                                className="saas-input w-100"
                                name="sequence"
                                min={1}
                                placeholder="e.g. 1"
                                value={values.sequence}
                                onChange={handleChange}
                            />
                            {isSubmit && formErrors.sequence && (
                                <p className="text-danger fs-12 mt-1 mb-0">{formErrors.sequence}</p>
                            )}
                        </div>

                        <div className="d-flex flex-column gap-2 mb-4">
                            <div className="form-check d-flex align-items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input saas-checkbox"
                                    name="isActive"
                                    id="isActiveCheckboxEdit"
                                    checked={values.isActive}
                                    onChange={handleCheck}
                                />
                                <label className="form-check-label fs-14 fw-medium text-dark ms-1 mb-0" htmlFor="isActiveCheckboxEdit">
                                    Is Active
                                </label>
                            </div>

                            <div className="form-check d-flex align-items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input saas-checkbox"
                                    name="isParent"
                                    id="isParentCheckboxEdit"
                                    checked={values.isParent}
                                    onChange={handleCheck}
                                />
                                <label className="form-check-label fs-14 fw-medium text-dark ms-1 mb-0" htmlFor="isParentCheckboxEdit">
                                    Is Parent Menu (can contain nested items)
                                </label>
                            </div>
                        </div>

                        <div className="mb-2">
                            <label className="form-label text-muted fs-13 fw-medium mb-1">
                                Parent Menu (Optional)
                            </label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="Select parent menu..."
                                isClearable
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        minHeight: "44px",
                                        borderRadius: "8px",
                                        borderColor: state.isFocused ? "#111111" : "#E5E7EB",
                                        boxShadow: state.isFocused ? "0 0 0 2px rgba(17, 24, 39, 0.08)" : "none",
                                        "&:hover": {
                                            borderColor: "#111111"
                                        }
                                    })
                                }}
                                options={parentMenuList.map((menu) => ({
                                    value: menu._id,
                                    label: menu.menuName,
                                }))}
                                value={selectedParentMenu}
                                onChange={(selectedOption) => {
                                    setSelectedParentMenu(selectedOption);
                                }}
                            />
                            <small className="form-text text-muted d-block mt-1">
                                Nest this menu item under an existing hierarchy.
                            </small>
                        </div>
                    </ModalBody>
                    <ModalFooter className="bg-white">
                        <button type="button" className="saas-btn-secondary" onClick={handleUpdateCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="saas-btn-primary" disabled={isLoading}>
                            Save Changes
                        </button>
                    </ModalFooter>
                </form>
            </Modal>

            <DeleteModal
                show={modal_delete}
                handleDelete={handleDelete}
                toggle={handleDeleteClose}
                setmodal_delete={setmodal_delete}
                disabled={isDeleteLoading}
            />
        </React.Fragment>
    );
};

export default MenuMaster;
