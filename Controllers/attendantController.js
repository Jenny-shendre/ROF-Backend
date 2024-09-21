import Attendant from "../Models/Attendant.js";
import asyncHandler from "../utils/asyncHandler.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import Team from "../Models/teamModel.js";
import Customer from "../Models/customer.js";
import Partner from "../Models/ChannelPartner.js";
/*
export const createAttendant = asyncHandler(async (req, res) => {
  const { name, status, team, email, project, phone } = req.body;

  const lastemployee = await Attendant.findOne().sort({ $natural: -1 });
  let employeeId;

  if (lastemployee && lastemployee.employeeId) {
    const lastemployeeIdNum = parseInt(lastemployee.employeeId.substring(5));
    employeeId = `ROFEX${(lastemployeeIdNum + 1).toString()}`;
  } else {
    employeeId = "ROFEX1";
  }

  Attendant.create(
    {
      name,
      status,
      team,
      employeeId,
      email,
      project,
      phone,
    },
    { new: true }
  );
  res.status(201).json({
    name,
    status,
    team,
    employeeId,
    email,
    project,
    phone,
  });
});
*/

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
//     text: `Your account of sales executive has been created. Your credentials are:\n\nLogin ID: ${email}\nPassword: ${password}`,
//   };

//   await transporter.sendMail(mailOptions);
// };

