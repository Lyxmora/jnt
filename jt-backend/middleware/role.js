
function onlySuperadmin(req, res, next) {
  if (req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya superadmin.' });
  }
  next();
}
module.exports = { onlySuperadmin };
