const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Prescription = require("./Prescription");

const PrescriptionDiagnosis = sequelize.define("PrescriptionDiagnosis", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  prescription_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Prescription,
      key: "id",
    },
  },
  icd_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  diagnosis_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = PrescriptionDiagnosis;