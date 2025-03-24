const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const Users = require("./Users");
const Prescription = require("./Prescription");
const PrescriptionDrug = require("./prescription_drug");
const PrescriptionDiagnosis = require("./prescription_diagnosis");


const models = {
  Users,
  Prescription,
  PrescriptionDrug,
  PrescriptionDiagnosis,

};

// Sync models
Object.keys(models).forEach((key) => {
  if (models[key].associate) {
    models[key].associate(models);
  }
});
sequelize.sync({ force: false }).then(() => {
  console.log('Models synced with database');
});
module.exports = sequelize;
