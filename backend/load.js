require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./backend/database/data.sqlite",
  logging: false,
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

async function loadData() {
  const dataPath = path.join(__dirname, "data.json");
  const rawData = fs.readFileSync(dataPath, "utf8");
  const data = JSON.parse(rawData);

  await sequelize.authenticate();
  await sequelize.sync();

  const transaction = await sequelize.transaction();

  try {
    await Enrollments.destroy({ where: {}, transaction });
    await Students.destroy({ where: {}, transaction });
    await Subjects.destroy({ where: {}, transaction });

    await Students.bulkCreate(data.students || [], {
      transaction,
      validate: true,
    });

    await Subjects.bulkCreate(data.subjects || [], {
      transaction,
      validate: true,
    });

    await Enrollments.bulkCreate(data.enrollments || [], {
      transaction,
      validate: true,
    });

    await transaction.commit();
    console.log("Data loaded successfully");
  } catch (error) {
    await transaction.rollback();
    console.error("Failed to load data:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

loadData();
