const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { body, query, validationResult } = require("express-validator");
const Prescription = require("../models/Prescription");
const PrescriptionDrug = require("../models/prescription_drug");
const PrescriptionDiagnosis = require("../models/prescription_diagnosis");
const Users = require("../models/users");
const sequelize = require("../config/database");
const validatePrescription = require("./validatePrescription");
const validatePrescriptionSearch = require("./validatePrescriptionSearch"); 

module.exports = function (app) {
  app.post(
    "/save_prescription",
    validatePrescription, 
    async (req, res) => {
      console.log("Incoming request body:", JSON.stringify(req.body, null, 2));
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", JSON.stringify(errors.array(), null, 2));
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        });
      }
  
      let transaction;
      try {
        transaction = await sequelize.transaction();
  
        const {
          erx_no,
          erx_date,
          prescriber_id,
          member_id,
          payer_tpa,
          emirates_id,
          reason_of_unavailability,
          name,
          gender,
          date_of_birth,
          weight,
          mobile,
          email,
          fill_date,
          physician,
          prescription_date,
          drugs,
          diagnoses,
        } = req.body;
  
        const requiredFields = [
          "erx_no",
          "erx_date",
          "prescriber_id",
          "member_id",
          "name",
          "payer_tpa",
          "emirates_id",
          "gender",
          "date_of_birth",
          "mobile",
          "email",
          "fill_date",
          "physician",
          "prescription_date",
        ];
        const missingFields = requiredFields.filter(
          (field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === ""
        );
        if (missingFields.length > 0) {
          console.log("Missing required fields:", missingFields);
          return res.status(400).json({
            error: "Missing required fields",
            details: `The following fields are required: ${missingFields.join(", ")}`,
          });
        }
  
        const prescriptionData = {
          id: uuidv4(),
          erx_no,
          erx_date,
          prescriber_id,
          member_id,
          patient_name: name,
          payer_tpa,
          emirates_id,
          reason_of_unavailability,
          gender,
          date_of_birth,
          weight,
          mobile,
          email,
          fill_date,
          physician,
          prescription_date,
        };
  
        console.log("Prescription data to save:", JSON.stringify(prescriptionData, null, 2));
  
        const prescription = await Prescription.create(prescriptionData, { transaction });
  
        if (Array.isArray(drugs) && drugs.length > 0) {
          await PrescriptionDrug.bulkCreate(
            drugs.map((d) => ({
              prescription_id: prescription.id,
              drug_code: d.drug_code,
              quantity: d.quantity,
              days_of_supply: d.days_of_supply,
              instructions: d.instructions,
            })),
            { transaction }
          );
        }
  
        if (Array.isArray(diagnoses) && diagnoses.length > 0) {
          await PrescriptionDiagnosis.bulkCreate(
            diagnoses.map((d) => ({
              prescription_id: prescription.id,
              icd_code: d.icd_code,
              diagnosis_code: d.diagnosis_code,
              description: d.description,
              is_primary: d.is_primary || false,
            })),
            { transaction }
          );
        }
  
        await transaction.commit();
        res.status(201).json({
          message: "Prescription saved successfully", 
          prescription_id: prescription.id,
        });
      } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Error saving prescription:", error.message, error.stack);
        return res.status(500).json({
          error: "Failed to save prescription",
          details: error.message,
        });
      }
    }
  );

  app.delete("/prescription-drugs/delete/:drugId", async (req, res) => {
    try {
      const { drugId } = req.params;
      const drug = await PrescriptionDrug.findByPk(drugId);

      if (!drug) {
        return res.status(404).json({ error: "Drug not found" });
      }

      await drug.destroy();
      res.status(200).json({ message: "Drug deleted successfully" });
    } catch (error) {
      console.error("Error deleting drug:", error);
      res.status(500).json({ error: "Error deleting drug", details: error.message });
    }
  });
};