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
import { createSkill, getSkillById, deleteSkill, updateSkill, searchSkills } from "../../api/skills.api";
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
  category: "",
  skillsString: "",
  isActive: true,
};

const SkillMaster = () => {
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
  const [skills, setSkills] = useState([]);

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
    getSkillById(_id)
      .then((res) => {
        const data = res.data.data;
        setValues({
          ...initialState,
          ...data,
          skillsString: (data.skills || []).join(", "),
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch skill details");
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

  const parseSkills = (str) => {
    return str.split(",").map(s => s.trim()).filter(s => s !== "");
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
        skills: parseSkills(values.skillsString),
      };
      createSkill(payload)
        .then((res) => {
          if (res.data.isOk) {
            toast.success("Skill Added Successfully!");
            setmodal_list(!modal_list);
            setValues(initialState);
            fetchSkills();
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to add skill.");
        }).finally(() => {
          setIsSubmitLoading(false);
        });
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeleteLoading(true);
    deleteSkill(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        fetchSkills();
        toast.success("Skill Removed Successfully!");
      })
      .catch((err) => {
        console.log(err);
        setmodal_delete(false);
        toast.error("Failed to delete skill.");
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
        skills: parseSkills(values.skillsString),
      };
      updateSkill(_id, payload)
        .then((res) => {
          setmodal_edit(!modal_edit);
          fetchSkills();
          toast.success("Skill Updated Successfully!");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to update skill.");
        }).finally(() => {
          setIsUpdateLoading(false);
        });
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.category) errors.category = "Category is required!";
    if (!values.skillsString) errors.skillsString = "Skills list is required!";
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
    fetchSkills();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchSkills = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) skip = 0;

    await searchSkills({
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
          setSkills(res.data || []);
          setTotalRows(res.count || 0);
        } else {
          setSkills([]);
          setTotalRows(0);
        }
      }).catch((err) => {
        console.error(err);
        setSkills([]);
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
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
      sortField: "category",
    },
    {
      name: "Skills",
      selector: (row) => (row.skills || []).join(", "),
      sortable: false,
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

  document.title = `Skill Master | Admin`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb maintitle="Portfolio" title="Skill Master" pageTitle="Portfolio" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <FormsHeader
                    formName="Skill Master"
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
                    data={skills}
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
          {modal_list ? "Add Skill Category" : "Edit Skill Category"}
        </ModalHeader>
        <form onSubmit={modal_list ? handleClick : handleUpdate}>
          <ModalBody>
            <div className="mb-3">
              <Label>Skill Category * (e.g. LANGUAGES, FRAMEWORKS)</Label>
              <Input type="text" name="category" value={values.category} onChange={handleChange} required />
              {isSubmit && formErrors.category && <p className="text-danger">{formErrors.category}</p>}
            </div>
            <div className="mb-3">
              <Label>Skills * (comma separated)</Label>
              <Input type="textarea" rows={4} name="skillsString" value={values.skillsString} onChange={handleChange} required placeholder="e.g. Typescript, Swift, Node.js, Go" />
              {isSubmit && formErrors.skillsString && <p className="text-danger">{formErrors.skillsString}</p>}
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

export default SkillMaster;
