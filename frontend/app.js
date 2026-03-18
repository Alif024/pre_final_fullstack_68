require("dotenv").config();

const express = require("express");
const axios = require("axios");
const app = express();
const path = require("path");
var bodyParser = require("body-parser");

const port = process.env.FRONTEND_PORT || 3001;

const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT || 3000}`;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  try {
    const studentsResponse = await axios.get(`${BACKEND_URL}/students`);
    const subjectsResponse = await axios.get(`${BACKEND_URL}/subjects`);
    const enrollmentsResponse = await axios.get(`${BACKEND_URL}/enrollments`);
    res.render("index", {
      students: studentsResponse.data,
      subjects: subjectsResponse.data,
      enrollments: enrollmentsResponse.data,
    });
  } catch (error) {
    console.error("Error fetching data from backend:", error);
    res.status(500).send("Error fetching data from backend");
  }
});

app.get("/students", async (req, res) => {
  try {
    const studentsResponse = await axios.get(`${BACKEND_URL}/students`);
    res.render("students", {
      students: studentsResponse.data,
    });
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).send("Error fetching students");
  }
});

app.post("/students", async (req, res) => {
  try {
    const { student_code, full_name, major } = req.body;
    await axios.post(`${BACKEND_URL}/students`, {
      student_code,
      full_name,
      major,
    });
    res.redirect("/students");
  } catch (error) {
    console.error("Error creating student:", error.message);
    res.status(500).send("Error creating student");
  }
});

app.post("/students/:id/update", async (req, res) => {
  try {
    const { student_code, full_name, major } = req.body;
    await axios.put(`${BACKEND_URL}/students/${req.params.id}`, {
      student_code,
      full_name,
      major,
    });
    res.redirect("/students");
  } catch (error) {
    console.error("Error updating student:", error.message);
    res.status(500).send("Error updating student");
  }
});

app.post("/students/:id/delete", async (req, res) => {
  try {
    await axios.delete(`${BACKEND_URL}/students/${req.params.id}`);
    res.redirect("/students");
  } catch (error) {
    console.error("Error deleting student:", error.message);
    res.status(500).send("Error deleting student");
  }
});

app.get("/subjects", async (req, res) => {
  try {
    const subjectsResponse = await axios.get(`${BACKEND_URL}/subjects`);
    res.render("subjects", {
      subjects: subjectsResponse.data,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error.message);
    res.status(500).send("Error fetching subjects");
  }
});

app.post("/subjects", async (req, res) => {
  try {
    const { subject_code, subject_name, credits } = req.body;
    await axios.post(`${BACKEND_URL}/subjects`, {
      subject_code,
      subject_name,
      credits,
    });
    res.redirect("/subjects");
  } catch (error) {
    console.error("Error creating subject:", error.message);
    res.status(500).send("Error creating subject");
  }
});

app.post("/subjects/:id/update", async (req, res) => {
  try {
    const { subject_code, subject_name, credits } = req.body;
    await axios.put(`${BACKEND_URL}/subjects/${req.params.id}`, {
      subject_code,
      subject_name,
      credits,
    });
    res.redirect("/subjects");
  } catch (error) {
    console.error("Error updating subject:", error.message);
    res.status(500).send("Error updating subject");
  }
});

app.post("/subjects/:id/delete", async (req, res) => {
  try {
    await axios.delete(`${BACKEND_URL}/subjects/${req.params.id}`);
    res.redirect("/subjects");
  } catch (error) {
    console.error("Error deleting subject:", error.message);
    res.status(500).send("Error deleting subject");
  }
});

app.get("/enrollments", async (req, res) => {
  try {
    const [enrollmentsResponse, studentsResponse, subjectsResponse] =
      await Promise.all([
        axios.get(`${BACKEND_URL}/enrollments`),
        axios.get(`${BACKEND_URL}/students`),
        axios.get(`${BACKEND_URL}/subjects`),
      ]);

    res.render("enrollment", {
      enrollments: enrollmentsResponse.data,
      students: studentsResponse.data,
      subjects: subjectsResponse.data,
    });
  } catch (error) {
    console.error("Error fetching enrollments:", error.message);
    res.status(500).send("Error fetching enrollments");
  }
});

app.post("/enrollments", async (req, res) => {
  try {
    const { student_id, subject_id, semester, grade } = req.body;
    await axios.post(`${BACKEND_URL}/enrollments`, {
      student_id,
      subject_id,
      semester,
      grade: grade || null,
    });
    res.redirect("/enrollments");
  } catch (error) {
    console.error("Error creating enrollment:", error.message);
    res
      .status(500)
      .send(
        "<script>alert('Error creating enrollment'); window.history.back();</script>",
      );
  }
});

app.post("/enrollments/:id/update", async (req, res) => {
  try {
    const { student_id, subject_id, semester, grade } = req.body;
    await axios.put(`${BACKEND_URL}/enrollments/${req.params.id}`, {
      student_id,
      subject_id,
      semester,
      grade: grade || null,
    });
    res.redirect("/enrollments");
  } catch (error) {
    console.error("Error updating enrollment:", error.message);
    res.status(500).send("Error updating enrollment");
  }
});

app.post("/enrollments/:id/delete", async (req, res) => {
  try {
    await axios.delete(`${BACKEND_URL}/enrollments/${req.params.id}`);
    res.redirect("/enrollments");
  } catch (error) {
    console.error("Error deleting enrollment:", error.message);
    res.status(500).send("Error deleting enrollment");
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
