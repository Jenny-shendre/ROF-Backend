import Customer from "../Models/customer.js";
import asyncHandler from "../utils/asyncHandler.js";
import Attendant from "../Models/Attendant.js";
import Project from "../Models/projectModel.js";
import { v4 as uuidv4 } from "uuid";
import Team from "../Models/teamModel.js";
import Partner from "../Models/ChannelPartner.js";

export const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, mobile, projectName, projectLocation, notes } = req.body;
  const mobileFound = await Customer.findOne({ mobile });
  let customerId;

  if (mobileFound) {
    const project = await Project.findOne({ name: projectName });
    if (!project) {
      return res.status(400).json({ message: "Project not found." });
    }
    const teams = project.teams;

    const availableAttendant = await Attendant.findOneAndUpdate(
      { status: "available", team: { $in: teams } },
      {
        status: "assigned",
      },
      { new: true }
    );

    if (!availableAttendant) {
      return res
        .status(400)
        .json({ message: "No available attendants of the same team." });
    }

    const newClient = {
      ClientName: name,
      ClientId: mobileFound.customerId,
      ClientEmail: email,
      ClientMobile: mobile,
      ClientProject: projectName,
      completed: "progress",
      accepted: "pending",
      timeDuration: "00:00",
      notes: "",
    };

    await Attendant.findByIdAndUpdate(
      availableAttendant._id,
      {
        $push: {
          ClientName: newClient,
        },
      },
      { new: true }
    );

    const employeeIdFromAttendant = availableAttendant.employeeId;

    // Retrieve all client names for the attendant
    const attendant = await Attendant.findById(availableAttendant._id);
    const clientNames = attendant.ClientName;

    // Update team member names with all client names
    // Add client names to the ClientName array of the matched team member
    const teamsUpdated = await Team.updateMany(
      { "teamMemberNames.employeeId": employeeIdFromAttendant },
      {
        $addToSet: {
          "teamMemberNames.$[elem].ClientName": { $each: clientNames },
        },
      },
      {
        arrayFilters: [{ "elem.employeeId": employeeIdFromAttendant }],
        new: true,
      }
    );

    if (!teamsUpdated.matchedCount) {
      return res.status(404).json({ message: "Team members not found." });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      mobileFound._id,
      {
        $set: {
          name,
          email,
          mobile,
          projectName,
          projectLocation,
          customerId: mobileFound.customerId,
          attendant: availableAttendant._id,
          attendantName: availableAttendant.name,
          team: availableAttendant.team,
          notes,
        },
        $push: {
          log: {
            projectName,
            projectLocation,
            attendant: availableAttendant._id,
            attendantName: availableAttendant.name,
            team: availableAttendant.team,
          },
        },
      },
      { new: true }
    );

    return res.status(201).json(updatedCustomer);
  } else {
    const lastCustomer = await Customer.findOne().sort({ $natural: -1 });

    if (lastCustomer) {
      const lastCustomerIdNum = parseInt(lastCustomer.customerId.substring(4));
      customerId = `ROFC${(lastCustomerIdNum + 1).toString()}`;
    } else {
      customerId = "ROFC1";
    }

    const project = await Project.findOne({ name: projectName });
    if (!project) {
      return res.status(400).json({ message: "Project not found." });
    }
    const teams = project.teams;

    const availableAttendant = await Attendant.findOneAndUpdate(
      { status: "available", team: { $in: teams } },
      {
        status: "assigned",
      },
      { new: true }
    );

    if (!availableAttendant) {
      return res
        .status(400)
        .json({ message: "No available attendants of the same team." });
    }

    await Attendant.findByIdAndUpdate(
      availableAttendant._id,
      {
        $push: {
          ClientName: {
            ClientName: name,
            ClientId: customerId,
            ClientEmail: email,
            ClientMobile: mobile,
            ClientProject: projectName,
          },
        },
      },
      { new: true }
    );

    const employeeIdFromAttendant = availableAttendant.employeeId;

    // Retrieve all client names for the attendant
    const attendant = await Attendant.findById(availableAttendant._id);
    const clientNames = attendant.ClientName.map((client) => client.ClientName);

    // Update team member names with all client names
    const teamsUpdated = await Team.updateMany(
      { "teamMemberNames.employeeId": employeeIdFromAttendant },
      {
        $addToSet: {
          "teamMemberNames.$[elem].ClientName": { $each: clientNames },
        },
      },
      {
        arrayFilters: [{ "elem.employeeId": employeeIdFromAttendant }],
        new: true,
      }
    );

    if (!teamsUpdated.matchedCount) {
      return res.status(404).json({ message: "Team members not found." });
    }

    const newCustomer = await Customer.create({
      name,
      email,
      mobile,
      projectName,
      projectLocation,
      customerId,
      attendant: availableAttendant._id,
      attendantName: availableAttendant.name,
      team: availableAttendant.team,
      notes,
      log: [
        {
          projectName,
          projectLocation,
          attendant: availableAttendant._id,
          attendantName: availableAttendant.name,
          team: availableAttendant.team,
        },
      ],
    });

    return res.status(201).json(newCustomer);
  }
});

