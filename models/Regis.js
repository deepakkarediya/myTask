const mongoose = require("mongoose");

const regisSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, require: true },
  phoneNumber: { type: Number, require: true },
  dob: { type: String },
  image: { type: String },
});

module.exports = mongoose.model("Regis", regisSchema);
