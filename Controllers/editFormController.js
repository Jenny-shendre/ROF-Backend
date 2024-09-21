import moment from "moment-timezone";
import Form from "../Models/formModel.js";

export const createForm = async (req, res) => {
  try {
    // Get the current time in IST
    const nowIST = moment().tz("Asia/Kolkata");
    const formattedResponseTime = nowIST.format("HH:mm"); // Format response time as hours and minutes

    const form = new Form({
      ...req.body,
      date: nowIST.toDate(), // Store date in UTC
      responseTime: formattedResponseTime, // Store response time as HH:mm
    });

    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getForms = async (req, res) => {
  try {
    const forms = await Form.find();
    // Format response time for each form
    const formattedForms = forms.map((form) => ({
      ...form.toObject(),
      responseTime: moment(form.responseTime, "HH:mm").format("HH:mm"), // Ensure formatting for response time
    }));
    res.status(200).json(formattedForms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: "Form not found" });

    // Format response time
    form.responseTime = moment(form.responseTime, "HH:mm").format("HH:mm");

    res.status(200).json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateForm = async (req, res) => {
  console.log(req.params);
  try {
    if (req.body.responseTime) {
      req.body.responseTime = moment(req.body.responseTime, "HH:mm").format(
        "HH:mm"
      );
    }

    const form = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!form) return res.status(404).json({ error: "Form not found" });

    // Format response time
    form.responseTime = moment(form.responseTime, "HH:mm").format("HH:mm");

    res.status(200).json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
