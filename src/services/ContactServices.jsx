// src/services/ContactServices.js
import axios from 'axios';

class ContactServices {
  static serverUrl = "http://localhost:3000"; // Ensure this matches your server's address and port

  // Group-related methods
  static getGroups() {
    const dataUrl = `${this.serverUrl}/groups`;
    return axios.get(dataUrl);
  }

  static getGroup(groupId) {
    const dataUrl = `${this.serverUrl}/groups/${groupId}`;
    return axios.get(dataUrl);
  }

  /**
   * Fetches groups by name.
   * @param {string} groupName - The name of the group to fetch.
   * @returns {Promise<Array>} - A promise that resolves to an array of groups matching the name.
   */
  static getGroupsByName(groupName) {
    const dataUrl = `${this.serverUrl}/groups`;
    return axios.get(dataUrl, { params: { name: groupName } });
  }

  // Contact-related methods
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

  /**
   * Searches contacts by name and/or group ID.
   * @param {string} searchTerm - The term to search in contact names.
   * @param {string} groupId - The ID of the group to filter contacts.
   * @returns {Promise<Array>} - A promise that resolves to an array of matching contacts.
   */
  static searchContacts(searchTerm, groupId) {
    const params = {};

    if (searchTerm) params.name_like = searchTerm; // Partial matching

    if (groupId) params.groupId = groupId;

    const dataUrl = `${this.serverUrl}/contacts`;
    return axios.get(dataUrl, { params });
  }

  /**
   * Fetches contacts by group name.
   * @param {string} groupName - The name of the group to filter contacts.
   * @returns {Promise<Array>} - A promise that resolves to an array of contacts in the specified group.
   */
  static async getContactsByGroupName(groupName) {
    try {
      // Step 1: Fetch the group(s) matching the groupName
      const groupResponse = await this.getGroupsByName(groupName);
      const groups = groupResponse.data;

      if (groups.length === 0) {
        // No group found with the given name
        return [];
      }

      // Assuming group names are unique; take the first match
      const groupId = groups[0].id;

      // Step 2: Fetch contacts with the retrieved groupId
      const contactsResponse = await this.getAllContacts();
      const contacts = contactsResponse.data;

      // Filter contacts by groupId
      const filteredContacts = contacts.filter(contact => contact.groupId === groupId);

      return filteredContacts;
    } catch (error) {
      console.error("Error fetching contacts by group name:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
}

export default ContactServices;
