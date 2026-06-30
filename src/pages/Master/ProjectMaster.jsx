import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { deleteProject, searchProjects } from "../../api/projects.api";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import { toast } from "react-toastify";
import { MenuContext } from "../../context/MenuContext";
import CustomPagination from "../../Components/Common/CustomPagination";
import ActionDropdown from "../../Components/Common/ActionDropdown";

const ProjectMaster = () => {
  const navigate = useNavigate();
  const { currentPagePermissions } = useContext(MenuContext);
  const [filter, setFilter] = useState(true);
  const [query, setQuery] = useState("");

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [remove_id, setRemove_id] = useState("");
  const [projects, setProjects] = useState([]);

  const tog_list = () => {
    navigate("/project-master/add");
  };

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const handleTog_edit = (_id) => {
    navigate(`/project-master/edit/${_id}`);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeleteLoading(true);
    deleteProject(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        fetchProjects();
        toast.success("Project Removed Successfully!");
      })
      .catch((err) => {
        console.log(err);
        setmodal_delete(false);
        toast.error("Failed to delete project.");
      }).finally(() => {
        setIsDeleteLoading(false);
      });
  };

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setmodal_delete(false);
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
    fetchProjects();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchProjects = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) skip = 0;

    await searchProjects({
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
          setProjects(res.data || []);
          setTotalRows(res.count || 0);
        } else {
          setProjects([]);
          setTotalRows(0);
        }
      }).catch((err) => {
        console.error(err);
        setProjects([]);
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
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      sortField: "title",
    },
    {
      name: "Slug",
      selector: (row) => row.slug,
      sortable: true,
      sortField: "slug",
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
      sortField: "category",
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

  document.title = `Project Master | Admin`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb maintitle="Portfolio" title="Project Master" pageTitle="Portfolio" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <FormsHeader
                    formName="Project Master"
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
                    data={projects}
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

export default ProjectMaster;
