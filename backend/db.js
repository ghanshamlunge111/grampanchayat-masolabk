const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // 1. Gram Panchayats Table
    db.run(`CREATE TABLE IF NOT EXISTS grampanchayats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gpId TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL
    )`);

    // Seed Gram Panchayats
    db.get('SELECT COUNT(*) as count FROM grampanchayats', [], (err, row) => {
      if (err) return console.error(err);
      if (row.count === 0) {
        db.run("INSERT INTO grampanchayats (gpId, name) VALUES ('gp-masolaBk', 'मसोला (खुर्द)')");
        console.log('Seeded Gram Panchayats.');
      }
    });

    // 2. Users Table (multi-tenant with gpId)
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      gpId TEXT NOT NULL,
      FOREIGN KEY (gpId) REFERENCES grampanchayats(gpId)
    )`);

    // Seed default users for multiple GPs
    db.get('SELECT COUNT(*) as count FROM users', [], async (err, row) => {
      if (err) return console.error(err);
      if (row.count === 0) {
        const passwordHash = await bcrypt.hash('gp2025!', 10);
        
        // Masola accounts
        db.run('INSERT INTO users (username, password, role, gpId) VALUES (?, ?, ?, ?)', ['admin-masola', passwordHash, 'admin', 'gp-masolaBk']);
        db.run('INSERT INTO users (username, password, role, gpId) VALUES (?, ?, ?, ?)', ['staff-masola', passwordHash, 'staff', 'gp-masolaBk']);
        
        // Legacy 'admin' and 'staff' mapped to masola for compatibility
        db.run('INSERT INTO users (username, password, role, gpId) VALUES (?, ?, ?, ?)', ['admin', passwordHash, 'admin', 'gp-masolaBk']);
        db.run('INSERT INTO users (username, password, role, gpId) VALUES (?, ?, ?, ?)', ['staff', passwordHash, 'staff', 'gp-masolaBk']);

        console.log('Seeded multi-tenant user accounts.');
      }
    });

    // 3. Complaints Table (multi-tenant)
    db.run(`CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gpId TEXT NOT NULL,
      fullName TEXT NOT NULL,
      mobileNo TEXT NOT NULL,
      email TEXT,
      village TEXT NOT NULL,
      ward TEXT NOT NULL,
      category TEXT NOT NULL,
      address TEXT NOT NULL,
      details TEXT NOT NULL,
      ticketNo TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'Received',
      response TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (gpId) REFERENCES grampanchayats(gpId)
    )`);

    // 4. E-Seva Requests Table (multi-tenant)
    db.run(`CREATE TABLE IF NOT EXISTS eseva_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gpId TEXT NOT NULL,
      fullName TEXT NOT NULL,
      mobile TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      email TEXT,
      idType TEXT NOT NULL,
      idNumber TEXT NOT NULL,
      documentType TEXT NOT NULL,
      remarks TEXT,
      idFrontUrl TEXT,
      idBackUrl TEXT,
      approvedDocUrl TEXT,
      status TEXT DEFAULT 'Pending',
      adminRemarks TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (gpId) REFERENCES grampanchayats(gpId)
    )`);

    // 5. Yojanas Table (multi-tenant / global option)
    db.run(`CREATE TABLE IF NOT EXISTS yojanas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gpId TEXT NOT NULL, -- can be a specific gpId or 'global'
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      benefits TEXT NOT NULL,
      eligibility TEXT NOT NULL,
      documents TEXT NOT NULL,
      status TEXT DEFAULT 'Active',
      category TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )`);

    // Seed initial yojanas (as global)
    db.get('SELECT COUNT(*) as count FROM yojanas', [], (err, row) => {
      if (err) return console.error(err);
      if (row.count === 0) {
        const now = new Date().toLocaleString('mr-IN');
        const initialYojanas = [
          {
            title: "महात्मा ज्योतिबा फुले जन आरोग्य योजना (MJPJAY)",
            description: "महाराष्ट्रातील पिवळ्या, केषरी व पांढऱ्या शिधापत्रिकाधारक कुटुंबांना गंभीर आजारांवर मोफत उपचारांची सुविधा दिली जाते.",
            benefits: "वर्षाला प्रति कुटुंब ₹ ५,००,००० पर्यंत मोफत उपचार व शस्त्रक्रिया.",
            eligibility: "महाराष्ट्रातील रहिवासी, वैध शिधापत्रिका व ओळखपत्र धारक.",
            documents: "शिधापत्रिका, आधार कार्ड, पॅन कार्ड किंवा वाहन चालक परवाना.",
            status: "Active",
            category: "Health",
            gpId: "global"
          },
          {
            title: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (PM-JAY)",
            description: "केंद्र शासनाची महत्त्वाकांक्षी योजना असून याद्वारे देशातील आर्थिकदृष्ट्या दुर्बल कुटुंबांना मोफत आरोग्य संरक्षण कवच मिळते.",
            benefits: "प्रति कुटुंब प्रति वर्ष ₹ ५,००,००० पर्यंत रोखविरहित (Cashless) उपचार.",
            eligibility: "SECC २०११ जनगणनेतील नोंदणीकृत गरीब व गरजू कुटुंबे.",
            documents: "जवळच्या सीएससी (CSC) केंद्रावर जाऊन 'आयुष्मान कार्ड' काढून घ्यावे.",
            status: "Active",
            category: "Health",
            gpId: "global"
          },
          {
            title: "प्रधानमंत्री मातृ वंदना योजना (PMMVY)",
            description: "पहिल्यांदाच गर्भवती असणाऱ्या मातांना पोषण आणि चांगल्या आरोग्यासाठी शासनाकडून बँक खात्यात थेट अनुदान दिले जाते.",
            benefits: "एकूण ₹ ५,००० चे आर्थिक सहाय्य ३ टप्प्यांत थेट बँक खात्यात.",
            eligibility: "पहिल्यांदा गरोदर असणाऱ्या सर्व महिला (शासकीय नोकरी नसलेल्या).",
            documents: "गावातील आशा सेविका किंवा अंगणवाडी सेविकेशी संपर्क साधून अर्ज भरावा.",
            status: "Active",
            category: "Health",
            gpId: "global"
          }
        ];

        const stmt = db.prepare('INSERT INTO yojanas (title, description, benefits, eligibility, documents, status, category, gpId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        initialYojanas.forEach(y => {
          stmt.run(y.title, y.description, y.benefits, y.eligibility, y.documents, y.status, y.category, y.gpId, now);
        });
        stmt.finalize();
        console.log('Seeded global health schemes (yojanas).');
      }
    });

    // 6. RTC / Land Records Table (multi-tenant)
    db.run(`CREATE TABLE IF NOT EXISTS rtc_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gpId TEXT NOT NULL,
      surveyNumber TEXT NOT NULL,
      ownerName TEXT NOT NULL,
      village TEXT NOT NULL,
      fileUrl TEXT,
      createdAt TEXT NOT NULL,
      UNIQUE(gpId, surveyNumber), -- Unique survey number *within* each Gram Panchayat
      FOREIGN KEY (gpId) REFERENCES grampanchayats(gpId)
    )`);

    // Seed dummy RTC records for multiple GPs
    db.get('SELECT COUNT(*) as count FROM rtc_records', [], (err, row) => {
      if (err) return console.error(err);
      if (row.count === 0) {
        const now = new Date().toLocaleString('mr-IN');
        const dummyRtc = [
          // Masola Bk. land records
          { surveyNumber: "53/A", ownerName: "रामराव नामदेवराव ठोंबरे", village: "मसोला बुद्रुक", gpId: "gp-masolaBk", fileUrl: "/uploads/rtc_dummy_101.pdf" },
          { surveyNumber: "74/B", ownerName: "शरद सुखदेव देशमुख", village: "मसोला बुद्रुक", gpId: "gp-masolaBk", fileUrl: "/uploads/rtc_dummy_105.pdf" }
        ];

        const stmt = db.prepare('INSERT INTO rtc_records (surveyNumber, ownerName, village, gpId, fileUrl, createdAt) VALUES (?, ?, ?, ?, ?, ?)');
        dummyRtc.forEach(r => {
          stmt.run(r.surveyNumber, r.ownerName, r.village, r.gpId, r.fileUrl, now);
        });
        stmt.finalize();
        console.log('Seeded multi-tenant RTC/Land records.');
      }
    });
  });
}

module.exports = db;
