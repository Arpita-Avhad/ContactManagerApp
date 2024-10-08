import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContactServices from '../../../services/ContactServices';
import Spinner from '../../Spinner/Spinner';

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

  const [groups, setGroups] = useState([{ id: "N/A", name: "N/A" }]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await ContactServices.getGroups();
        setGroups(response.data);
        console.log("Groups fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setErrorMessage("Error fetching groups. Please try again later.");
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

    if (!contact.name || !contact.mobile || !contact.email || !contact.groupId) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(contact.mobile)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      console.log("Contact data to be sent:", contact);
      const createResponse = await ContactServices.createContact(contact);
      console.log("Contact created successfully:", createResponse.data);
      navigate('/contacts/list');
    } catch (error) {
      console.error("Error creating contact:", error.response ? error.response.data : error);
      setErrorMessage("Error creating contact. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className='add-contacts p-3'>
      <div className='container p-3'>
        <div className='row'>
          <div className="col">
            <p className='fw-bold h4 text-primary'>Add Contact</p>
            <p className='fst-italic'>
              Build your network, one contact at a time!
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
                    required
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
                      {groups.length === 0 ? (
                        <option value="N/A">N/A</option>
                      ) : (
                        groups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="mb-2">
                    <input type='submit' className='btn btn-primary' value={submitting ? "Adding..." : "Add"} disabled={submitting} />
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

export default AddContact;
