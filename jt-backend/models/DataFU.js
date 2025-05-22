
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  nama: String,
  barang: String,
  resi: String,
  alamat: String,
  pembayaran: String,
  wa: String,
  kantor: String,
  createdAt: { type: Date, default: Date.now, expires: 2592000 }
});
module.exports = mongoose.model('DataFU', schema);
