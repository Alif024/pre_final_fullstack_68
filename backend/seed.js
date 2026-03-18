// ============ [INITIALIZATION] ============
require("dotenv").config();
const express = require("express");
const Sequelize = require("sequelize");
const app = express();

const port = process.env.BACKEND_PORT || 3000;

app.use(express.json());

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./backend/database/data.sqlite",
});

const Students = sequelize.define("students", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
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

const Subjects = sequelize.define("subjects", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  subject_code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  subject_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  credits: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

const Enrollments = sequelize.define(
  "enrollments",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    student_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Students,
        key: "id",
      },
    },
    subject_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Subjects,
        key: "id",
      },
    },
    semester: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    grade: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isIn: [["A", "B+", "B", "C+", "C", "D+", "D", "F", null]],
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["student_id", "subject_id"],
      },
    ],
  },
);

sequelize.sync();

app.get("/", (req, res) => {
  res.send(
    "Please use the /students, /subjects or /enrollments endpoint to manage data",
  );
});
// =========== [END INITIALIZATION] ============

// =========== [API ROUTES] ===========

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Students.findAll();
    if (students.length > 0) {
      res.json(students);
    } else {
      res.status(404).json({ error: "No students found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Get one student
app.get("/students/:id", async (req, res) => {
  try {
    const student = await Students.findByPk(req.params.id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

// Create a new student
app.post("/students", async (req, res) => {
  try {
    const { student_code, full_name, major } = req.body;
    const student = await Students.create({ student_code, full_name, major });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to create student" });
  }
});

// Update a student
app.put("/students/:id", async (req, res) => {
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
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update student" });
  }
});

// Delete a student
app.delete("/students/:id", async (req, res) => {
  try {
    const student = await Students.findByPk(req.params.id);
    if (student) {
      await student.destroy();
      res.json({ message: "Student deleted" });
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student" });
  }
});

// Get all subjects
app.get("/subjects", async (req, res) => {
  try {
    const subjects = await Subjects.findAll();
    if (subjects.length > 0) {
      res.json(subjects);
    } else {
      res.status(404).json({ error: "No subjects found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

  // Get one subject
app.get("/subjects/:id", async (req, res) => {
  try {
    const subject = await Subjects.findByPk(req.params.id);
    if (subject) {
      res.json(subject);
    } else {
      res.status(404).json({ error: "Subject not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subject" });
  }
});

  // Create a new subject
app.post("/subjects", async (req, res) => {
  try {
    const { subject_code, subject_name, credits } = req.body;
    const subject = await Subjects.create({
      subject_code,
      subject_name,
      credits,
    });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: "Failed to create subject" });
  }
});

  // Update a subject
app.put("/subjects/:id", async (req, res) => {
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
      res.status(404).json({ error: "Subject not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update subject" });
  }
});

  // Delete a subject
app.delete("/subjects/:id", async (req, res) => {
  try {
    const subject = await Subjects.findByPk(req.params.id);
    if (subject) {
      await subject.destroy();
      res.json({ message: "Subject deleted" });
    } else {
      res.status(404).json({ error: "Subject not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete subject" });
  }
});

  // Get all enrollments
app.get("/enrollments", async (req, res) => {
  try {
    const enrollments = await Enrollments.findAll();
    if (enrollments.length > 0) {
      res.json(enrollments);
    } else {
      res.status(404).json({ error: "No enrollments found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});

  // Get one enrollment
app.get("/enrollments/:id", async (req, res) => {
  try {
    const enrollment = await Enrollments.findByPk(req.params.id);
    if (enrollment) {
      res.json(enrollment);
    } else {
      res.status(404).json({ error: "Enrollment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollment" });
  }
});

  // Create a new enrollment
app.post("/enrollments", async (req, res) => {
  try {
    const { student_id, subject_id, semester, grade } = req.body;
    const enrollment = await Enrollments.create({
      student_id,
      subject_id,
      semester,
      grade,
    });
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create enrollment" });
  }
});

  // Update an enrollment
app.put("/enrollments/:id", async (req, res) => {
  try {
    const { student_id, subject_id, semester, grade } = req.body;
    const enrollment = await Enrollments.findByPk(req.params.id);
    if (enrollment) {
      enrollment.student_id = student_id || enrollment.student_id;
      enrollment.subject_id = subject_id || enrollment.subject_id;
      enrollment.semester = semester || enrollment.semester;
      enrollment.grade = grade || enrollment.grade;
      await enrollment.save();
      res.json(enrollment);
    } else {
      res.status(404).json({ error: "Enrollment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update enrollment" });
  }
});

  // Delete an enrollment
app.delete("/enrollments/:id", async (req, res) => {
  try {
    const enrollment = await Enrollments.findByPk(req.params.id);
    if (enrollment) {
      await enrollment.destroy();
      res.json({ message: "Enrollment deleted" });
    } else {
      res.status(404).json({ error: "Enrollment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete enrollment" });
  }
});

// =========== [END API ROUTES] ===========

// =========== [START SERVER] ===========
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
// =========== [END SERVER] ===========
