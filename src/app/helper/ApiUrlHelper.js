// const baseUrl = 'http://localhost:3001/';
const baseUrl = 'https://offertrunk.com/';

const loginUrl = () => {
  return baseUrl + 'api/login';
};

// Categories
const getCategories = () => {
  return baseUrl + 'user/getCategories';
};

const createUpdateCategory = () => {
  return baseUrl + 'user/createUpdateCategory';
};

const deleteCategory = () => {
  return baseUrl + 'user/deleteCategory';
};

// Network
const getNetworksByUser = () => {
  return baseUrl + 'user/getNetworksByUser';
};
const getAllNetworks = () => {
  return baseUrl + 'user/getAllNetworks';
};
const addUpdateNetwork = () => {
  return baseUrl + 'user/createUpdateNetwork';
};
const getNetwork = () => {
  return baseUrl + 'user/getNetwork';
};
const deleteNetwork = () => {
  return baseUrl + 'user/deleteNetwork';
};

// Offers
const getOffers = () => {
  return baseUrl + 'user/getOffersByNetwork';
};
const getOffer = () => {
  return baseUrl + 'user/getOffer';
};
const addUpdateOffer = () => {
  return baseUrl + 'user/createUpdateOffer';
};
const getAllOffers = () => {
  return baseUrl + 'user/getAllOffers';
};
const deleteOffer = () => {
  return baseUrl + 'user/deleteOffer';
};
// Traffic Sources
const getTrafficSources = () => {
  return baseUrl + 'user/getTrafficSourcesByUser';
};
const addUpdateTrafficSource = () => {
  return baseUrl + 'user/createUpdateTrafficSource';
};
const getTrafficSource = () => {
  return baseUrl + 'user/getTrafficSource';
};
const getAllTrafficSource = () => {
  return baseUrl + 'user/getAllTrafficSource';
};
const deleteTraffic = () => {
  return baseUrl + 'user/deleteTraffic';
};
// User Profile
const getUser = () => {
  return baseUrl + 'user/getUser';
};
const updateUser = () => {
  return baseUrl + 'user/updateUser';
};
const forgotPassword = () => {
  return baseUrl + 'api/forgotPassword';
};
const resetPassword = () => {
  return baseUrl + 'api/resetPassword';
};
// Student
const getStudents = () => {
  return baseUrl + 'bisme/getStudents';
};
const addUpdateStudent = () => {
  return baseUrl + 'bisme/addUpdateStudent';
};
const getStudent = () => {
  return baseUrl + 'bisme/getStudent';
};
const csvUpload = () => {
  return baseUrl + 'bisme/csvUpload';
};

// Admission
const getAdmissions = () => {
  return baseUrl + 'bisme/getAdmissions';
};
const addUpdateAdmission = () => {
  return baseUrl + 'bisme/addUpdateAdmission';
};
const getAdmission = () => {
  return baseUrl + 'bisme/getAdmission';
};

// Receipts
const getReceipts = () => {
  return baseUrl + 'bisme/getReceipts';
};
const addUpdateReceipt = () => {
  return baseUrl + 'bisme/addUpdateReceipt';
};
const getReceipt = () => {
  return baseUrl + 'bisme/getReceipt';
};
const generateReceipt = () => {
  return baseUrl + 'bisme/generateReceipt';
};
const generateReceiptsTB = () => {
  return baseUrl + 'bisme/generateReceiptsTB';
};

export {
  loginUrl,
  getAllNetworks,
  getNetwork,
  addUpdateNetwork,
  getNetworksByUser,
  deleteNetwork,
  getOffers,
  getOffer,
  addUpdateOffer,
  getAllOffers,
  deleteOffer,
  getAllTrafficSource,
  getTrafficSources,
  getTrafficSource,
  deleteTraffic,
  addUpdateTrafficSource,
  getUser,
  updateUser,
  forgotPassword,
  resetPassword,
  getStudent,
  getStudents,
  addUpdateStudent,
  getAdmission,
  getAdmissions,
  addUpdateAdmission,
  getReceipt,
  getReceipts,
  addUpdateReceipt,
  generateReceipt,
  generateReceiptsTB,
  csvUpload,
  createUpdateCategory,
  getCategories,
  deleteCategory,
};
