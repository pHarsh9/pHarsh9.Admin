import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  Row,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { createExperience, getExperienceById, deleteExperience, updateExperience, searchExperiences } from "../../api/experiences.api";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import FormUpdateFooter from "../../Components/Common/FormUpdateFooter";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { MenuContext } from "../../context/MenuContext";
import CustomPagination from "../../Components/Common/CustomPagination";
import ActionDropdown from "../../Components/Common/ActionDropdown";

const initialState = {
  company: "",
  role: "",
  period: "",
  description: "",
  bulletPointsString: "",
  isActive: true,
};

const ExperienceMaster = () => {
  const { adminData } = useContext(AuthContext);
  const { currentPagePermissions } = useContext(MenuContext);
  const [values, setValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);
  const [query, setQuery] = useState("");

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditFetching, setIsEditFetching] = useState(false);

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");
  const [experiences, setExperiences] = useState([]);

  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
    setValues(initialState);
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
    setIsEditFetching(true);
    getExperienceById(_id)
      .then((res) => {
        const data = res.data.data;
        setValues({
          ...initialState,
          ...data,
          bulletPointsString: (data.bulletPoints || []).join("\n"),
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch experience details");
      }).finally(() => {
        setIsEditFetching(false);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    setValues({ ...values, isActive: e.target.checked });
  };

  const handleSubmitCancel = () => {
    setmodal_list(false);
    setValues(initialState);
    setIsSubmit(false);
  };

  const parseBulletPoints = (str) => {
    return str.split("\n").map(line => line.trim()).filter(line => line !== "");
  };

  const handleClick = (e) => {
    e.preventDefault();
    setFormErrors({});
    let errors = validate(values);
    setFormErrors(errors);
    setIsSubmit(true);
    if (Object.keys(errors).length === 0) {
      setIsSubmitLoading(true);
      const payload = {
        ...values,
        bulletPoints: parseBulletPoints(values.bulletPointsString),
      };
      createExperience(payload)
        .then((res) => {
          if (res.data.isOk) {
            toast.success("Experience Added Successfully!");
            setmodal_list(!modal_list);
            setValues(initialState);
            fetchExperiences();
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to add experience.");
        }).finally(() => {
          setIsSubmitLoading(false);
        });
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeleteLoading(true);
    deleteExperience(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        fetchExperiences();
        toast.success("Experience Removed Successfully!");
      })
      .catch((err) => {
        console.log(err);
        setmodal_delete(false);
        toast.error("Failed to delete experience.");
      }).finally(() => {
        setIsDeleteLoading(false);
      });
  };

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setmodal_delete(false);
  };

  const handleUpdateCancel = (e) => {
    setmodal_edit(false);
    setIsSubmit(false);
    setFormErrors({});
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);
    if (Object.keys(erros).length === 0) {
      setIsUpdateLoading(true);
      const payload = {
        ...values,
        bulletPoints: parseBulletPoints(values.bulletPointsString),
      };
      updateExperience(_id, payload)
        .then((res) => {
          setmodal_edit(!modal_edit);
          fetchExperiences();
          toast.success("Experience Updated Successfully!");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to update experience.");
        }).finally(() => {
          setIsUpdateLoading(false);
        });
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.company) errors.company = "Company is required!";
    if (!values.role) errors.role = "Role is required!";
    if (!values.period) errors.period = "Period is required!";
    if (!values.description) errors.description = "Description is required!";
    return errors;
  };

  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();

  const handleSort = (column, sortDirection) => {
    setcolumn(column.sortField);
    setsortDirection(sortDirection);
  };

  useEffect(() => {
    fetchExperiences();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchExperiences = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) skip = 0;

    await searchExperiences({
      skip: skip,
      per_page: perPage,
      sorton: column,
      sortdir: sortDirection,
      match: query,
      isActive: filter,
    })
      .then((response) => {
        if (response.data.data.length > 0) {
          let res = response.data.data[0];
          setExperiences(res.data || []);
          setTotalRows(res.count || 0);
        } else {
          setExperiences([]);
          setTotalRows(0);
        }
      }).catch((err) => {
        console.error(err);
        setExperiences([]);
      }).finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPerPage(newPerPage);
  };

  const handleFilter = (e) => {
    setFilter(e.target.checked);
  };

  const col = [
    {
      name: "Sr No",
      selector: (row, index) => index + 1 + (pageNo - 1) * perPage,
      width: "60px",
    },
    {
      name: "Company",
      selector: (row) => row.company,
      sortable: true,
      sortField: "company",
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      sortField: "role",
    },
    {
      name: "Period",
      selector: (row) => row.period,
      sortable: true,
      sortField: "period",
    },
    {
      name: "Status",
      cell: (row) => (
        row.isActive ? (
          <span className="badge bg-success">Active</span>
        ) : (
          <span className="badge bg-danger">Inactive</span>
        )
      ),
      width: "100px",
    },
    {
      name: "Action",
      cell: (row) => {
        return (
          <ActionDropdown
            row={row}
            onEdit={handleTog_edit}
            onDelete={tog_delete}
            permissions={currentPagePermissions || { write: true, delete: true }}
          />
        );
      },
      width: "100px",
      right: true,
    },
  ];

  document.title = `Experience Master | Admin`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb maintitle="Portfolio" title="Experience Master" pageTitle="Portfolio" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <FormsHeader
                    formName="Experience Master"
                    filter={filter}
                    handleFilter={handleFilter}
                    tog_list={tog_list}
                    setQuery={setQuery}
                    currentPagePermissions={currentPagePermissions || { write: true }}
                    showAddButton={true}
                  />
                </CardHeader>

                <CardBody>
                  <DataTable
                    columns={col}
                    data={experiences}
                    progressPending={loading}
                    sortServer
                    onSort={handleSort}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    paginationComponent={CustomPagination}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Add / Edit Form Modal */}
      <Modal isOpen={modal_list || modal_edit} toggle={modal_list ? tog_list : handleTog_edit} centered>
        <ModalHeader toggle={modal_list ? handleSubmitCancel : handleUpdateCancel}>
          {modal_list ? "Add Experience" : "Edit Experience"}
        </ModalHeader>
        <form onSubmit={modal_list ? handleClick : handleUpdate}>
          <ModalBody>
            <div className="mb-3">
              <Label>Company Name *</Label>
              <Input type="text" name="company" value={values.company} onChange={handleChange} required />
              {isSubmit && formErrors.company && <p className="text-danger">{formErrors.company}</p>}
            </div>
            <div className="mb-3">
              <Label>Role *</Label>
              <Input type="text" name="role" value={values.role} onChange={handleChange} required />
              {isSubmit && formErrors.role && <p className="text-danger">{formErrors.role}</p>}
            </div>
            <div className="mb-3">
              <Label>Period * (e.g. 2024 — PRESENT)</Label>
              <Input type="text" name="period" value={values.period} onChange={handleChange} required />
              {isSubmit && formErrors.period && <p className="text-danger">{formErrors.period}</p>}
            </div>
            <div className="mb-3">
              <Label>Short Description *</Label>
              <Input type="textarea" name="description" value={values.description} onChange={handleChange} required />
              {isSubmit && formErrors.description && <p className="text-danger">{formErrors.description}</p>}
            </div>
            <div className="mb-3">
              <Label>Bullet Achievements (One per line)</Label>
              <Input type="textarea" rows={5} name="bulletPointsString" value={values.bulletPointsString} onChange={handleChange} placeholder="e.g. Reduced telemetry latency by 35%&#10;Deployed eBPF network telemetry filters" />
            </div>
            <div className="mb-3">
              <Input type="checkbox" className="form-check-input" name="isActive" checked={values.isActive} onChange={handleCheck} />
              <Label className="form-check-label ms-2">Is Active</Label>
            </div>
          </ModalBody>
          <ModalFooter>
            {modal_list ? (
              <FormsFooter handleSubmit={handleClick} handleSubmitCancel={handleSubmitCancel} isLoading={isSubmitLoading} />
            ) : (
              <FormUpdateFooter handleUpdate={handleUpdate} handleUpdateCancel={handleUpdateCancel} isLoading={isUpdateLoading || isEditFetching} />
            )}
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

export default ExperienceMaster;
