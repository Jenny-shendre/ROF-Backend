import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({

    serviceType: { type: String, required: true }
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;