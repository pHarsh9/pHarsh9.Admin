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
import { deleteInquiry, searchInquiries } from "../../api/inquiries.api";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import CustomPagination from "../../Components/Common/CustomPagination";
import ActionDropdown from "../../Components/Common/ActionDropdown";
import { toast } from "react-toastify";

const InquiryLogs = () => {
  const [inquiries, setInquiries] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [modal_detail, setModal_detail] = useState(false);
  const [modal_delete, setmodal_delete] = useState(false);
  const [remove_id, setRemove_id] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

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
    fetchInquiries();
  }, [pageNo, perPage, column, sortDirection, query]);

  const fetchInquiries = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) skip = 0;

    await searchInquiries({
      skip: skip,
      per_page: perPage,
      sorton: column,
      sortdir: sortDirection,
      match: query,
    })
      .then((response) => {
        if (response.data.data.length > 0) {
          let res = response.data.data[0];
          setInquiries(res.data || []);
          setTotalRows(res.count || 0);
        } else {
          setInquiries([]);
          setTotalRows(0);
        }
      }).catch((err) => {
        console.error(err);
        setInquiries([]);
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

  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeleteLoading(true);
    deleteInquiry(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        fetchInquiries();
        toast.success("Inquiry Deleted Successfully!");
      })
      .catch((err) => {
        console.log(err);
        setmodal_delete(false);
        toast.error("Failed to delete inquiry.");
      }).finally(() => {
        setIsDeleteLoading(false);
      });
  };

  const handleViewDetails = (row) => {
    setSelectedInquiry(row);
    setModal_detail(true);
  };

  const col = [
    {
      name: "Sr No",
      selector: (row, index) => index + 1 + (pageNo - 1) * perPage,
      width: "60px",
    },
    {
      name: "Sender Name",
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
    },
    {
      name: "Email Address",
      selector: (row) => row.email,
      sortable: true,
      sortField: "email",
    },
    {
      name: "Date Sent",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
      sortField: "createdAt",
    },
    {
      name: "Action",
      cell: (row) => {
        return (
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-soft-info" onClick={() => handleViewDetails(row)}>
              View
            </button>
            <button className="btn btn-sm btn-soft-danger" onClick={() => tog_delete(row._id)}>
              Delete
            </button>
          </div>
        );
      },
      width: "140px",
      right: true,
    },
  ];

  document.title = `Inquiry Logs | Admin`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb maintitle="Portfolio" title="Inquiry Logs" pageTitle="Portfolio" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <FormsHeader
                    formName="Inquiry Logs"
                    showFilter={false}
                    tog_list={() => {}}
                    setQuery={setQuery}
                    showAddButton={false}
                  />
                </CardHeader>

                <CardBody>
                  <DataTable
                    columns={col}
                    data={inquiries}
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

      {/* View Detail Modal */}
      <Modal isOpen={modal_detail} toggle={() => setModal_detail(false)} centered>
        <ModalHeader toggle={() => setModal_detail(false)}>
          Transmission Details
        </ModalHeader>
        <ModalBody>
          {selectedInquiry && (
            <div className="space-y-3">
              <div>
                <Label className="text-muted text-uppercase text-[10px]">Sender Name</Label>
                <h5>{selectedInquiry.name}</h5>
              </div>
              <hr />
              <div>
                <Label className="text-muted text-uppercase text-[10px]">Email Address</Label>
                <h5>{selectedInquiry.email}</h5>
              </div>
              <hr />
              <div>
                <Label className="text-muted text-uppercase text-[10px]">Date Sent</Label>
                <p>{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
              </div>
              <hr />
              <div>
                <Label className="text-muted text-uppercase text-[10px]">Message Details</Label>
                <p style={{ whiteSpace: "pre-wrap" }} className="bg-light p-3 rounded">
                  {selectedInquiry.message}
                </p>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>

      <DeleteModal
        show={modal_delete}
        handleDelete={handleDelete}
        toggle={() => setmodal_delete(false)}
        setmodal_delete={setmodal_delete}
        disabled={isDeleteLoading}
      />
    </React.Fragment>
  );
};

export default InquiryLogs;
