import SalesManager from "../Models/salesManager.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import Team from "../Models/teamModel.js";
import Attendant from "../Models/Attendant.js";

// const generateRandomPassword = () => {
//   const randomNumbers = Math.floor(1000 + Math.random() * 9000).toString();
//   return `Rof@${randomNumbers}`;
// };

// const sendEmail = async (email, password) => {
//   let config = {
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: false, // Use `true` for port 465, `false` for all other ports
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   };

//   const transporter = nodemailer.createTransport(config);

//   const mailOptions = {
//     from: "process.env.EMAIL_USER",
//     to: email,
//     subject: "Your Account Details",
//     text: `Your account of sales manager has been created. Your credentials are:\n\nLogin ID: ${email}\nPassword: ${password}`,
//   };

//   await transporter.sendMail(mailOptions);
// };


// Create a new Sales Manager
export const createSalesManager = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res
        .status(400)
        .json({ message: "Name, phone, and password are required fields." });
    }

    const existingManager = await SalesManager.findOne({ phone });
    if (existingManager) {
      return res
        .status(400)
        .json({ message: "An account with this phone already exists." });
    }

    const lastemployee = await SalesManager.findOne().sort({ $natural: -1 });
    let employeeId;

    if (lastemployee && lastemployee.employeeId) {
      const lastemployeeIdNum = parseInt(lastemployee.employeeId.substring(6));
      employeeId = `ROFEMO${(lastemployeeIdNum + 1).toString()}`;
    } else {
      employeeId = "ROFEMO1";
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const salesManager = new SalesManager({
      name,
      email,
      phone,
      employeeId,
      password: hashedPassword,
    });

    // await sendEmail(email, password);
    await salesManager.save();
    res.status(201).json(salesManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all Sales Managers
export const getSalesManagers = async (req, res) => {
  try {
    const salesManagers = await SalesManager.find();
    res.status(200).json(salesManagers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a Sales Manager by ID
export const getSalesManagerById = async (req, res) => {
  try {
    const salesManager = await SalesManager.findById(req.params.id);
    if (!salesManager)
      return res.status(404).json({ message: "Sales Manager not found" });
    res.status(200).json(salesManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Sales Manager
export const updateSalesManager = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const salesManager = await SalesManager.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true }
    );
    if (!salesManager)
      return res.status(404).json({ message: "Sales Manager not found" });
    res.status(200).json(salesManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Sales Manager
export const deleteSalesManager = async (req, res) => {
  try {
    const salesManager = await SalesManager.findByIdAndDelete(req.params.id);
    if (!salesManager)
      return res.status(404).json({ message: "Sales Manager not found" });
    res.status(200).json({ message: "Sales Manager deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const findSalesManagerTeamData = async (req, res) => {
  try {
    const { managerEmail } = req.params;

    // Find all teams with the given managerEmail and select only teamMemberNames
    const teams = await Team.find({ managerEmail }, "teamMemberNames");

    // Extract and flatten the teamMemberNames from each team
    const teamMemberNames = teams.flatMap((team) => team.teamMemberNames);

    // Create a Set of employeeIds for quick lookup
    const teamMemberEmployeeIds = new Set(
      teamMemberNames.map((member) => member.employeeId)
    );

    // Find all attendants whose employeeId is in the list of teamMemberEmployeeIds
    const attendants = await Attendant.find({});

    const teamMemberData = attendants.filter((attendant) =>
      teamMemberEmployeeIds.has(attendant.employeeId)
    );

    console.log("Matched Attendants:", teamMemberData);

    // Send the response with the list of matched team members
    res.status(200).json(teamMemberData);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getSalesManagerByEmployId = async (req, res) => {
  const { employeeId } = req.params;
  console.log(employeeId);
  try {
    const employee = await SalesManager.findOne({ employeeId });
    return res.status(200).json(employee);
  } catch (error) {
    res.status(404).json(error.massage);
  }
};

export const findSalesManagerlastTeamData = async (req, res) => {
  try {
    const { managerEmail } = req.params;

    // Find all teams with the given managerEmail and select only teamMemberNames
    const teams = await Team.find({ managerEmail }, "teamMemberNames");

    // Extract and flatten the teamMemberNames from each team
    const teamMemberNames = teams.flatMap((team) => team.teamMemberNames);

    // Create a Set of employeeIds for quick lookup
    const teamMemberEmployeeIds = new Set(
      teamMemberNames.map((member) => member.employeeId)
    );

    // Find all attendants whose employeeId is in the list of teamMemberEmployeeIds
    const attendants = await Attendant.find({
      employeeId: { $in: Array.from(teamMemberEmployeeIds) },
    });

    // Extract the last client info for each team member and spread the attendant data
    const teamMemberData = attendants.map((attendant) => {
      // Get the last client info from the ClientName array
      const lastClientInfo = attendant.ClientName?.length
        ? attendant.ClientName[attendant.ClientName.length - 1]
        : null;

      // Return the spread attendant data along with the last client info
      return {
        ...attendant.toObject(), // Spread the attendant data
        lastClientName: lastClientInfo, // Add the last client info
      };
    });

    console.log("Matched Attendants with Last Client Info:", teamMemberData);

    // Send the response with the list of matched team members and their last client info
    res.status(200).json(teamMemberData);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Server Error", error });
  }
};
