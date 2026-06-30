import React from 'react';
import { Link } from 'react-router-dom';

const BreadCrumb = ({ title, pageTitle, maintitle }) => {
  const parent = maintitle || pageTitle;

  return (
    <nav aria-label="breadcrumb" className="saas-breadcrumb-nav mb-2">
      <ol className="breadcrumb m-0 p-0 d-flex align-items-center" style={{ listStyle: "none", backgroundColor: "transparent" }}>
        {parent && (
          <li className="breadcrumb-item d-flex align-items-center">
            <Link 
              to="#" 
              className="text-decoration-none text-muted" 
              style={{ fontSize: "12px", fontWeight: "500", color: "#6B7280" }}
            >
              {parent}
            </Link>
          </li>
        )}
        <li className="breadcrumb-item active d-flex align-items-center" aria-current="page" style={{ fontSize: "12px", fontWeight: "500", color: "#111827" }}>
          {title}
        </li>
      </ol>
    </nav>
  );
};

export default BreadCrumb;