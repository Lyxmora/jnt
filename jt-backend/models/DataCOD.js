
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  nama: String,
  resi: String,
  kode: String,
  wa: String,
  kantor: String,
  createdAt: { type: Date, default: Date.now, expires: 2592000 }
});
module.exports = mongoose.model('DataCOD', schema);
