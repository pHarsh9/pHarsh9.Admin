import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Input,
  Row,
  Button,
} from "reactstrap";
import { getProfile, updateProfile } from "../../api/profile.api";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { toast } from "react-toastify";

const initialState = {
  monogram: "pHarsh9",
  fullName: "Harsh Sharma",
  heroSlogan: "",
  bioTitle: "",
  bioDescription: "",
  field: "",
  focus: "",
  location: "",
  availability: "",
  copyrightText: "",
};

const ProfileMaster = () => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = () => {
    setLoading(true);
    getProfile()
      .then((res) => {
        if (res.data.isOk && res.data.data) {
          setValues(res.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load profile data.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    updateProfile(values)
      .then((res) => {
        if (res.data.isOk) {
          toast.success("Profile Updated Successfully!");
          setValues(res.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update profile.");
      })
      .finally(() => {
        setIsSubmitLoading(false);
      });
  };

  document.title = "Profile Master | Admin";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb maintitle="Portfolio" title="Profile Master" pageTitle="Portfolio" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">Identity Configuration</h4>
                </CardHeader>
                <CardBody>
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={4} className="mb-3">
                          <Label>Monogram Branding *</Label>
                          <Input
                            type="text"
                            name="monogram"
                            value={values.monogram || ""}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                        <Col md={8} className="mb-3">
                          <Label>Full Name *</Label>
                          <Input
                            type="text"
                            name="fullName"
                            value={values.fullName || ""}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                        <Col md={12} className="mb-3">
                          <Label>Hero Slogan *</Label>
                          <Input
                            type="textarea"
                            rows={2}
                            name="heroSlogan"
                            value={values.heroSlogan || ""}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                        <Col md={12} className="mb-3">
                          <Label>Bio Title *</Label>
                          <Input
                            type="text"
                            name="bioTitle"
                            value={values.bioTitle || ""}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                        <Col md={12} className="mb-3">
                          <Label>Bio Description Paragraph *</Label>
                          <Input
                            type="textarea"
                            rows={4}
                            name="bioDescription"
                            value={values.bioDescription || ""}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Label>Field of Expertise *</Label>
                          <Input
                            type="text"
                            name="field"
                            value={values.field || ""}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Label>Specialization Focus *</Label>
                          <Input
                            type="text"
                            name="focus"
                            value={values.focus || ""}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Label>Location / Timezone *</Label>
                          <Input
                            type="text"
                            name="location"
                            value={values.location || ""}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Label>Availability Status *</Label>
                          <Input
                            type="text"
                            name="availability"
                            value={values.availability || ""}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                        <Col md={12} className="mb-3">
                          <Label>Footer Copyright Text *</Label>
                          <Input
                            type="text"
                            name="copyrightText"
                            value={values.copyrightText || ""}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                      </Row>
                      <div className="text-end mt-4">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={isSubmitLoading}
                          className="btn-load"
                        >
                          {isSubmitLoading ? (
                            <span className="d-flex align-items-center">
                              <span className="spinner-border flex-shrink-0" role="status" style={{ width: "12px", height: "12px", marginRight: "6px" }}></span>
                              <span>Updating Profile...</span>
                            </span>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProfileMaster;
