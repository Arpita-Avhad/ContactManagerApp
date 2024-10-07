// src/components/contacts/ViewContact/ViewContact.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ContactServices from "../../../services/ContactServices";
import Spinner from '../../Spinner/Spinner';

const ViewContact = () => {
  const { contactId } = useParams();
  const [state, setState] = useState({
    loading: false,
    contact: {},
    errorMessage: ''
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setState(prevState => ({ ...prevState, loading: true }));
        const response = await ContactServices.getContact(contactId);
        setState(prevState => ({ ...prevState, loading: false, contact: response.data }));
      } catch (error) {
        setState(prevState => ({ ...prevState, loading: false, errorMessage: 'Contact not found!' }));
      }
    };

    fetchContact();
  }, [contactId]);

  const { loading, contact, errorMessage } = state;

  return (
    <div>
      {loading ? <Spinner /> : (
        <React.Fragment>
          <section className="view-contact-intro p-3">
            <div className="container">
              <div className="row">
                <div className="col">
                  <p className="h3 fw-bold">View Contact</p>
                  <p className="fst-italic">Lorem ipsum dolor sit amet.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="view-contact mt-3">
            <div className="container">
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              {!errorMessage && (
                <div className="card">
                  <div className="card-header">
                    <p className="h3">{contact.name}</p>
                  </div>
                  <div className="card-body">
                    <ul className="list-group">
                      <li className="list-group-item">Email: {contact.email}</li>
                      <li className="list-group-item">Phone: {contact.mobile}</li>
                      <li className="list-group-item">Company: {contact.company}</li>
                      <li className="list-group-item">Title: {contact.title}</li>
                      <li className="list-group-item">Group: {contact.group ? contact.group.name : 'N/A'}</li>
                    </ul>
                  </div>
                  <div className="card-footer">
                    <Link to="/contacts/list" className="btn btn-warning">
                      <i className="fa fa-arrow-left me-2"></i> Back
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        </React.Fragment>
      )}
    </div>
  );
};

export default ViewContact;
