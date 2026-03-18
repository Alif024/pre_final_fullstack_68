require('dotenv').config();
const express = require('express');
const Sequelize = require('sequelize');
const app = express();

const port = process.env.BACKEND_PORT || 3000;

app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './backend/database/data.db'
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
  res.send('Hello World!');
});



app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});