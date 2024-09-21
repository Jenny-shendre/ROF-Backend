import mongoose from "mongoose";

const BarDiagramSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // The date for which the counts are stored
  counts: { type: [Number], required: true }, // Array to store the hourly counts
});

export const BarDiagram = mongoose.model("BarDiagram", BarDiagramSchema);
