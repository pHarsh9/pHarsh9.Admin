import React, { useContext } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { AuthContext } from "../../context/AuthContext";
import { 
  FiUsers, 
  FiActivity, 
  FiMail, 
  FiCheckCircle, 
  FiArrowUpRight, 
  FiSettings, 
  FiLock,
  FiFileText
} from "react-icons/fi";

const Dashboard = () => {
  const { adminData } = useContext(AuthContext);
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  const greeting = getGreeting();
  const displayName = adminData?.employeeName || adminData?.companyName || "Administrator";

  document.title = `Dashboard | ${adminData?.companyName || "Admin"}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Elegant Breadcrumb */}
          <BreadCrumb title="Dashboard" pageTitle="Home" />

          {/* Premium Page Header */}
          <Row className="mb-3">
            <Col lg={12}>
              <h1 className="saas-page-title">{greeting}, {displayName}</h1>
              <p className="saas-page-desc">Here is the operations summary for {adminData?.companyName || "your platform"} today.</p>
            </Col>
          </Row>

          {/* Premium Metric Grid - Monochrome styling */}
          <Row className="mb-4 g-4">
            {/* Metric 1 */}
            <Col xl={3} md={6}>
              <Card className="saas-card m-0" style={{ height: "100%" }}>
                <CardBody className="p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="text-muted fs-13 fw-semibold text-uppercase tracking-wider">Active Employees</span>
                      <div className="p-2 bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                        <FiUsers size={18} className="text-dark" />
                      </div>
                    </div>
                    <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "28px", letterSpacing: "-0.03em" }}>48</h2>
                  </div>
                  <div className="d-flex align-items-center gap-1 mt-3">
                    <span className="fs-12 fw-semibold text-dark d-inline-flex align-items-center gap-1">
                      <FiArrowUpRight size={14} className="text-success" />
                      +4.2%
                    </span>
                    <span className="text-muted fs-12">from last month</span>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Metric 2 */}
            <Col xl={3} md={6}>
              <Card className="saas-card m-0" style={{ height: "100%" }}>
                <CardBody className="p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="text-muted fs-13 fw-semibold text-uppercase tracking-wider">System Activities</span>
                      <div className="p-2 bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                        <FiActivity size={18} className="text-dark" />
                      </div>
                    </div>
                    <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "28px", letterSpacing: "-0.03em" }}>1,280</h2>
                  </div>
                  <div className="d-flex align-items-center gap-1 mt-3">
                    <span className="fs-12 fw-semibold text-dark d-inline-flex align-items-center gap-1">
                      <FiArrowUpRight size={14} className="text-success" />
                      +18.4%
                    </span>
                    <span className="text-muted fs-12">logged today</span>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Metric 3 */}
            <Col xl={3} md={6}>
              <Card className="saas-card m-0" style={{ height: "100%" }}>
                <CardBody className="p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="text-muted fs-13 fw-semibold text-uppercase tracking-wider">Emails Configured</span>
                      <div className="p-2 bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                        <FiMail size={18} className="text-dark" />
                      </div>
                    </div>
                    <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "28px", letterSpacing: "-0.03em" }}>12</h2>
                  </div>
                  <div className="d-flex align-items-center gap-1 mt-3">
                    <span className="fs-12 fw-semibold text-dark">Active Gateway</span>
                    <span className="text-muted fs-12 ms-auto d-inline-flex align-items-center gap-1">
                      <span className="saas-status-dot-active" style={{ fontSize: "11px" }}>online</span>
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Metric 4 */}
            <Col xl={3} md={6}>
              <Card className="saas-card m-0" style={{ height: "100%" }}>
                <CardBody className="p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="text-muted fs-13 fw-semibold text-uppercase tracking-wider">Security State</span>
                      <div className="p-2 bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                        <FiCheckCircle size={18} className="text-dark" />
                      </div>
                    </div>
                    <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "28px", letterSpacing: "-0.03em" }}>Optimal</h2>
                  </div>
                  <div className="d-flex align-items-center gap-1 mt-3">
                    <span className="text-muted fs-12">0 active security events</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Lower Section: Recent Logs & Quick Actions */}
          <Row className="g-4">
            {/* Left Column: Recent Logs */}
            <Col lg={8}>
              <Card className="saas-card m-0" style={{ height: "100%" }}>
                <div className="p-4 border-bottom border-light d-flex align-items-center justify-content-between">
                  <h5 className="mb-0 fw-bold text-dark" style={{ fontSize: "16px" }}>System Audit Stream</h5>
                  <Link to="/logs" className="text-decoration-none text-dark fw-semibold fs-13 d-inline-flex align-items-center gap-1">
                    View Logs <FiArrowUpRight size={14} />
                  </Link>
                </div>
                <CardBody className="p-0">
                  <div className="table-responsive">
                    <table className="saas-table border-0 mb-0">
                      <thead>
                        <tr>
                          <th>Activity</th>
                          <th>Operator</th>
                          <th>Timestamp</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-dark fw-semibold">Employee Account Created</td>
                          <td className="text-muted">system.admin</td>
                          <td className="text-muted fs-13">Just now</td>
                          <td><span className="saas-status-dot-active">Success</span></td>
                        </tr>
                        <tr>
                          <td className="text-dark fw-semibold">SMTP Credentials Updated</td>
                          <td className="text-muted">operations@balaji</td>
                          <td className="text-muted fs-13">2 hours ago</td>
                          <td><span className="saas-status-dot-active">Success</span></td>
                        </tr>
                        <tr>
                          <td className="text-dark fw-semibold">Failed Login Attempt (Root)</td>
                          <td className="text-muted">192.168.1.45</td>
                          <td className="text-muted fs-13">4 hours ago</td>
                          <td><span className="badge bg-danger bg-opacity-10 text-danger border-0 px-2 py-1 fs-12">Blocked</span></td>
                        </tr>
                        <tr>
                          <td className="text-dark fw-semibold">New System Role Created</td>
                          <td className="text-muted">system.admin</td>
                          <td className="text-muted fs-13">Yesterday</td>
                          <td><span className="saas-status-dot-active">Success</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Right Column: Actions / Health */}
            <Col lg={4}>
              <Card className="saas-card m-0" style={{ height: "100%" }}>
                <div className="p-4 border-bottom border-light">
                  <h5 className="mb-0 fw-bold text-dark" style={{ fontSize: "16px" }}>Quick Setup Controls</h5>
                </div>
                <CardBody className="p-4 d-flex flex-column gap-3">
                  <Link 
                    to="/setup/employee" 
                    className="d-flex align-items-center justify-content-between p-3 border rounded-3 text-decoration-none text-dark hover-bg-light transition-all"
                    style={{ borderColor: "var(--saas-border)", transition: "all 0.15s ease" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 bg-light rounded-2 text-dark">
                        <FiUsers size={16} />
                      </div>
                      <div>
                        <div className="fw-semibold fs-14">Configure Directory</div>
                        <small className="text-muted fs-12">Manage company setup & employees</small>
                      </div>
                    </div>
                    <FiArrowUpRight size={16} className="text-muted" />
                  </Link>

                  <Link 
                    to="/cms/email-template" 
                    className="d-flex align-items-center justify-content-between p-3 border rounded-3 text-decoration-none text-dark hover-bg-light transition-all"
                    style={{ borderColor: "var(--saas-border)", transition: "all 0.15s ease" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 bg-light rounded-2 text-dark">
                        <FiFileText size={16} />
                      </div>
                      <div>
                        <div className="fw-semibold fs-14">Email Setup</div>
                        <small className="text-muted fs-12">Templates, configs & routing rules</small>
                      </div>
                    </div>
                    <FiArrowUpRight size={16} className="text-muted" />
                  </Link>

                  <Link 
                    to="/auth/admin-user" 
                    className="d-flex align-items-center justify-content-between p-3 border rounded-3 text-decoration-none text-dark hover-bg-light transition-all"
                    style={{ borderColor: "var(--saas-border)", transition: "all 0.15s ease" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 bg-light rounded-2 text-dark">
                        <FiLock size={16} />
                      </div>
                      <div>
                        <div className="fw-semibold fs-14">Access & Roles</div>
                        <small className="text-muted fs-12">System groups, security & permissions</small>
                      </div>
                    </div>
                    <FiArrowUpRight size={16} className="text-muted" />
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
