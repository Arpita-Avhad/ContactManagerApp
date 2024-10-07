// src/components/contacts/EditContact/EditContact.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ContactServices from '../../../services/ContactServices';
import Spinner from '../../Spinner/Spinner';

const EditContact = () => {
  const { contactId } = useParams();
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
  const [originalContact, setOriginalContact] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const contactResponse = await ContactServices.getContact(contactId);
        const groupsResponse = await ContactServices.getGroups();
        setContact(contactResponse.data);
        setOriginalContact(contactResponse.data);
        setGroups(groupsResponse.data);
      } catch (error) {
        console.error("Error fetching contact or groups:", error);
        setErrorMessage("Error fetching contact or groups");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [contactId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact(prevContact => ({ ...prevContact, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFields = {};
    Object.keys(contact).forEach(key => {
      if (contact[key] !== originalContact[key]) {
        updatedFields[key] = contact[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      setErrorMessage("No changes detected.");
      return;
    }

    try {
      setLoading(true);
      await ContactServices.patchContact(contactId, updatedFields);
      setLoading(false);
      navigate('/contacts/list');
    } catch (error) {
      console.error("Error updating contact:", error);
      setLoading(false);
      setErrorMessage("Error updating contact");
    }
  };

  return (
    <section className='edit-contacts p-3'>
      <div className='container p-3'>
        <div className='row'>
          <div className="col">
            <p className='fw-bold h4 text-primary'>Edit Contact</p>
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
                    placeholder="Photo Url"
                  />
                  <InputField
                    type="tel"
                    name="mobile"
                    value={contact.mobile}
                    onChange={handleChange}
                    placeholder="Mobile"
                    pattern="[0-9]{10}"
                    title="Please enter a 10-digit mobile number"
                  />
                  <InputField
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={handleChange}
                    placeholder="Email"
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
                      {groups.map(group => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <input type='submit' className='btn btn-primary' value="Update" />
                    <Link to='/contacts/list' className='btn btn-dark ms-2'>
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
              <div className="col-md-6">
                <img src={contact.photo || "/default-photo.jpg"} alt={contact.name} className='contact-img' onError={(e) => { e.target.src = "/default-photo.jpg"; }} />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// InputField Component
const InputField = ({ type, name, value, onChange, placeholder, pattern, title }) => (
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
      required
    />
  </div>
);

export default EditContact;
