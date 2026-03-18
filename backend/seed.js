// ============ [INITIALIZATION] ============
require('dotenv').config();
const express = require('express');
const Sequelize = require('sequelize');
const app = express();

const port = process.env.BACKEND_PORT || 3000;

app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './backend/database/data.sqlite'
});

const Students = sequelize.define('students', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  student_code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  full_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  major: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Subjects = sequelize.define('subjects', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  subject_code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  subject_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  credits: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

const Enrollments = sequelize.define('enrollments', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  student_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Students,
      key: 'id'
    } 
  },
  subject_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Subjects,
      key: 'id'
    }
  },
  semester: {
    type: Sequelize.STRING,
    allowNull: false
  },
  grade: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isIn: [['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', null]]
    }
  }
});

sequelize.sync();

app.get('/', (req, res) => {
  res.send('Please use the /students, /subjects or /enrollments endpoint to manage data');
});
// =========== [END INITIALIZATION] ============

// =========== [API ROUTES] ===========

  // Get all students
app.get('/students',async (req, res) => {
  try {
    const students = await Students.findAll();
    if (students.length > 0) {
      res.json(students);
    } else {
      res.status(404).json({ error: 'No students found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

  // Get one student
app.get('/students/:id', async (req, res) => {
  try {
    const student = await Students.findByPk(req.params.id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

  // Create a new student
app.post('/students', async (req, res) => {
  try {
    const { student_code, full_name, major } = req.body;
    const student = await Students.create({ student_code, full_name, major });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student' });
  }
});

  // Update a student
app.put('/students/:id', async (req, res) => {
  try {
    const { student_code, full_name, major } = req.body;
    const student = await Students.findByPk(req.params.id);
    if (student) {
      student.student_code = student_code || student.student_code;
      student.full_name = full_name || student.full_name;
      student.major = major || student.major;
      await student.save();
      res.json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

  // Delete a student
app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Students.findByPk(req.params.id);
    if (student) {
      await student.destroy();
      res.json({ message: 'Student deleted' });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

  // Similar routes can be created for Subjects and Enrollments following the same pattern as above
app.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subjects.findAll();
    if (subjects.length > 0) {
      res.json(subjects);
    } else {
      res.status(404).json({ error: 'No subjects found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

app.get('/subjects/:id', async (req, res) => {
  try {
    const subject = await Subjects.findByPk(req.params.id);
    if (subject) {
      res.json(subject);
    } else {
      res.status(404).json({ error: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subject' });
  }
});

app.post('/subjects', async (req, res) => {
  try {
    const { subject_code, subject_name, credits } = req.body;
    const subject = await Subjects.create({ subject_code, subject_name, credits });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

app.put('/subjects/:id', async (req, res) => {
  try {
    const { subject_code, subject_name, credits } = req.body;
    const subject = await Subjects.findByPk(req.params.id);
    if (subject) {
      subject.subject_code = subject_code || subject.subject_code;
      subject.subject_name = subject_name || subject.subject_name;
      subject.credits = credits || subject.credits;
      await subject.save();
      res.json(subject);
    } else {
      res.status(404).json({ error: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subject' });
  }
});

app.delete('/subjects/:id', async (req, res) => {
  try {
    const subject = await Subjects.findByPk(req.params.id);
    if (subject) {
      await subject.destroy();
      res.json({ message: 'Subject deleted' });
    } else {
      res.status(404).json({ error: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

// =========== [END API ROUTES] ===========

// =========== [START SERVER] ===========
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
// =========== [END SERVER] ===========