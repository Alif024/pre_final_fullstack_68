require("dotenv").config();

const express = require("express");
const axios = require("axios");
const app = express();
const path = require("path");
var bodyParser = require("body-parser");

const port = process.env.FRONTEND_PORT || 3001;

const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT || 3000}`;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  try {
    const studentsResponse = await axios.get(`${BACKEND_URL}/students`);
    const subjectsResponse = await axios.get(`${BACKEND_URL}/subjects`);
    const enrollmentsResponse = await axios.get(`${BACKEND_URL}/enrollments`);
    res.render("app", {
      students: studentsResponse.data,
      subjects: subjectsResponse.data,
      enrollments: enrollmentsResponse.data,
    });
  } catch (error) {
    console.error("Error fetching data from backend:", error);
    res.status(500).send("Error fetching data from backend");
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});