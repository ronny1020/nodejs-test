const multer = require('multer');
const upload = multer({dest:'../tmp_uploads'});

module.exports = upload;