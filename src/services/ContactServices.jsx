import axios from 'axios';

  class ContactServices {
  static serverUrl = "http://localhost:7000";
  static getGroups() {
    const dataUrl = `${this.serverUrl}/groups`;
    return axios.get(dataUrl);
  }
  static getGroup(groupId) {
    const dataUrl = `${this.serverUrl}/groups/${groupId}`;
    return axios.get(dataUrl);
  }
  static getGroupsByName(Name) {
    const dataUrl = `${this.serverUrl}/groups`;
    return axios.get(dataUrl, { params: { name: Name } });
  }
  static getAllContacts() {
    const dataUrl = `${this.serverUrl}/contacts`;
    return axios.get(dataUrl);
  }
  static getContact(contactId) {
    const dataUrl = `${this.serverUrl}/contacts/${contactId}`;
    return axios.get(dataUrl);
  }
  static createContact(contact) {
    const dataUrl = `${this.serverUrl}/contacts`;
    return axios.post(dataUrl, contact);
  }
  static updateContact(contactId, contact) {
    const dataUrl = `${this.serverUrl}/contacts/${contactId}`;
    return axios.put(dataUrl, contact);
  }
  static patchContact(contactId, updatedFields) {
    const dataUrl = `${this.serverUrl}/contacts/${contactId}`;
    return axios.patch(dataUrl, updatedFields);
  }
  static deleteContact(contactId) {
    const dataUrl = `${this.serverUrl}/contacts/${contactId}`;
    return axios.delete(dataUrl);
  }
  static searchContacts(searchTerm, groupId) {
    const params = {};
    if (searchTerm) params.name_like = searchTerm;
    if (groupId) params.groupId = groupId;
    const dataUrl = `${this.serverUrl}/contacts`;
    return axios.get(dataUrl, { params });
  }
  static async getContactsByGroupName(groupName) {
    try {
      const groupResponse = await this.getGroupsByName(groupName);
      const groups = groupResponse.data;
      if (groups.length === 0) {
        return [];
      }
      const groupId = groups[0].id;
      const contactsResponse = await this.getAllContacts();
      const contacts = contactsResponse.data;
      const filteredContacts = contacts.filter(contact => contact.groupId === groupId);
      return filteredContacts;
    } catch (error) {
      console.error("Error fetching contacts by group name:", error);
      throw error; 
    }
  }
}
export default ContactServices;
