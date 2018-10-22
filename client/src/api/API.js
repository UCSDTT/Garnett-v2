import axios from 'axios';

//Search functions to connect with back-end
export default {
  // Pledge App:
  // GET requests
  getAuthStatus: function(displayName) {
    const params = { displayName };
    return axios.get('/api/', { params });
  },
  getFirebaseData: function() {
    return axios.get('/api/firebaseData');
  },
  getPledges: function() {
    return axios.get('/api/pledges');
  },
  getActives: function() {
    return axios.get('/api/actives');
  },
  getPledgeData: function(displayName) {
    const params = { displayName };
    return axios.get('/api/pledgeData', { params });
  },
  getPledgeMerits: function(pledgeName) {
    const params = { pledgeName };
    return axios.get('/api/pledgeMerits', { params });
  },
  getPledgeComplaints: function(pledgeName) {
    const params = { pledgeName };
    return axios.get('/api/pledgeComplaints', { params });
  },
  // PUT requests
  signUp: function(email, password, firstName, lastName, className, majorName, year, phone, code, pledgeCode) {
    const body = { email, password, firstName, lastName, className, majorName, year, phone, code, pledgeCode };
    return axios.put('/api/signup', body);
  },
  forgotPassword: function(email) {
    const body = { email };
    return axios.put('/api/forgotPassword', body);
  },
  logout: function() {
    return axios.put('/api/logout');
  },
  setPhoto: function(displayName, url) {
    const body = { displayName, url };
    return axios.put('/api/setPhoto', body);
  },

  // Merit Book
  // GET requests
  getMeritsRemaining: function(displayName, pledgeName) {
    const params = { displayName, pledgeName };
    return axios.get('/api/meritsRemaining', { params });
  },
  getPledgesForMerit: function(displayName) {
    const params = { displayName };
    return axios.get('/api/pledgesForMerit', { params });
  },
  getActivesForMerit: function(displayName) {
    const params = { displayName };
    return axios.get('/api/activesForMerit', { params });
  },
  getAlumniForMerit: function(displayName) {
    const params = { displayName };
    return axios.get('/api/alumniForMerit', { params });
  },
  getChalkboardsForMerit: function(fullName) {
    const params = { fullName };
    return axios.get('/api/chalkboardsForMerit', { params });
  },
  getPbros: function(displayName) {
    const params = { displayName };
    return axios.get('/api/getPbros', { params });
  },
  meritAsActive: function(displayName, selectedPledges, merit, isChalkboard, isPCGreet, status) {
    const body = { displayName, selectedPledges, merit, isChalkboard, isPCGreet, status };
    return axios.put('/api/meritAsActive', body);
  },
  meritAsPledge: function(displayName, selectedActives, merit, isChalkboard, isPCGreet) {
    const body = { displayName, selectedActives, merit, isChalkboard, isPCGreet };
    return axios.put('/api/meritAsPledge', body);
  },
  removeMerit: function(displayName, merit) {
    const body = { displayName, merit };
    return axios.put('/api/removeMeritAsPledge', body);
  },

  // Chalkboards
  // GET requests
  getChalkboardInfo: function(title) {
    const params = { title };
    return axios.get('/api/chalkboardInfo', { params });
  },
  getAttendees: function(title) {
    const params = { title };
    return axios.get('/api/attendees', { params });
  },
  // PUT requests
  createChalkboard: function(displayName, activeName, photoURL, title, description, date, time, location, timeCommitment, amount) {
    const body = { displayName, activeName, photoURL, title, description, date, time, location, timeCommitment, amount };
    return axios.put('/api/createChalkboard', body);
  },
  editChalkboard: function(displayName, chalkboard, description, date, time, location, timeCommitment, amount) {
    const body = { displayName, chalkboard, description, date, time, location, timeCommitment, amount };
    return axios.put('/api/editChalkboard', body);
  },
  editChalkboardMobile: function(displayName, chalkboard, field, value) {
    const body = { displayName, chalkboard, field, value };
    return axios.put('/api/editChalkboardMobile', body);
  },
  joinChalkboard: function(name, photoURL, chalkboard) {
    const body = { name, photoURL, chalkboard };
    return axios.put('/api/joinChalkboard', body);
  },
  removeChalkboard: function(displayName, chalkboard) {
    const body = { displayName, chalkboard };
    return axios.put('/api/removeChalkboard', body);
  },
  leaveChalkboard: function(name, chalkboard) {
    const body = { name, chalkboard };
    return axios.put('/api/leaveChalkboard', body);
  },

  // Complaints
  // GET requests
  getPledgesForComplaints: function() {
    return axios.get('/api/pledgesForComplaints');
  },
  // PUT requests
  complain: function(complaint, status) {
    const body = { complaint, status };
    return axios.put('/api/complain', body);
  },
  removeComplaint: function(complaint) {
    const body = { complaint };
    return axios.put('/api/removeComplaint', body);
  },
  approveComplaint: function(complaint) {
    const body = { complaint };
    return axios.put('/api/approveComplaint', body);
  },

  // Notification Messaging
  // PUT requests
  saveMessagingToken: function(displayName, token) {
    const body = { displayName, token };
    return axios.put('/api/saveMessageToken', body);
  },
  sendActiveMeritNotification: function(activeName, pledges, amount) {
    const body = { activeName, pledges, amount };
    return axios.put('/api/sendActiveMeritNotification', body);
  },
  sendPledgeMeritNotification: function(pledgeName, actives, amount) {
    const body = { pledgeName, actives, amount };
    return axios.put('/api/sendPledgeMeritNotification', body);
  },
  sendCreatedChalkboardNotification: function(chalkboardTitle) {
    const body = { chalkboardTitle };
    return axios.put('/api/sendCreatedChalkboardNotification', body);
  },
  sendEditedChalkboardNotification: function(chalkboard) {
    const body = { chalkboard };
    return axios.put('/api/sendEditedChalkboardNotification', body);
  },
  sendJoinedChalkboardNotification: function(name, chalkboard) {
    const body = { name, chalkboard };
    return axios.put('/api/sendJoinedChalkboardNotification', body);
  },
  sendLeftChalkboardNotification: function(name, chalkboard) {
    const body = { name, chalkboard };
    return axios.put('/api/sendLeftChalkboardNotification', body);
  },
  sendPendingComplaintNotification: function(complaint) {
    const body = { complaint };
    return axios.put('/api/sendPendingComplaintNotification', body);
  },
  sendApprovedComplaintNotification: function(complaint) {
    const body = { complaint };
    return axios.put('/api/sendApprovedComplaintNotification', body);
  },

  // Delibs App
  // PUT requests
  updateInteraction: function(displayName, rusheeName, interacted, totalInteractions) {
    const body = { displayName, rusheeName, interacted, totalInteractions };
    return axios.put('/api/updateInteraction', body);
  },
  startVote: function(rusheeName) {
    const body = { rusheeName };
    return axios.put('/api/startVote', body);
  },
  endVote: function() {
    return axios.put('/api/endVote');
  },
  voteForRushee: function(displayName, rushee, vote) {
    const body = { displayName, rushee, vote };
    return axios.put('/api/vote', body);
  },

  // Data App
  // GET requests
  getPhotos: function(data) {
    const params = { data };
    return axios.get('/api/photos', { params });
  },
  getMyData: function(fullName) {
    const params = { fullName };
    return axios.get('/api/myData', { params });
  }
};
