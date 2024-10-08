import axios from 'axios';

class ContactServices {
  static serverUrl = "http://localhost:7000";

  static async getGroups() {
    const dataUrl = `${this.serverUrl}/groups`;
    return await axios.get(dataUrl);
  }

  static async getGroup(groupId) {
    const dataUrl = `${this.serverUrl}/groups/${groupId}`;
    return await axios.get(dataUrl);
  }

  static async getGroupsByName(name) {
    const dataUrl = `${this.serverUrl}/groups`;
    return await axios.get(dataUrl, { params: { name } });
  }

  static async getAllContacts() {
    const dataUrl = `${this.serverUrl}/contacts`;
    return await axios.get(dataUrl);
  }

  static async getContact(contactId) {
    const dataUrl = `${this.serverUrl}/contacts/${contactId}`;
    return await axios.get(dataUrl);
  }

  static async createContact(contact) {
    const dataUrl = `${this.serverUrl}/contacts`;
    try {
      const response = await axios.post(dataUrl, contact);
      return response.data; // Return response data on success
    } catch (error) {
      console.error("Error creating contact:", error.response ? error.response.data : error.message);
      throw error; // Rethrow for further handling
    }
  }

  static async updateContact(contactId, contact) {
    const dataUrl = `${this.serverUrl}/contacts/${contactId}`;
    try {
      const response = await axios.put(dataUrl, contact);
      return response.data;
    } catch (error) {
      console.error("Error updating contact:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  static async patchContact(contactId, updatedFields) {
    const dataUrl = `${this.serverUrl}/contacts/${contactId}`;
    try {
      const response = await axios.patch(dataUrl, updatedFields);
      return response.data;
    } catch (error) {
      console.error("Error patching contact:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  static async deleteContact(contactId) {
    const dataUrl = `${this.serverUrl}/contacts/${contactId}`;
    try {
      const response = await axios.delete(dataUrl);
      return response.data;
    } catch (error) {
      console.error("Error deleting contact:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  static async searchContacts(searchTerm, groupId) {
    const params = {};
    if (searchTerm) params.name_like = searchTerm;
    if (groupId) params.groupId = groupId;
    const dataUrl = `${this.serverUrl}/contacts`;
    return await axios.get(dataUrl, { params });
  }

  static async getContactsByGroupName(groupName) {
    try {
      const groupResponse = await this.getGroupsByName(groupName);
      const groups = groupResponse.data;
      if (groups.length === 0) {
        return []; // No groups found, return empty array.
      }

      const groupId = groups[0].id;
      const contactsResponse = await this.searchContacts(null, groupId);
      return contactsResponse.data;

    } catch (error) {
      console.error("Error fetching contacts by group name:", error);
      throw error; // Rethrow the error for further handling
    }
  }
}

export default ContactServices;