// export const createCustomer = asyncHandler(async (req, res) => {
//     const { name, email, mobile, projectName, projectLocation } = req.body;
//     const mobileFound = await Customer.findOne({ mobile });

//     let customerId;
//     if (mobileFound) {
//         if (mobileFound.name !== name) {
//             return res.status(400).json({ message: 'Customer Name does not match' });
//         }
//         customerId = mobileFound.customerId;
//     } else {
//         const lastCustomer = await Customer.findOne().sort({ $natural: -1 });
//         if (lastCustomer) {
//             const lastCustomerIdNum = parseInt(lastCustomer.customerId.substring(4));
//             customerId = `ROFC${(lastCustomerIdNum + 1).toString()}`;
//         } else {
//             customerId = 'ROFC1';
//         }
//     }

//     const project = await Project.findOne({ name: projectName });
//     if (!project) {
//         return res.status(400).json({ message: 'Project not found.' });
//     }

//     const teams = project.teams;

//     const availableAttendant = await Attendant.findOneAndUpdate(
//         { status: 'available', team: { $in: teams } },
//         { status: 'assigned' },
//         { new: true }
//     );

//     if (!availableAttendant) {
//         return res.status(400).json({ message: 'No available attendants of same team.' });
//     }

//     const newCustomer = await Customer.create({
//         name,
//         email,
//         mobile,
//         projectName,
//         projectLocation,
//         customerId,
//         attendant: availableAttendant._id,
//         attendantName: availableAttendant.name,
//         team: availableAttendant.team,
//         log: mobileFound ? mobileFound.log.concat({
//             projectName,
//             projectLocation,
//             attendant: availableAttendant._id,
//             attendantName: availableAttendant.name,
//             team: availableAttendant.team,
//         }) : [{
//             projectName,
//             projectLocation,
//             attendant: availableAttendant._id,
//             attendantName: availableAttendant.name,
//             team: availableAttendant.team,
//         }]
//     });

//     res.status(201).json(newCustomer);
// });

export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find()
    .populate("attendant", "name")
    .sort({ updatedAt: -1 });
  res.status(200).json(customers);
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const registeredCustomer = await Customer.find({
    customerId: req.params.id,
  }).populate("attendant", "name");
  if (!registeredCustomer)
    return res.status(404).json({ message: "Customer not found" });
  res.status(200).json(registeredCustomer);
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const { name, email, notes } = req.body;
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name, email, notes },
    { new: true, runValidators: true }
  );
  if (!customer) return res.status(404).json({ message: "Customer not found" });

  await Attendant.findByIdAndUpdate(customer.attendant, {
    status: "available",
  });

  res.status(200).json(customer);
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).json({ message: "Customer not found" });
  res.status(200).json({ message: "Customer deleted" });
});

export const ClientNotes = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Update", id);
    const { notes } = req.body;
    const client = await Customer.findOne({ customerId: id });
    console.log("client", client);
    const customer = await Customer.findByIdAndUpdate(
      client._id,
      { notes },
      { new: true, runValidators: true }
    );
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    await Attendant.findByIdAndUpdate(customer.attendant, {
      status: "available",
    });

    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ massage: error.message });
  }
};

export const updateCustomerV2 = asyncHandler(async (req, res) => {
  const { customerId } = req.params; // Get customerId from request parameters
  const { name, email, notes } = req.body;
  try {
    // First, try to find the customer in the Customer collection using customerId
    let customer = await Customer.findOne({ customerId });

    // If not found, try to find the customer in the Partner collection using partnerId
    if (!customer) {
      customer = await Partner.findOne({ partnerId: customerId });
    }

    // If still not found, return an error
    if (!customer) {
      return res.status(404).json({ message: "Customer or Partner not found" });
    }

    console.log(
      "customer.collection.collectionName",
      customer.collection.collectionName
    );

    // If the customer was found in the Customer collection
    if (customer.collection.collectionName === "customers") {
      // Update the Customer document
      customer = await Customer.findByIdAndUpdate(
        customer._id,
        {
          name,
          email,
          notes,
        },
        { new: true } // Return the updated document
      );
    }
    // If the customer was found in the Partner collection
    else if (customer.collection.collectionName === "partners") {
      // Update the Partner document
      customer = await Partner.findByIdAndUpdate(
        customer._id,
        {
          customerName: name,
          notes,
          email, // Assuming Partner also has an email field; otherwise, remove it
        },
        { new: true } // Return the updated document
      );
    }

    // Return the updated document
    res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({ error: error });
  }
});
export const getCustomerV2 = asyncHandler(async (req, res) => {
  const { customerId } = req.params; // Get customerId from request parameters
  const { name, email, notes } = req.body;
  try {
    // First, try to find the customer in the Customer collection using customerId
    let customer = await Customer.findOne({ customerId });

    // If not found, try to find the customer in the Partner collection using partnerId
    if (!customer) {
      customer = await Partner.findOne({ partnerId: customerId });
    }

    // If still not found, return an error
    if (!customer) {
      return res.status(404).json({ message: "Customer or Partner not found" });
    }

    // Return the updated document
    res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({ error: error });
  }
});
