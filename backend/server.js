const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = 'gp_masolaBk_secret_jwt_key_2026';

// Enable CORS for frontend integration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware to extract tenant ID (gpId) for public routes
function getGpId(req, res, next) {
  const gpId = req.headers['x-gp-id'];
  if (!gpId) {
    return res.status(400).json({ error: 'Gram Panchayat ID (X-GP-ID header) is required.' });
  }
  req.gpId = gpId.trim();
  next();
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Token missing (Unauthorized)' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token (Forbidden)' });
    req.user = user; // user payload contains: id, username, role, gpId
    next();
  });
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username.trim()], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'Incorrect username or password' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ error: 'Incorrect username or password' });
    }

    // Get GP Name to return to client
    db.get('SELECT name FROM grampanchayats WHERE gpId = ?', [user.gpId], (err, gp) => {
      if (err) return res.status(500).json({ error: 'Database read error' });
      const gpName = gp ? gp.name : '';

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, gpId: user.gpId, gpName },
        JWT_SECRET,
        { expiresIn: '12h' }
      );
      res.json({ token, user: { username: user.username, role: user.role, gpId: user.gpId, gpName } });
    });
  });
});

// Verify token
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ==========================================
// COMPLAINT (TAKRAR) ROUTES
// ==========================================

// Submit a new complaint (Public - requires X-GP-ID)
app.post('/api/complaints', getGpId, (req, res) => {
  const { fullName, mobileNo, email, village, ward, category, address, details } = req.body;
  const gpId = req.gpId;
  
  if (!fullName || !mobileNo || !village || !ward || !category || !address || !details) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const ticketNo = `GP-MSL-${randomNum}`;
  const createdAt = new Date().toLocaleString('mr-IN');

  const query = `INSERT INTO complaints 
    (gpId, fullName, mobileNo, email, village, ward, category, address, details, ticketNo, status, createdAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Received', ?)`;
  
  db.run(query, [
    gpId,
    fullName.trim(),
    mobileNo.trim(),
    email ? email.trim() : null,
    village,
    ward,
    category,
    address.trim(),
    details.trim(),
    ticketNo,
    createdAt
  ], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to record complaint in database: ' + err.message });
    res.status(201).json({ id: this.lastID, ticketNo, fullName, category, status: 'Received', createdAt });
  });
});

// Get all complaints (Admin/Staff only - filtered by logged-in user's gpId)
app.get('/api/complaints', authenticateToken, (req, res) => {
  const gpId = req.user.gpId;
  db.all('SELECT * FROM complaints WHERE gpId = ? ORDER BY id DESC', [gpId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database read error' });
    res.json(rows);
  });
});

// Update complaint status & response (Admin/Staff only - enforced by logged-in user's gpId)
app.patch('/api/complaints/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, response } = req.body;
  const gpId = req.user.gpId;

  if (!status) return res.status(400).json({ error: 'Status is required' });

  db.run('UPDATE complaints SET status = ?, response = ? WHERE id = ? AND gpId = ?', [status, response || null, id, gpId], function(err) {
    if (err) return res.status(500).json({ error: 'Database update failed' });
    if (this.changes === 0) return res.status(404).json({ error: 'Complaint not found or unauthorized' });
    res.json({ message: 'Complaint updated successfully', id, status, response });
  });
});

// ==========================================
// E-SEVA REQUEST ROUTES
// ==========================================

