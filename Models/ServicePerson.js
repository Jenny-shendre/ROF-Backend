import mongoose from "mongoose";

const servicePersonSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "assigned"],
    default: "available",
  },
});

const ServicePerson = mongoose.model("ServicePerson", servicePersonSchema);

export default ServicePerson;
