import SalesNote from "../Models/SalesNote.js";

// Create a new note
export const createNote = async (req, res) => {
  const { name, note, role, project, employeeId } = req.body;
  try {
    const newNote = new SalesNote({
      name,
      note,
      role,
      project,
      employeeId,
    });
    console.log(newNote);
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all notes
export const getNotes = async (req, res) => {
  try {
    const notes = await SalesNote.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Edit a note by ID
export const editNote = async (req, res) => {
  const { name, note, role } = req.body;
  const { id } = req.params;

  try {
    const updatedNote = await SalesNote.findByIdAndUpdate(
      id,
      { name, note, role },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Share a note (example: send via email)
export const shareNote = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const note = await SalesNote.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Logic to share the note via email or any other method
    const emailContent = `Note: ${note.note}`;

    res.status(200).json({ message: `Note shared with ${email}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