// Submit E-Seva Request (Public - requires X-GP-ID)
app.post('/api/eseva/request', getGpId, upload.fields([{ name: 'idFront', maxCount: 1 }, { name: 'idBack', maxCount: 1 }]), (req, res) => {
  const { fullName, mobile, whatsapp, email, idType, idNumber, documentType, remarks } = req.body;
  const gpId = req.gpId;

  if (!fullName || !mobile || !whatsapp || !idType || !idNumber || !documentType) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  const idFrontFile = req.files && req.files['idFront'] ? req.files['idFront'][0] : null;
  const idBackFile = req.files && req.files['idBack'] ? req.files['idBack'][0] : null;

  if (!idFrontFile || !idBackFile) {
    return res.status(400).json({ error: 'Both identity document front and back files are required' });
  }

  const idFrontUrl = `/uploads/${idFrontFile.filename}`;
  const idBackUrl = `/uploads/${idBackFile.filename}`;
  const createdAt = new Date().toLocaleString('mr-IN');

  const query = `INSERT INTO eseva_requests 
    (gpId, fullName, mobile, whatsapp, email, idType, idNumber, documentType, remarks, idFrontUrl, idBackUrl, status, createdAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`;

  db.run(query, [
    gpId,
    fullName.trim(),
    mobile.trim(),
    whatsapp.trim(),
    email ? email.trim() : null,
    idType,
    idNumber.trim(),
    documentType,
    remarks ? remarks.trim() : null,
    idFrontUrl,
    idBackUrl,
    createdAt
  ], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to record application: ' + err.message });
    res.status(201).json({ id: this.lastID, fullName, documentType, status: 'Pending', createdAt });
  });
});

// Get E-Seva Stats (Public - requires X-GP-ID)
app.get('/api/eseva/stats', getGpId, (req, res) => {
  const gpId = req.gpId;
  db.all('SELECT status, COUNT(*) as count FROM eseva_requests WHERE gpId = ? GROUP BY status', [gpId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database read error' });
    
    let total = 0;
    let pending = 0;
    let delivered = 0;

    rows.forEach(row => {
      total += row.count;
      if (row.status === 'Pending') pending += row.count;
      if (row.status === 'Approved' || row.status === 'Delivered') delivered += row.count;
    });

    res.json({ total, pending, delivered });
  });
});

// Get all requests (Admin/Staff only - filtered by logged-in user's gpId)
app.get('/api/eseva/requests', authenticateToken, (req, res) => {
  const gpId = req.user.gpId;
  db.all('SELECT * FROM eseva_requests WHERE gpId = ? ORDER BY id DESC', [gpId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database read error' });
    res.json(rows);
  });
});

// Update status, add remarks, upload approved document (Admin/Staff only - enforced by gpId)
app.patch('/api/eseva/requests/:id', authenticateToken, upload.single('approvedDoc'), (req, res) => {
  const { id } = req.params;
  const { status, adminRemarks } = req.body;
  const gpId = req.user.gpId;

  if (!status) return res.status(400).json({ error: 'Status is required' });

  // Get current record first to verify ownership
  db.get('SELECT * FROM eseva_requests WHERE id = ? AND gpId = ?', [id, gpId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Request not found or unauthorized' });

    let approvedDocUrl = row.approvedDocUrl;
    if (req.file) {
      approvedDocUrl = `/uploads/${req.file.filename}`;
    }

    const query = 'UPDATE eseva_requests SET status = ?, adminRemarks = ?, approvedDocUrl = ? WHERE id = ? AND gpId = ?';
    db.run(query, [status, adminRemarks || null, approvedDocUrl, id, gpId], function(err) {
      if (err) return res.status(500).json({ error: 'Database update failed' });
      res.json({ message: 'Request updated successfully', id, status, adminRemarks, approvedDocUrl });
    });
  });
});

// ==========================================
// YOJANA (SCHEMES) ROUTES
// ==========================================

// Get active yojanas (Public - requires X-GP-ID, loads GP-specific + Global schemes)
app.get('/api/yojanas', getGpId, (req, res) => {
  const { category } = req.query;
  const gpId = req.gpId;
  let query = "SELECT * FROM yojanas WHERE status = 'Active' AND (gpId = ? OR gpId = 'global')";
  const params = [gpId];

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database read error' });
    res.json(rows);
  });
});

// Get all yojanas (Admin only - returns local and global schemes)
app.get('/api/yojanas/all', authenticateToken, (req, res) => {
  const gpId = req.user.gpId;
  db.all("SELECT * FROM yojanas WHERE gpId = ? OR gpId = 'global' ORDER BY id DESC", [gpId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database read error' });
    res.json(rows);
  });
});

