import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import ContactServices from "../../../services/ContactServices";
import Spinner from '../../Spinner/Spinner';

const ContactList = () => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchGroupName, setSearchGroupName] = useState('');

  useEffect(() => {
    const fetchContactsAndGroups = async () => {
      try {
        setLoading(true);
        const [contactsResponse, groupsResponse] = await Promise.all([
          ContactServices.getAllContacts(),
          ContactServices.getGroups()
        ]);
        setContacts(contactsResponse.data);
        setGroups(groupsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contacts or groups:", error);
        setErrorMessage(error.message || 'Data not found!');
        setLoading(false);
      }
    };

    fetchContactsAndGroups();
  }, []);

  const groupMap = useMemo(() => {
    return groups.reduce((acc, group) => {
      acc[group.id] = group.name;
      return acc;
    }, {});
  }, [groups]);

  // Handle changes in search input fields
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGroupNameChange = (e) => {
    setSearchGroupName(e.target.value);
  };

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let filteredContacts = [];

      if (searchGroupName) {
        // Fetch contacts by group name
        filteredContacts = await ContactServices.getContactsByGroupName(searchGroupName);
      } else {
        // If no group is selected, fetch all contacts
        const response = await ContactServices.getAllContacts();
        filteredContacts = response.data;
      }

      // If a search term is provided, filter the contacts by name
      if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i'); // Case-insensitive
        filteredContacts = filteredContacts.filter(contact => regex.test(contact.name));
      }

      setContacts(filteredContacts);
      setLoading(false);
    } catch (error) {
      console.error("Error searching contacts:", error);
      setErrorMessage('Search failed!');
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <section className="contact-search p-3">
        <div className="container">
          <div className="grid">
            <div className="row">
              <div className="col">
                <p className="h3 fw-bold">
                  Contact Manager
                  <Link to='/contacts/add' className='btn btn-primary ms-2'>
                    <i className='fa fa-plus-circle me-2'></i> New
                  </Link>
                </p>
                <p className='fst-italic'>
                  Manage your contacts efficiently.
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <form className="row" onSubmit={handleSearch}>
                  <div className="col">
                    <div className="mb-2">
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Search Names'
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-2">
                      <select
                        className='form-control'
                        value={searchGroupName}
                        onChange={handleGroupNameChange}
                      >
                        <option value="">Select Group</option>
                        {groups.map(group => (
                          <option key={group.id} value={group.name}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-2">
                      <input
                        type='submit'
                        className='btn btn-outline-dark'
                        value="Search"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <section className="contact-list">
            <div className="container">
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              <div className="row">
                {contacts.length > 0 ? contacts.map(contact => (
                  <div className="col-md-6" key={contact.id}>
                    <div className="card my-2">
                      <div className="card-body">
                        <div className="row align-items-center d-flex justify-content-around">
                          <div className="col-md-4">
                            <img
                              src={contact.photo || "/default-photo.jpg"}
                              alt={contact.name}
                              className="contact-img"
                              onError={(e) => { e.target.src = "/default-photo.jpg"; }}
                            />
                          </div>
                          <div className="col-md-7">
                            <ul className="list-group">
                              <li className="list-group-item list-group-item-action">
                                Name: <span className="fw-bold ms-1">{contact.name}</span>
                              </li>
                              <li className="list-group-item list-group-item-action">
                                Email: <span className="fw-bold ms-1">{contact.email}</span>
                              </li>
                              <li className="list-group-item list-group-item-action">
                                Contact: <span className="fw-bold ms-1">{contact.mobile}</span>
                              </li>
                              <li className="list-group-item list-group-item-action">
                                Company: <span className="fw-bold ms-1">{contact.company}</span>
                              </li>
                              <li className="list-group-item list-group-item-action">
                                Title: <span className="fw-bold ms-1">{contact.title}</span>
                              </li>
                              <li className="list-group-item list-group-item-action">
                                Group: <span className="fw-bold ms-1">{groupMap[contact.groupId]}</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-md-1 d-flex flex-column p-1 align-items-center">
                            <Link
                              to={`/contacts/view/${contact.id}`}
                              className="btn btn-warning my-1"
                              title="View"
                            >
                              <i className="fa fa-eye"></i>
                            </Link>
                            <Link
                              to={`/contacts/edit/${contact.id}`}
                              className="btn btn-primary my-1"
                              title="Edit"
                            >
                              <i className="fa fa-pen"></i>
                            </Link>
                            <button
                              className="btn btn-danger my-1"
                              title="Delete"
                              onClick={async () => {
                                if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
                                  try {
                                    await ContactServices.deleteContact(contact.id);
                                    setContacts(prevContacts => prevContacts.filter(c => c.id !== contact.id));
                                  } catch (error) {
                                    setErrorMessage('Error deleting contact');
                                  }
                                }
                              }}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : <p className="text-center">No contacts found.</p>}
              </div>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
            </div>
          </section>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ContactList;
