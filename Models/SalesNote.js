import mongoose from "mongoose";

const salesNoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Client", "Manager", "Super Admin", "Sales Executive"],
  },
  project: {
    type: String,
  },
  employeeId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  time: {
    type: String,
    default: () => new Date().toLocaleTimeString(),
  },
});

const SalesNote = mongoose.model("SalesNote", salesNoteSchema);

export default SalesNote;