export const createAttendant = asyncHandler(async (req, res) => {
  const { name, status, team, email, project, phone, password } = req.body;

  if (!name || !phone || !password) {
    return res
      .status(400)
      .json({ message: "Name, phone, and password are required fields." });
  }

  const existingAttendant = await Attendant.findOne({ phone });
  if (existingAttendant) {
    return res
      .status(400)
      .json({ message: "An account with this phone already exists." });
  }

  const lastemployee = await Attendant.findOne().sort({ $natural: -1 });
  let employeeId;

  if (lastemployee && lastemployee.employeeId) {
    const lastemployeeIdNum = parseInt(lastemployee.employeeId.substring(5));
    employeeId = `ROFEX${(lastemployeeIdNum + 1).toString()}`;
  } else {
    employeeId = "ROFEX1";
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newAttendant = new Attendant({
    name,
    status,
    team,
    employeeId,
    email,
    project,
    phone,
    password: hashedPassword,
  });

  try {
    // await sendEmail(email, password);
    const savedAttendant = await newAttendant.save();
    res.status(201).json(savedAttendant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const getAttendants = asyncHandler(async (req, res) => {
  const attendants = await Attendant.find();
  res.status(200).json(attendants);
});

export const getAttendantById = asyncHandler(async (req, res) => {
  const registeredAttendant = await Attendant.findById(req.params.id);
  if (!registeredAttendant)
    return res.status(404).json({ message: "Attendant not found" });
  res.status(200).json(registeredAttendant);
});

export const makeAttendantAvailable = asyncHandler(async (req, res) => {
  const attendant = await Attendant.findByIdAndUpdate(
    req.params.id,
    {
      $set: { status: "available" },
    },
    { new: true, runValidators: true }
  );
  if (!attendant)
    return res.status(404).json({ message: "Attendant not found" });
  res.status(200).json(attendant);
});

export const makeAllAttendantsAvailable = asyncHandler(async (req, res) => {
  const result = await Attendant.updateMany(
    { status: "assigned" },
    { $set: { status: "available" } },
    { runValidators: true }
  );

  if (result.nModified === 0) {
    return res.status(404).json({ message: "No attendants were updated" });
  }

  res.status(200).json({
    message: "All attendants are now available",
    modifiedCount: result.nModified,
  });
});

export const updateAttendant = asyncHandler(async (req, res) => {
  const { name, status, team } = req.body;
  const attendant = await Attendant.findByIdAndUpdate(
    req.params.id,
    { name, status, team },
    { new: true, runValidators: true }
  );
  if (!attendant)
    return res.status(404).json({ message: "Attendant not found" });
  res.status(200).json(attendant);
});

export const deleteAttendant = asyncHandler(async (req, res) => {
  const attendant = await Attendant.findByIdAndDelete(req.params.id);
  if (!attendant)
    return res.status(404).json({ message: "Attendant not found" });
  res.status(200).json({ message: "Attendant deleted" });
});

export const addTeamMember = asyncHandler(async (req, res) => {
  const { employeeId, email, name, team, project } = req.body;
  const teamMember = await Attendant.findOne({ employeeId: employeeId });
  console.log("teamMember", teamMember);
  const assignedTeamMember = await Attendant.findByIdAndUpdate(
    teamMember._id,
    {
      team,
      project,
    },
    { new: true }
  );

  console.log(assignedTeamMember);

  return res.status(200).json(assignedTeamMember);
});

export const clientConversion = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Find and update Attendant
    const teamMember = await Attendant.findOne({ employeeId });
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    const result = await Attendant.findByIdAndUpdate(
      teamMember._id,
      { $inc: { clientConversion: 1 } },
      { new: true }
    );

    // Find and update Team
    const team = await Team.findOne({
      "teamMemberNames.employeeId": employeeId,
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const updatedTeam = await Team.findOneAndUpdate(
      { "teamMemberNames.employeeId": employeeId },
      { $inc: { "teamMemberNames.$[elem].clientConversion": 1 } },
      {
        arrayFilters: [{ "elem.employeeId": employeeId }],
        new: true,
      }
    );

    if (!updatedTeam) {
      return res.status(404).json({ message: "Employee not found in team" });
    }
    console.log(updatedTeam);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error during client conversion update:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const onlineEmploy = async (req, res) => {
  const { employeeId } = req.params;
  const { StaffStatus } = req.body;
  const teamMember = await Attendant.findOne({ employeeId: employeeId });
  if (!teamMember) {
    return res.status(404).json({ message: "Team member not found" });
  }
  const result = await Attendant.findByIdAndUpdate(
    teamMember._id,
    { StaffStatus },
    { new: true } // Optionally return the updated document
  );
  console.log(result);
  return res.status(200).json(result);
};

// export const checktimeout = async (req, res) => {
//   try {
//     const { attendantId } = req.params;

//     // Find the attendant by ID
//     const attendant = await Attendant.findById(attendantId);

//     if (!attendant) {
//       return res.status(404).json({ message: "Attendant not found" });
//     }

//     // Map over the logs in the ClientName array
//     const logs = attendant.ClientName?.map((log) => {
//       const logStatus = {};

//       // Handle `createdAt` timeout
//       let { diffInMinutes: createdAtMinutes, diffInSeconds: createdAtSeconds } =
//         calculateTimeDifference(log.createdAt);
//       if (createdAtMinutes >= 5) {
//         logStatus.createdAtStatus = "timeout";
//       } else {
//         logStatus.createdAtStatus = "remaining";
//         logStatus.createdAtRemaining = `${4 - createdAtMinutes} minutes and ${
//           59 - createdAtSeconds
//         } seconds`;
//       }

//       // Handle `attendTime` timeout if it exists
//       if (log.attendTime) {
//         let { diffInMinutes: attendMinutes, diffInSeconds: attendSeconds } =
//           calculateTimeDifference(log.attendTime);
//         if (attendMinutes >= 5) {
//           logStatus.attendTimeStatus = "timeout";
//         } else {
//           logStatus.attendTimeStatus = "remaining";
//           logStatus.attendTimeRemaining = `${4 - attendMinutes} minutes and ${
//             59 - attendSeconds
//           } seconds`;
//         }

//         // Calculate the time difference between `attendTime` and `createdAt`
//         let {
//           diffInMinutes: attendCreatedMinutes,
//           diffInSeconds: attendCreatedSeconds,
//         } = calculateTimeDifference(log.attendTime, log.createdAt);
//         logStatus.timeFromCreatedToAttend = `${attendCreatedMinutes} minutes and ${attendCreatedSeconds} seconds after createdAt`;
//       } else {
//         logStatus.attendTimeStatus = "not set";
//       }

//       // Handle `callCloseTime` timeout if it exists
//       if (log.callCloseTime) {
//         let {
//           diffInMinutes: callCloseMinutes,
//           diffInSeconds: callCloseSeconds,
//         } = calculateTimeDifference(log.callCloseTime);
//         if (callCloseMinutes >= 5) {
//           logStatus.callCloseTimeStatus = "timeout";
//         } else {
//           logStatus.callCloseTimeStatus = "remaining";
//           logStatus.callCloseTimeRemaining = `${
//             4 - callCloseMinutes
//           } minutes and ${59 - callCloseSeconds} seconds`;
//         }

//         // Calculate the time difference between `callCloseTime` and `attendTime`
//         if (log.attendTime) {
//           let {
//             diffInMinutes: callCloseAttendMinutes,
//             diffInSeconds: callCloseAttendSeconds,
//           } = calculateTimeDifference(log.callCloseTime, log.attendTime);
//           logStatus.timeFromAttendToCallClose = `${callCloseAttendMinutes} minutes and ${callCloseAttendSeconds} seconds after attendTime`;
//         }
//       } else {
//         logStatus.callCloseTimeStatus = "not set";
//       }

//       // Return the log ID along with individual statuses
//       return {
//         logId: log._id,
//         ...logStatus,
//       };
//     }).reverse();

//     res.json(logs.slice(0, 1));
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// Helper function to format minutes and seconds to MM:SS format
const formatTime = (minutes, seconds) => {
  const paddedMinutes = String(minutes).padStart(2, "0"); // Pads single digit minutes with a leading 0
  const paddedSeconds = String(seconds).padStart(2, "0"); // Pads single digit seconds with a leading 0
  return `${paddedMinutes}:${paddedSeconds}`;
};

export const checktimeout = async (req, res) => {
  try {
    const { attendantId } = req.params;

    // Find the attendant by ID
    const attendant = await Attendant.findById(attendantId);

    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    // Map over the logs in the ClientName array
    const logs = attendant.ClientName?.map((log) => {
      const logStatus = {};

      // Function to format minutes and seconds into "MM:SS" format
      const formatTime = (minutes, seconds) => {
        const pad = (n) => String(n).padStart(2, "0");
        return `${pad(minutes)}:${pad(seconds)}`;
      };

      // Handle `createdAt` timeout
      let { diffInMinutes: createdAtMinutes, diffInSeconds: createdAtSeconds } =
        calculateTimeDifference(log.createdAt);
      if (createdAtMinutes >= 5) {
        logStatus.createdAtStatus = "timeout";
      } else {
        logStatus.createdAtStatus = "remaining";
        logStatus.createdAtRemaining = formatTime(
          4 - createdAtMinutes,
          59 - createdAtSeconds
        );
      }

      // Handle `attendTime` timeout if it exists
      if (log.attendTime) {
        let { diffInMinutes: attendMinutes, diffInSeconds: attendSeconds } =
          calculateTimeDifference(log.attendTime);

        logStatus.attendTimeStatus = "remaining";
        logStatus.attendTimeRemaining = formatTime(
          attendMinutes,
          attendSeconds
        );

        // Calculate the time difference between `attendTime` and `createdAt`
        let {
          diffInMinutes: attendCreatedMinutes,
          diffInSeconds: attendCreatedSeconds,
        } = calculateTimeDifference(log.attendTime, log.createdAt);
        logStatus.timeFromCreatedToAttend = formatTime(
          attendCreatedMinutes,
          attendCreatedSeconds
        );
      } else {
        logStatus.attendTimeStatus = "not set";
      }

      // Handle `callCloseTime` timeout if it exists
      if (log.callCloseTime) {
        let {
          diffInMinutes: callCloseMinutes,
          diffInSeconds: callCloseSeconds,
        } = calculateTimeDifference(log.callCloseTime);

        logStatus.callCloseTimeStatus = "remaining";
        logStatus.callCloseTimeRemaining = formatTime(
          callCloseMinutes,
          callCloseSeconds
        );

        // Calculate the time difference between `callCloseTime` and `attendTime`
        if (log.attendTime) {
          let {
            diffInMinutes: callCloseAttendMinutes,
            diffInSeconds: callCloseAttendSeconds,
          } = calculateTimeDifference(log.callCloseTime, log.attendTime);
          logStatus.timeFromAttendToCallClose = formatTime(
            callCloseAttendMinutes,
            callCloseAttendSeconds
          );
        }
      } else {
        logStatus.callCloseTimeStatus = "not set";
      }

      // Return the log ID along with individual statuses
      return {
        logId: log._id,
        ...logStatus,
      };
    }).reverse();

    // Make sure you're accessing the correct log (first after reverse)
    const firstLog = logs[0];
    console.log("log", firstLog.logId);

    const createlog = attendant.ClientName.id(firstLog.logId);
    console.log("create", createlog);

    let customerID = await Customer.findOne({ customerId: createlog.ClientId });

    if (!customerID) {
      customerID = await Partner.findById({ partnerId: createlog.ClientId });
    }
    console.log("customerID", customerID);

    // Fix accessing the correct properties from the first log
    console.log(
      "timeResponse:",
      firstLog.callCloseTimeRemaining,
      "timeDuration:",
      firstLog.timeFromAttendToCallClose
    );

    let customer = await Customer.findByIdAndUpdate(
      customerID._id,
      {
        timeResponse: firstLog.callCloseTimeRemaining,
        timeDuration: firstLog.timeFromAttendToCallClose,
      },
      { new: true }
    );

    if (!customer) {
      customer = await Partner.findByIdAndUpdate(
        customerID._id,
        {
          timeResponse: firstLog.callCloseTimeRemaining,
          timeDuration: firstLog.timeFromAttendToCallClose,
        },
        { new: true }
      );
    }

    console.log("customer:", customer);
    if (!customer) {
      return res.status(404).json({ error: "Customer or Partner not found" });
    }
    res.json(logs.slice(0, 1));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Helper function to calculate time difference
function calculateTimeDifference(time1, time2 = new Date()) {
  const diffInMs = Math.abs(new Date(time1) - new Date(time2));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInSeconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
  return { diffInMinutes, diffInSeconds };
}

export const updateCreatelogTimes = async (req, res) => {
  try {
    const { attendantId, logId } = req.params;
    const { attendTime, callCloseTime } = req.body;

    // Find the attendant by ID
    const attendant = await Attendant.findById(attendantId);

    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    // Find the specific createlog entry inside ClientName array
    const createlog = attendant.ClientName.id(logId);

    if (!createlog) {
      return res.status(404).json({ message: "Createlog entry not found" });
    }

    // Update the fields if they exist in the request body
    if (attendTime) createlog.attendTime = Date.now();
    if (callCloseTime) createlog.callCloseTime = Date.now();
    console.log(attendTime);

    console.log(createlog);

    // Save the document
    await attendant.save();

    res.json({
      message: "Createlog times updated successfully",
      data: createlog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