// Create new yojana (Admin only - links to admin's gpId)
app.post('/api/yojanas', authenticateToken, (req, res) => {
  const { title, description, benefits, eligibility, documents, status, category } = req.body;
  const gpId = req.user.gpId;

  if (!title || !description || !benefits || !eligibility || !documents || !category) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  const createdAt = new Date().toLocaleString('mr-IN');
  const query = `INSERT INTO yojanas 
    (gpId, title, description, benefits, eligibility, documents, status, category, createdAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [
    gpId,
    title.trim(),
    description.trim(),
    benefits.trim(),
    eligibility.trim(),
    documents.trim(),
    status || 'Active',
    category,
    createdAt
  ], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create scheme: ' + err.message });
    res.status(201).json({ id: this.lastID, title, category, status: status || 'Active', createdAt });
  });
});

// Update a yojana (Admin only - enforces ownership)
app.put('/api/yojanas/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, benefits, eligibility, documents, status, category } = req.body;
  const gpId = req.user.gpId;

  if (!title || !description || !benefits || !eligibility || !documents || !category) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  const query = `UPDATE yojanas SET 
    title = ?, description = ?, benefits = ?, eligibility = ?, documents = ?, status = ?, category = ? 
    WHERE id = ? AND (gpId = ? OR gpId = 'global')`;

  db.run(query, [
    title.trim(),
    description.trim(),
    benefits.trim(),
    eligibility.trim(),
    documents.trim(),
    status,
    category,
    id,
    gpId
  ], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to update scheme' });
    if (this.changes === 0) return res.status(404).json({ error: 'Scheme not found or unauthorized' });
    res.json({ message: 'Scheme updated successfully', id, title, category, status });
  });
});

// Delete a yojana (Admin only - enforces ownership)
app.delete('/api/yojanas/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const gpId = req.user.gpId;

  db.run('DELETE FROM yojanas WHERE id = ? AND gpId = ?', [id, gpId], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete scheme' });
    if (this.changes === 0) return res.status(404).json({ error: 'Scheme not found or unauthorized' });
    res.json({ message: 'Scheme deleted successfully', id });
  });
});

// ==========================================
// RTC / LAND RECORD (७/१२ उतारा) ROUTES
// ==========================================

// Search/Get RTC records (Public - requires X-GP-ID)
app.get('/api/rtc', getGpId, (req, res) => {
  const { surveyNumber, ownerName } = req.query;
  const gpId = req.gpId;
  let query = 'SELECT * FROM rtc_records WHERE gpId = ?';
  const params = [gpId];

  if (surveyNumber || ownerName) {
    query += ' AND (';
    const conditions = [];
    if (surveyNumber) {
      conditions.push(' surveyNumber LIKE ?');
      params.push(`%${surveyNumber.trim()}%`);
    }
    if (ownerName) {
      conditions.push(' ownerName LIKE ?');
      params.push(`%${ownerName.trim()}%`);
    }
    query += conditions.join(' OR') + ')';
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to search land records' });
    res.json(rows);
  });
});

// Upload new RTC record (Admin only - automatically links to admin's gpId)
app.post('/api/rtc', authenticateToken, upload.single('rtcFile'), (req, res) => {
  const { surveyNumber, ownerName, village } = req.body;
  const gpId = req.user.gpId;

  if (!surveyNumber || !ownerName || !village) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'RTC scan PDF file is required' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const createdAt = new Date().toLocaleString('mr-IN');

  const query = `INSERT INTO rtc_records (gpId, surveyNumber, ownerName, village, fileUrl, createdAt) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(query, [gpId, surveyNumber.trim(), ownerName.trim(), village, fileUrl, createdAt], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'A record with this land survey number already exists in this Gram Panchayat.' });
      }
      return res.status(500).json({ error: 'Failed to save record: ' + err.message });
    }
    res.status(201).json({ id: this.lastID, surveyNumber, ownerName, fileUrl, createdAt });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running successfully on http://localhost:${PORT}`);
});
