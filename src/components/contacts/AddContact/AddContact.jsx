// src/components/contacts/AddContact/AddContact.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContactServices from '../../../services/ContactServices';
import Spinner from '../../Spinner/Spinner';

const AddContact = () => {
  const navigate = useNavigate();

  const [contact, setContact] = useState({
    name: "",
    photo: "",
    mobile: "",
    email: "",
    title: "",
    company: "",
    groupId: "",
  });
  const [groups, setGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch groups for the dropdown
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const response = await ContactServices.getGroups();
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setErrorMessage("Error fetching groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({ ...prevContact, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optionally validate inputs here
    if (!contact.name || !contact.mobile || !contact.email || !contact.groupId) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      await ContactServices.createContact(contact);
      navigate('/contacts/list'); // Redirect to contact list after successful creation
    } catch (error) {
      console.error("Error creating contact:", error);
      setErrorMessage("Error creating contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='add-contacts p-3'>
      <div className='container p-3'>
        <div className='row'>
          <div className="col">
            <p className='fw-bold h4 text-primary'>Add Contact</p>
            <p className='fst-italic'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo, sint in ut facere molestias enim?
            </p>
          </div>
        </div>
        <div className="row d-flex align-items-center">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div className="col-md-4">
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                  <InputField
                    type="text"
                    name="name"
                    value={contact.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  <InputField
                    type="text"
                    name="photo"
                    value={contact.photo}
                    onChange={handleChange}
                    placeholder="Photo URL"
                  />
                  <InputField
                    type="tel"
                    name="mobile"
                    value={contact.mobile}
                    onChange={handleChange}
                    placeholder="Mobile"
                    pattern="[0-9]{10}"
                    title="Please enter a 10-digit mobile number"
                    required
                  />
                  <InputField
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                  <InputField
                    type="text"
                    name="company"
                    value={contact.company}
                    onChange={handleChange}
                    placeholder="Company"
                  />
                  <InputField
                    type="text"
                    name="title"
                    value={contact.title}
                    onChange={handleChange}
                    placeholder="Title"
                  />
                  <div className="mb-2">
                    <select
                      className='form-control'
                      name="groupId"
                      value={contact.groupId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a Group</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <input type='submit' className='btn btn-primary' value="Add" />
                    <Link to='/contacts/list' className='btn btn-dark ms-2'>
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
              <div className="col-md-6">
                <img
                  src={contact.photo || "/default-photo.jpg"}
                  alt={contact.name || "Default Contact"}
                  className='contact-img'
                  onError={(e) => { e.target.src = "/default-photo.jpg"; }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// InputField Component
const InputField = ({ type, name, value, onChange, placeholder, pattern, title, required }) => (
  <div className="mb-2">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className='form-control'
      placeholder={placeholder}
      pattern={pattern}
      title={title}
      required={required}
    />
  </div>
);

export default AddContact;
