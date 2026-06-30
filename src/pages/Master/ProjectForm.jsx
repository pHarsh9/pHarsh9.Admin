import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, Label, Input, Button, FormFeedback } from "reactstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { createProject, getProjectById, updateProject, uploadProjectImage } from "../../api/projects.api";
import config from "../../config";

const initialState = {
  slug: "",
  projectNumber: "",
  category: "Web Application",
  title: "",
  subtitle: "",
  summary: "",
  figTitle: "FIG 01. LATENCY TOPOLOGY HEATMAP",
  figCaption: "",
  diagramImage: "",
  abstractHeader: "",
  abstractBody: "",
  codeBlock: { code: "", language: "", filename: "" },
  specs: [],
  metrics: [],
  bottomImage: "",
  bottomText: "",
  liveLink: "",
  playstoreLink: "",
  appstoreLink: "",
  gitLink: "",
  apkLink: "",
  spec1: "",
  spec2: "",
  spec3: "",
  spec4: "",
  isActive: true,
};

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isUploadingDiagram, setIsUploadingDiagram] = useState(false);
  const [isUploadingBottom, setIsUploadingBottom] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getProjectById(id)
        .then((res) => {
          const loadedSpecs = res.data.data.specs || [];
          setValues({
            ...initialState,
            ...res.data.data,
            spec1: loadedSpecs[0]?.value || "",
            spec2: loadedSpecs[1]?.value || "",
            spec3: loadedSpecs[2]?.value || "",
            spec4: loadedSpecs[3]?.value || "",
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load project details");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setValues(initialState);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("codeBlock.")) {
      const field = name.split(".")[1];
      setValues((prev) => ({
        ...prev,
        codeBlock: {
          ...prev.codeBlock,
          [field]: value,
        },
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheck = (e) => {
    const { name, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    if (fieldName === "diagramImage") {
      setIsUploadingDiagram(true);
    } else {
      setIsUploadingBottom(true);
    }

    uploadProjectImage(formData)
      .then((res) => {
        if (res.data.isOk) {
          setValues((prev) => ({
            ...prev,
            [fieldName]: res.data.url,
          }));
          toast.success("Image uploaded successfully!");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to upload image. Enforce <5MB, and valid raster files (.png, .jpg, .webp, .gif).");
      })
      .finally(() => {
        if (fieldName === "diagramImage") {
          setIsUploadingDiagram(false);
        } else {
          setIsUploadingBottom(false);
        }
      });
  };

  const validate = () => {
    const errors = {};
    if (!values.title) errors.title = "Project Title is required";
    if (!values.slug) errors.slug = "Project Slug is required";
    if (!values.category) errors.category = "Project Category is required";
    if (!values.summary) errors.summary = "Summary Description is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitLoading(true);
    const cat = values.category || "Web Application";
    let s1Label = "Sync Latency";
    let s2Label = "Throughput";
    if (cat === "Mobile Application") {
      s1Label = "Inference Lag";
      s2Label = "Battery Drain";
    } else if (cat === "Backend System") {
      s1Label = "Startup Overhead";
      s2Label = "Isolation Level";
    } else if (cat === "Web & Mobile Application") {
      s1Label = "Sync Latency";
      s2Label = "Platforms Supported";
    }

    const payload = {
      ...values,
      specs: [
        { label: s1Label, value: values.spec1 || "" },
        { label: s2Label, value: values.spec2 || "" },
        { label: "Stack", value: values.spec3 || "" },
        { label: "Topology", value: values.spec4 || "" },
      ].filter((s) => s.value !== ""),
    };

    const apiCall = id ? updateProject(id, payload) : createProject(payload);

    apiCall
      .then((res) => {
        if (res.data.isOk) {
          toast.success(id ? "Project Updated Successfully!" : "Project Added Successfully!");
          navigate("/project-master");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to save project.");
      })
      .finally(() => {
        setIsSubmitLoading(false);
      });
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb maintitle="Portfolio" title={id ? "Edit Project" : "Add Project"} pageTitle="Project Master" />

        <Row className="justify-content-center">
          <Col lg={10}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">{id ? "Modify Existing Project Details" : "Create New Project Monograph"}</h4>
                <Link to="/project-master" className="btn btn-soft-secondary btn-sm">
                  <i className="ri-arrow-left-line align-bottom me-1"></i> Back to List
                </Link>
              </CardHeader>
              <CardBody>
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <Row>
                      {/* Section 1 */}
                      <Col md={12} className="mb-4">
                        <h5 className="text-primary border-bottom pb-2">1 — General & Header Info</h5>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">Project Title *</Label>
                        <Input
                          type="text"
                          name="title"
                          value={values.title}
                          onChange={handleChange}
                          invalid={!!formErrors.title}
                        />
                        <FormFeedback>{formErrors.title}</FormFeedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">Project Slug *</Label>
                        <Input
                          type="text"
                          name="slug"
                          value={values.slug}
                          onChange={handleChange}
                          invalid={!!formErrors.slug}
                        />
                        <FormFeedback>{formErrors.slug}</FormFeedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">Project Type (Category) *</Label>
                        <Input
                          type="select"
                          name="category"
                          value={values.category}
                          onChange={handleChange}
                          invalid={!!formErrors.category}
                        >
                          <option value="Web Application">Web Application</option>
                          <option value="Mobile Application">Mobile Application</option>
                          <option value="Backend System">Backend System</option>
                          <option value="Web & Mobile Application">Web & Mobile Application</option>
                        </Input>
                        <FormFeedback>{formErrors.category}</FormFeedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">Project Number (e.g. PROJECT 114 — DISTRIBUTED NETWORKS)</Label>
                        <Input
                          type="text"
                          name="projectNumber"
                          value={values.projectNumber}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Label className="form-label">Subtitle</Label>
                        <Input
                          type="text"
                          name="subtitle"
                          value={values.subtitle}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Label className="form-label">Summary Description *</Label>
                        <Input
                          type="textarea"
                          rows={3}
                          name="summary"
                          value={values.summary}
                          onChange={handleChange}
                          invalid={!!formErrors.summary}
                        />
                        <FormFeedback>{formErrors.summary}</FormFeedback>
                      </Col>

                      {/* Section 2 */}
                      <Col md={12} className="mt-4 mb-4">
                        <h5 className="text-primary border-bottom pb-2">2 — Technical Specifications (Predefined by Type)</h5>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">
                          {values.category === "Mobile Application"
                            ? "Inference Lag (e.g. 8ms)"
                            : values.category === "Backend System"
                              ? "Startup Overhead (e.g. 4ms)"
                              : "Sync Latency (e.g. < 15ms)"}
                        </Label>
                        <Input
                          type="text"
                          name="spec1"
                          value={values.spec1 || ""}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">
                          {values.category === "Mobile Application"
                            ? "Battery Drain (e.g. <1%/hr)"
                            : values.category === "Backend System"
                              ? "Isolation Level (e.g. Hardware)"
                              : values.category === "Web & Mobile Application"
                                ? "Platforms Supported (e.g. Web, iOS, Android)"
                                : "Throughput (e.g. 25k active users)"}
                        </Label>
                        <Input
                          type="text"
                          name="spec2"
                          value={values.spec2 || ""}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">Technology Stack (e.g. React, Next.js, Go)</Label>
                        <Input
                          type="text"
                          name="spec3"
                          value={values.spec3 || ""}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">Topology / Focus (e.g. Edge Middleware, Micro-Sandbox Mesh)</Label>
                        <Input
                          type="text"
                          name="spec4"
                          value={values.spec4 || ""}
                          onChange={handleChange}
                        />
                      </Col>

                      {/* Section 3 */}
                      <Col md={12} className="mt-4 mb-4">
                        <h5 className="text-primary border-bottom pb-2">3 — Main Diagram Visuals (FIG 01 & FIG 02)</h5>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">Diagram Image File</Label>
                        <Input type="file" onChange={(e) => handleImageUpload(e, "diagramImage")} />
                        {isUploadingDiagram && <p className="text-muted small mt-1">Uploading...</p>}
                        {values.diagramImage && (
                          <div className="mt-2">
                            <img
                              src={values.diagramImage.startsWith("/uploads") ? `${config.api.API_URL}${values.diagramImage}` : values.diagramImage}
                              alt="Diagram Preview"
                              style={{ maxWidth: "100%", maxHeight: "120px", objectFit: "contain", border: "1px solid #eaeaea", padding: "4px" }}
                            />
                            <p className="text-success small mb-0">Uploaded: {values.diagramImage}</p>
                          </div>
                        )}
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">Fig Title (e.g. FIG 01. PEER TRANSMISSION MATRIX)</Label>
                        <Input
                          type="text"
                          name="figTitle"
                          value={values.figTitle}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Label className="form-label">Fig Caption (Explanation / Description under the diagram)</Label>
                        <Input
                          type="text"
                          name="figCaption"
                          value={values.figCaption}
                          onChange={handleChange}
                        />
                      </Col>

                      {/* Section 4 */}
                      <Col md={12} className="mt-4 mb-4">
                        <h5 className="text-primary border-bottom pb-2">4 — Abstract & Paragraph Details</h5>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Label className="form-label">Abstract Header</Label>
                        <Input
                          type="text"
                          name="abstractHeader"
                          value={values.abstractHeader}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Label className="form-label">Abstract Description Body</Label>
                        <Input
                          type="textarea"
                          rows={4}
                          name="abstractBody"
                          value={values.abstractBody}
                          onChange={handleChange}
                        />
                      </Col>

                      {/* Section 5 */}
                      <Col md={12} className="mt-4 mb-4">
                        <h5 className="text-primary border-bottom pb-2">5 — Technical Code Block</h5>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">Filename (e.g. SYNC_ENGINE.TS)</Label>
                        <Input
                          type="text"
                          name="codeBlock.filename"
                          value={values.codeBlock.filename}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">Syntax Highlight Language (e.g. TYPESCRIPT, GO)</Label>
                        <Input
                          type="text"
                          name="codeBlock.language"
                          value={values.codeBlock.language}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Label className="form-label">Representative Code Snippet</Label>
                        <Input
                          type="textarea"
                          rows={6}
                          name="codeBlock.code"
                          value={values.codeBlock.code}
                          onChange={handleChange}
                        />
                      </Col>

                      {/* Section 6 */}
                      <Col md={12} className="mt-4 mb-4">
                        <h5 className="text-primary border-bottom pb-2">6 — Close-up Visual & Bottom Slogan</h5>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">Bottom Close-up Image File</Label>
                        <Input type="file" onChange={(e) => handleImageUpload(e, "bottomImage")} />
                        {isUploadingBottom && <p className="text-muted small mt-1">Uploading...</p>}
                        {values.bottomImage && (
                          <div className="mt-2">
                            <img
                              src={values.bottomImage.startsWith("/uploads") ? `${config.api.API_URL}${values.bottomImage}` : values.bottomImage}
                              alt="Bottom Preview"
                              style={{ maxWidth: "100%", maxHeight: "120px", objectFit: "contain", border: "1px solid #eaeaea", padding: "4px" }}
                            />
                            <p className="text-success small mb-0">Uploaded: {values.bottomImage}</p>
                          </div>
                        )}
                      </Col>
                      <Col md={12} className="mb-3">
                        <Label className="form-label">Bottom Slogan Text Paragraph</Label>
                        <Input
                          type="textarea"
                          rows={3}
                          name="bottomText"
                          value={values.bottomText}
                          onChange={handleChange}
                        />
                      </Col>

                      {/* Section 7 */}
                      <Col md={12} className="mt-4 mb-4">
                        <h5 className="text-primary border-bottom pb-2">7 — Project External Links (Optional)</h5>
                      </Col>
                      <Col md={4} className="mb-3">
                        <Label className="form-label">Live Site URL</Label>
                        <Input
                          type="text"
                          name="liveLink"
                          value={values.liveLink || ""}
                          onChange={handleChange}
                          placeholder="e.g. https://myproject.com"
                        />
                      </Col>
                      <Col md={4} className="mb-3">
                        <Label className="form-label">GitHub URL</Label>
                        <Input
                          type="text"
                          name="gitLink"
                          value={values.gitLink || ""}
                          onChange={handleChange}
                          placeholder="e.g. https://github.com/..."
                        />
                      </Col>
                      <Col md={4} className="mb-3">
                        <Label className="form-label">Play Store (Android) URL</Label>
                        <Input
                          type="text"
                          name="playstoreLink"
                          value={values.playstoreLink || ""}
                          onChange={handleChange}
                          placeholder="e.g. Play Store link"
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">App Store (iOS) URL</Label>
                        <Input
                          type="text"
                          name="appstoreLink"
                          value={values.appstoreLink || ""}
                          onChange={handleChange}
                          placeholder="e.g. App Store link"
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Label className="form-label">Direct APK Download Link</Label>
                        <Input
                          type="text"
                          name="apkLink"
                          value={values.apkLink || ""}
                          onChange={handleChange}
                          placeholder="e.g. Direct APK link"
                        />
                      </Col>

                      <Col md={12} className="mt-3 mb-3 d-flex align-items-center">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          name="isActive"
                          id="isActive"
                          checked={values.isActive}
                          onChange={handleCheck}
                        />
                        <Label className="form-check-label ms-2 mb-0" htmlFor="isActive">
                          Is Active / Visible on Portfolio Site
                        </Label>
                      </Col>
                    </Row>

                    <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                      <Link to="/project-master" className="btn btn-light">
                        Cancel
                      </Link>
                      <Button color="primary" type="submit" disabled={isSubmitLoading}>
                        {isSubmitLoading ? "Saving..." : id ? "Update Project" : "Save Project"}
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
  );
};

export default ProjectForm;
