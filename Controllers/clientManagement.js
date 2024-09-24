import asyncHandler from "../utils/asyncHandler.js";
import Attendant from "../Models/Attendant.js";
import Customer from "../Models/customer.js";
import Partner from "../Models/ChannelPartner.js";
/*
export const acceptClient = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  const updatedAttendant = await Attendant.findByIdAndUpdate(
    attendant._id,
    {
      "ClientName.$[].accepted": "accepted",
    },
    { new: true }
  );

  res.status(200).json(updatedAttendant);
});
*/

export const acceptClient = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  try {
    const attendant = await Attendant.findOne({ employeeId });

    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    if (attendant.ClientName.length === 0) {
      return res.status(404).json({ message: "No clients to update" });
    }

    const lastClient = attendant.ClientName[attendant.ClientName.length - 1];

    // Update the client status to 'accepted'
    const updatedAttendant = await Attendant.findOneAndUpdate(
      { employeeId, "ClientName._id": lastClient._id },
      { $set: { "ClientName.$.accepted": "accepted" } },
      { new: true }
    );

    if (!updatedAttendant) {
      return res
        .status(404)
        .json({ message: "Failed to update client status" });
    }

    // Send the updated attendant as a response
    res.status(200).json(updatedAttendant);
  } catch (error) {
    return res.status(404).json({ message: "Failed to update client status" });
  }
});
/*
export const rejectClient = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  try {
    const attendant = await Attendant.findOne({ employeeId });

    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }
    
  //  const updatedAttendant = await Attendant.findByIdAndUpdate(
  //    attendant._id,
  //    {
  //      "ClientName.$[].accepted": "rejected",
  //      "ClientName.$[].completed": "notCompleted",
  //    },
  //    { new: true }
  //  );
 

    if (attendant.ClientName.length === 0) {
      return res.status(404).json({ message: "No clients to update" });
    }

    const lastClient = attendant.ClientName[attendant.ClientName.length - 1];

    // Update the client status to 'accepted'
    const updatedAttendant = await Attendant.findOneAndUpdate(
      { employeeId, "ClientName._id": lastClient._id },
      {
        $set: {
          "ClientName.$.accepted": "rejected",
          "ClientName.$.completed": "notCompleted",
          status: "available",
        },
      },
      { new: true }
    );

    if (!updatedAttendant) {
      return res
        .status(404)
        .json({ message: "Failed to update client status" });
    }

    res.status(200).json(updatedAttendant);
  } catch (error) {
    return res.status(404).json({ message: "Failed to update client status" });
  }
});
*/

/* old code
export const rejectClient = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  try {
    const attendant = await Attendant.findOne({ employeeId });

    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    if (attendant.ClientName.length === 0) {
      return res.status(404).json({ message: "No clients to update" });
    }

    const lastClient = attendant.ClientName[attendant.ClientName.length - 1];

    // Reject the last client in the list
    const updatedAttendant = await Attendant.findOneAndUpdate(
      { employeeId, "ClientName._id": lastClient._id },
      {
        $set: {
          "ClientName.$.accepted": "rejected",
          "ClientName.$.completed": "notCompleted",
          status: "available", // Mark attendant as available after rejection
        },
      },
      { new: true }
    );

    if (!updatedAttendant) {
      return res
        .status(404)
        .json({ message: "Failed to update client status" });
    }

    // Now, try to find a second available attendant to reassign the client
    const secondAttendant = await Attendant.findOne({
      employeeId: { $ne: updatedAttendant.employeeId },
      project: updatedAttendant.project,
      status: "available", // Ensuring the attendant is available
    });

    if (secondAttendant) {
      // Reassign the rejected client to the available attendant
      await Attendant.updateOne(
        { employeeId: secondAttendant.employeeId },
        {
          $push: { ClientName: lastClient },
          $set: { status: "assigned" }, // Mark second attendant as assigned
        }
      );

      console.log(
        "Client reassigned to second attendant:",
        secondAttendant.employeeId
      );
    } else {
      console.log("No available attendant found. Client remains rejected.");
    }

    res.status(200).json(updatedAttendant);
  } catch (error) {
    console.error("Error updating client status:", error);
    return res
      .status(500)
      .json({ message: "Failed to update client status", error });
  }
});
*/

export const rejectClient = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  try {
    const attendant = await Attendant.findOne({ employeeId });

    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    if (attendant.ClientName.length === 0) {
      return res.status(404).json({ message: "No clients to update" });
    }

    const lastClient = attendant.ClientName[attendant.ClientName.length - 1];

    // Reject the last client in the list
    const updatedAttendant = await Attendant.findOneAndUpdate(
      { employeeId, "ClientName._id": lastClient._id },
      {
        $set: {
          "ClientName.$.accepted": "rejected",
          "ClientName.$.completed": "notCompleted",
          status: "available", // Mark attendant as available after rejection
        },
      },
      { new: true }
    );

    if (!updatedAttendant) {
      return res
        .status(404)
        .json({ message: "Failed to update client status" });
    }

    // Find a second available attendant to reassign the client
    const secondAttendant = await Attendant.findOne({
      employeeId: { $ne: updatedAttendant.employeeId },
      project: updatedAttendant.project,
      status: "available",
    });

    if (secondAttendant) {
      // Check if the client is already assigned to this attendant
      const clientAlreadyAssigned = secondAttendant.ClientName.some(
        (client) => client._id.toString() === lastClient._id.toString()
      );

      // Ensure recentPendingAppointment is defined
      /* Add logic to fetch recentPendingAppointment */
      console.log("lastClient", lastClient);
      if (!clientAlreadyAssigned) {
        // Reassign the rejected client to the available attendant
        await Attendant.updateOne(
          { employeeId: secondAttendant.employeeId },
          {
            $push: { ClientName: lastClient },
            $set: { status: "assigned" },
          }
        );

        // Update the Customer or Partner
        const customer = await Customer.findOne({
          customerId: lastClient.ClientId,
        });
        const partner = await Partner.findOne({
          partnerId: lastClient.ClientId,
        });
        console.log("ClientId", customer);
        if (customer) {
          await Customer.updateOne(
            { _id: customer._id },
            {
              $set: {
                attendantName: secondAttendant.name,
                attendant: {
                  _id: secondAttendant._id,
                  name: secondAttendant.name,
                },
              },
              $push: {
                log: {
                  projectName: lastClient.projectName,
                  projectLocation: lastClient.projectLocation,
                  attendant: secondAttendant._id,
                  attendantName: secondAttendant.name,
                  team: secondAttendant.team,
                },
              },
            }
          );
          console.log("Customer log updated with Attendant B's information.");
        } else if (partner) {
          await Partner.updateOne(
            { _id: partner._id },
            {
              $set: {
                attendantName: secondAttendant.name,
                attendant: secondAttendant._id,
              },
            }
          );
        }

        console.log(
          "Client reassigned to second attendant:",
          secondAttendant.employeeId
        );
      } else {
        console.log("Client is already assigned to this attendant.");
      }
    } else {
      console.log("No available attendant found. Client remains rejected.");
    }

    res.status(200).json(updatedAttendant);
  } catch (error) {
    console.error("Error updating client status:", error);
    return res
      .status(500)
      .json({ message: "Failed to update client status", error });
  }
});
export const attendantMeetingOver = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  try {
    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    // const updatedAttendant = await Attendant.findByIdAndUpdate(
    //   attendant._id,
    //   {
    //     endTime: Date.now(),
    //     "ClientName.$[].completed": "completed",
    //     status: "available",
    //   },
    //   { new: true }
    // );
    if (attendant.ClientName.length === 0) {
      return res.status(404).json({ message: "No clients to update" });
    }

    const lastClient = attendant.ClientName[attendant.ClientName.length - 1];

    // Update the client status to 'accepted'
    const updatedAttendant = await Attendant.findOneAndUpdate(
      { employeeId, "ClientName._id": lastClient._id },
      {
        $set: {
          "ClientName.$.completed": "completed",
          status: "available",
        },
      },
      { new: true }
    );

    if (!updatedAttendant) {
      return res
        .status(404)
        .json({ message: "Failed to update client status" });
    }
    res.status(200).json(updatedAttendant);
  } catch (error) {
    res.status(404).json({ message: "Failed to update client status" });
  }
});
/*
export const upcomingAppointments = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  const upcomingAppointments = attendant.ClientName.filter(
    (log) => log.completed === "progress"
  );
  if (upcomingAppointments.accepted === "pending") {
    setInterval(async () => {
      await Attendant.findOneAndUpdate(
        { employeeId, _id: upcomingAppointments._id },
        {
          $set: {
            "ClientName.$.accepted": "rejected",
            "ClientName.$.completed": "notCompleted",
            status: "available",
          },
        },
        { new: true }
      );
    }, 60);
  }
  res.status(200).json(upcomingAppointments);
});
*/
/*
export const upcomingAppointments = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  // Get appointments in progress
  const upcomingAppointments = attendant.ClientName.filter(
    (log) => log.completed === "progress"
  );

  // Find pending appointments
  const pendingAppointments = upcomingAppointments.find(
    (log) => log.accepted === "pending"
  );

  if (pendingAppointments) {
    // Set a timeout to change the status after 5 minutes (300,000 milliseconds)
    setTimeout(async () => {
      // Recheck if the appointment is still pending after 5 minutes
      const updatedAttendant = await Attendant.findOne({
        employeeId,
        "ClientName._id": pendingAppointments._id,
        "ClientName.accepted": "pending",
      });

      if (updatedAttendant) {
        // Update the appointment status to rejected after 5 minutes
        await Attendant.findOneAndUpdate(
          { employeeId, "ClientName._id": pendingAppointments._id },
          {
            $set: {
              "ClientName.$.accepted": "rejected",
              "ClientName.$.completed": "notCompleted",
              status: "available",
            },
          },
          { new: true }
        );

        // Find a new executive from the same project to assign the appointment
        const newExecutive = await Attendant.findOne({
          $and: [{ status: "available" }, { project: attendant.project }],
        });

        if (newExecutive) {
          await Attendant.findOneAndUpdate(
            { employeeId: newExecutive.employeeId },
            {
              $push: {
                ClientName: pendingAppointments,
              },
              status: "assigned",
            },
            { new: true }
          );
        }
        console.log("assigned", newExecutive);
        console.log("assigned");
      }
    }, 30); // 5 minutes in milliseconds
  }

  res.status(200).json(upcomingAppointments);
});
*/
/*
export const upcomingAppointments = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  // Get appointments in progress
  const upcomingAppointments = attendant.ClientName.filter(
    (log) => log.completed === "progress"
  );

  // Find pending appointments
  const pendingAppointments = upcomingAppointments.find(
    (log) => log.accepted === "pending"
  );

  if (pendingAppointments) {
    // Set a timeout to change the status after 5 seconds (5000 milliseconds)
    setTimeout(async () => {
      // Recheck if the appointment is still pending after 5 seconds
      const updatedAttendant = await Attendant.findOne({
        employeeId,
        "ClientName._id": pendingAppointments._id,
        "ClientName.accepted": "pending",
      });

      if (updatedAttendant) {
        // Update the appointment status to rejected
        await Attendant.findOneAndUpdate(
          { employeeId, "ClientName._id": pendingAppointments._id },
          {
            $set: {
              "ClientName.$.accepted": "rejected",
              "ClientName.$.completed": "notCompleted",
              status: "available",
            },
          },
          { new: true }
        );

        // Find another attendant in the same project team
        const secondAttendant = await Attendant.findOne({
          employeeId: { $ne: updatedAttendant.employeeId }, // Ensure it's a different attendant
          project: updatedAttendant.project, // Same project/team
          status: "available",
        });

        if (secondAttendant) {
          // Reassign the pending appointment to the second attendant
          await Attendant.findOneAndUpdate(
            { employeeId: secondAttendant.employeeId },
            {
              $push: {
                ClientName: pendingAppointments,
              },
              $set: { status: "assigned" }, // Assign the new attendant
            },
            { new: true }
          );
          console.log("result", secondAttendant);
        } else {
          // If no other attendant is available, just reject the appointment
          await Attendant.findOneAndUpdate(
            { employeeId, "ClientName._id": pendingAppointments._id },
            {
              $set: {
                "ClientName.$.accepted": "rejected",
                "ClientName.$.completed": "notCompleted",
              },
            },
            { new: true }
          );
        }
      }
      console.log("Client", updatedAttendant);
    }, 5000); // 5 seconds in milliseconds
  }

  res.status(200).json(upcomingAppointments);
});
*/
/*
export const upcomingAppointments = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  // Get appointments in progress
  const upcomingAppointments = attendant.ClientName.filter(
    (log) => log.completed === "progress"
  );

  // Find pending appointments
  const pendingAppointments = upcomingAppointments.find(
    (log) => log.accepted === "pending"
  );

  if (pendingAppointments) {
    console.log("Pending appointment found:", pendingAppointments);

    // Set a timeout to change the status after 5 seconds (5000 milliseconds)
    setTimeout(async () => {
      console.log("Checking appointment status after 5 seconds...");

      // Recheck if the appointment is still pending after 5 seconds
      const updatedAttendant = await Attendant.findOne({
        employeeId,
        "ClientName._id": pendingAppointments._id,
        "ClientName.accepted": "pending",
      });

      if (updatedAttendant) {
        console.log("Appointment still pending, rejecting...");

        // Update the appointment status to rejected
        await Attendant.findOneAndUpdate(
          { employeeId, "ClientName._id": pendingAppointments._id },
          {
            $set: {
              "ClientName.$.accepted": "rejected",
              "ClientName.$.completed": "notCompleted",
              status: "available",
            },
          },
          { new: true }
        );

        // Find another attendant in the same project team
        const secondAttendant = await Attendant.findOne({
          employeeId: { $ne: updatedAttendant.employeeId }, // Ensure it's a different attendant
          project: updatedAttendant.project, // Same project/team
          status: "available",
        });

        if (secondAttendant) {
          console.log("Reassigning to new attendant:", secondAttendant);

          // Reassign the pending appointment to the second attendant
          await Attendant.findOneAndUpdate(
            { employeeId: secondAttendant.employeeId },
            {
              $push: {
                ClientName: pendingAppointments,
              },
              $set: { status: "assigned" }, // Assign the new attendant
            },
            { new: true }
          );
        } else {
          console.log("No available attendants, keeping appointment rejected.");
        }
      } else {
        console.log("Appointment was accepted, no action taken.");
      }
    }, 30000); // 5 seconds in milliseconds
  } else {
    console.log("No pending appointments found.");
  }

  res.status(200).json(upcomingAppointments);
});
*/
/*

! is all status will be updated with rejected appointments
export const upcomingAppointments = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  // Get appointments in progress
  const upcomingAppointments = attendant.ClientName.filter(
    (log) => log.completed === "progress"
  );

  // Find pending appointments
  const pendingAppointments = upcomingAppointments.find(
    (log) => log.accepted === "pending"
  );

  if (pendingAppointments) {
    console.log("Pending appointment found:", pendingAppointments);

    // Set a timeout to change the status after 5 seconds (5000 milliseconds)
    setTimeout(async () => {
      console.log("Checking appointment status after 5 seconds...");

      // Recheck if the appointment is still pending after 5 seconds
      const updatedAttendant = await Attendant.findOne({
        employeeId,
        "ClientName._id": pendingAppointments._id, // Matching by _id correctly
        "ClientName.accepted": "pending", // Ensure it is still pending
      });

      if (updatedAttendant) {
        console.log("Appointment still pending, rejecting...");

        // Update the appointment status to rejected
        const updated = await Attendant.findOneAndUpdate(
          { employeeId, "ClientName._id": pendingAppointments._id },
          {
            $set: {
              "ClientName.$.accepted": "rejected", // Update status to rejected
              "ClientName.$.completed": "notCompleted",
              status: "available",
            },
          },
          { new: true }
        );

        console.log("Appointment status updated to rejected:", updated);

        // Find another attendant in the same project team
        const secondAttendant = await Attendant.findOne({
          employeeId: { $ne: updatedAttendant.employeeId }, // Ensure it's a different attendant
          project: updatedAttendant.project, // Same project/team
          status: "available",
        });

        if (secondAttendant) {
          console.log("Reassigning to new attendant:", secondAttendant);

          // Reassign the pending appointment to the second attendant
          await Attendant.findOneAndUpdate(
            { employeeId: secondAttendant.employeeId },
            {
              $push: {
                ClientName: pendingAppointments, // Push pending appointment
              },
              $set: { status: "assigned" }, // Assign new attendant
            },
            { new: true }
          );
        } else {
          console.log("No available attendants, keeping appointment rejected.");
        }
      } else {
        console.log("Appointment was accepted, no action taken.");
      }
      // 5 minutes in milliseconds
    }, 300000);
  } else {
    console.log("No pending appointments found.");
  }

  res.status(200).json(upcomingAppointments);
});
*/
/*
export const upcomingAppointments = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  // Get appointments in progress
  const upcomingAppointments = attendant.ClientName.filter(
    (log) => log.completed === "progress"
  );

  // Find pending appointments
  const pendingAppointments = upcomingAppointments.filter(
    (log) => log.accepted === "pending"
  );

  if (pendingAppointments.length > 0) {
    console.log("Pending appointments found:", pendingAppointments);

    pendingAppointments.forEach((appointment) => {
      // Set a timeout to change the status after 5 minutes (300000 milliseconds)
      setTimeout(async () => {
        console.log("Checking appointment status after 5 minutes...");

        // Recheck if the appointment is still pending after 5 minutes
        const updatedAttendant = await Attendant.findOne({
          employeeId,
          "ClientName._id": appointment._id, // Matching by _id correctly
          "ClientName.accepted": "pending", // Ensure it is still pending
        });

        if (updatedAttendant) {
          console.log("Appointment still pending, rejecting...");

          // Update the appointment status to rejected
          const updated = await Attendant.findOneAndUpdate(
            { employeeId, "ClientName._id": appointment._id },
            {
              $set: {
                "ClientName.$.accepted": "rejected", // Update status to rejected
                "ClientName.$.completed": "notCompleted",
                status: "available",
              },
            },
            { new: true }
          );

          console.log("Appointment status updated to rejected:", updated);

          // Find another attendant in the same project team
          const secondAttendant = await Attendant.findOne({
            employeeId: { $ne: updatedAttendant.employeeId }, // Ensure it's a different attendant
            project: updatedAttendant.project, // Same project/team
            status: "available",
          });

          if (secondAttendant) {
            console.log("Reassigning to new attendant:", secondAttendant);

            // Reassign the pending appointment to the second attendant
            await Attendant.findOneAndUpdate(
              { employeeId: secondAttendant.employeeId },
              {
                $push: {
                  ClientName: appointment, // Push the pending appointment to the new attendant
                },
                $set: { status: "assigned" }, // Set status to assigned
              },
              { new: true }
            );
            console.log(
              "Assigned appointment 2nd att ",
              secondAttendant.employeeId
            );
            // Set the first attendant's status back to available
            await Attendant.findOneAndUpdate(
              { employeeId: updatedAttendant.employeeId },
              { $set: { status: "available" } }
            );
          } else {
            console.log(
              "No available attendants, keeping appointment rejected."
            );
          }
        } else {
          console.log("Appointment was accepted, no action taken.");
        }
      }, 300000); // 5 minutes
    });
  } else {
    console.log("No pending appointments found.");
  }

  res.status(200).json(upcomingAppointments);
});
*/
/*
export const upcomingAppointments = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  const upcomingAppointments = attendant.ClientName.filter(
    (log) => log.completed === "progress"
  );

  const pendingAppointments = upcomingAppointments.filter(
    (log) => log.accepted === "pending"
  );

  if (pendingAppointments.length > 0) {
    console.log("Pending appointments found:", pendingAppointments);

    pendingAppointments.forEach((appointment) => {
      setTimeout(async () => {
        try {
          console.log("Checking appointment status after 5 minutes...");

          const updatedAttendant = await Attendant.findOne({
            employeeId,
            "ClientName._id": appointment._id,
            "ClientName.accepted": "pending",
          });

          if (updatedAttendant) {
            console.log("Appointment still pending, rejecting...");

            // Use bulkWrite for multiple updates at once
            await Attendant.bulkWrite([
              {
                updateOne: {
                  filter: { employeeId, "ClientName._id": appointment._id },
                  update: {
                    $set: {
                      "ClientName.$.accepted": "rejected",
                      "ClientName.$.completed": "notCompleted",
                      status: "available",
                    },
                  },
                },
              },
              // Reset status to available
              {
                updateOne: {
                  filter: { employeeId },
                  update: { $set: { status: "available" } },
                },
              },
            ]);

            const secondAttendant = await Attendant.findOne({
              employeeId: { $ne: updatedAttendant.employeeId },
              project: updatedAttendant.project,
              status: "available",
            });

            if (secondAttendant) {
              console.log("Reassigning to new attendant:", secondAttendant);

              await Attendant.bulkWrite([
                {
                  updateOne: {
                    filter: { employeeId: secondAttendant.employeeId },
                    update: {
                      $push: {
                        ClientName: appointment,
                      },
                      $set: { status: "assigned" },
                    },
                  },
                },
              ]);
            } else {
              console.log(
                "No available attendants, keeping appointment rejected."
              );
            }
          } else {
            console.log("Appointment was accepted, no action taken.");
          }
        } catch (error) {
          console.error("Error processing appointment:", error);
        }
      }, 300000); // 5 minutes
    });
  } else {
    console.log("No pending appointments found.");
  }

  res.status(200).json(upcomingAppointments);
});
*/
/*
export const upcomingAppointments = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  // Filter for appointments that are in progress
  const upcomingAppointments = attendant.ClientName.filter(
    (log) => log.completed === "progress"
  );

  // Filter for appointments that are pending
  const pendingAppointments = upcomingAppointments.filter(
    (log) => log.accepted === "pending"
  );

  if (pendingAppointments.length > 0) {
    console.log("Pending appointments found:", pendingAppointments);

    pendingAppointments.forEach((appointment) => {
      console.log("Appointment", appointment._id);
      setTimeout(async () => {
        try {
          console.log("Checking appointment status after 5 minutes...");

          // Re-fetch the appointment to check if it's still pending
          const updatedAttendant = await Attendant.findOne({
            employeeId,
            "ClientName._id": appointment._id,
            "ClientName.accepted": "pending", // Ensuring we only update if still pending
          });

          if (updatedAttendant) {
            console.log("Appointment still pending, rejecting...");

            // Update only the pending appointment's status
            await Attendant.bulkWrite([
              {
                updateOne: {
                  filter: { employeeId, "ClientName._id": appointment._id },
                  update: {
                    $set: {
                      "ClientName.$.accepted": "rejected", // Change pending to rejected
                      "ClientName.$.completed": "notCompleted", // Mark it as not completed
                      status: "available", // Set the attendant's status to available
                    },
                  },
                },
              },
            ]);

            // Attempt to find a second attendant with status 'available'
            const secondAttendant = await Attendant.findOne({
              employeeId: { $ne: updatedAttendant.employeeId },
              project: updatedAttendant.project,
              status: "available",
            });

            if (secondAttendant) {
              console.log("Reassigning to new attendant:", secondAttendant);

              // Reassign the appointment to the available attendant
              await Attendant.bulkWrite([
                {
                  updateOne: {
                    filter: { employeeId: secondAttendant.employeeId },
                    update: {
                      $push: { ClientName: appointment },
                      $set: { status: "assigned" },
                    },
                  },
                },
              ]);
            } else {
              console.log(
                "No available attendants, keeping appointment rejected."
              );
            }
          } else {
            console.log("Appointment was accepted, no action taken.");
          }
        } catch (error) {
          console.error("Error processing appointment:", error);
        }
      }, 300000); // 5 minutes delay
    });
  } else {
    console.log("No pending appointments found.");
  }

  // Return the filtered upcoming appointments
  res.status(200).json(upcomingAppointments);
});
*/
/*
export const upcomingAppointments = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  // Filter for appointments that are in progress
  const upcomingAppointments = attendant.ClientName.filter(
    (log) => log.completed === "progress"
  );

  // Filter for appointments that are pending
  const pendingAppointments = upcomingAppointments.filter(
    (log) => log.accepted === "pending"
  );

  if (pendingAppointments.length > 0) {
    // Sort pending appointments by createdAt to get the most recent one
    pendingAppointments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Take only the most recent pending appointment
    const recentPendingAppointment = pendingAppointments[0];

    console.log(
      "Processing the most recent pending appointment:",
      recentPendingAppointment._id
    );
    console.log("recentPendingAppointment", recentPendingAppointment);
    setTimeout(async () => {
      try {
        console.log("Checking appointment status after 5 minutes...");

        // Re-fetch the appointment to check if it's still pending
        const updatedAttendant = await Attendant.findOne({
          employeeId,
          "ClientName._id": recentPendingAppointment._id,
          "ClientName.accepted": "pending", // Ensuring we only update if still pending
        });

        if (updatedAttendant) {
          console.log("Appointment still pending, rejecting...");

          // Update only the pending appointment's status
          // const updatedAttendantResult = await Attendant.findOneAndUpdate(
          //   { employeeId, "ClientName._id": recentPendingAppointment._id },
          //   {
          //     $set: {
          //       "ClientName.$.accepted": "rejected",
          //       "ClientName.$.completed": "notCompleted",
          //       status: "available",
          //     },
          //   },
          //   { new: true }
          // );

          // const updatedAttendantResult = await Attendant.findOneAndUpdate(
          //   { employeeId },
          //   {
          //     $set: {
          //       "ClientName.$[elem].accepted": "rejected",
          //       "ClientName.$[elem].completed": "notCompleted",
          //       status: "available",
          //     },
          //   },
          //   {
          //     arrayFilters: [{ "elem._id": recentPendingAppointment._id }],
          //     new: true,
          //   }
          // );

          const updatedAttendantResult = await Attendant.findOneAndUpdate(
            { employeeId, "ClientName._id": recentPendingAppointment._id },
            {
              $set: {
                "ClientName.$[elem].accepted": "rejected",
                "ClientName.$[elem].completed": "notCompleted",
                status: "available",
              },
            },
            {
              arrayFilters: [
                {
                  "elem._id": recentPendingAppointment._id,
                  "elem.accepted": "pending",
                },
              ], // only update if it's pending
              new: true,
            }
          );

          if (!updatedAttendantResult) {
            console.log("No matching appointment found or already updated.");
          } else {
            console.log("Updated successfully:", updatedAttendantResult);
          }

          // Attempt to find a second attendant with status 'available'
          const secondAttendant = await Attendant.findOne({
            employeeId: { $ne: updatedAttendantResult.employeeId },
            project: updatedAttendantResult.project,
            status: "available",
          });
          console.log("secondAttendant", secondAttendant);
          if (secondAttendant) {
            // console.log("Reassigning to new attendant:", secondAttendant);

            // Reassign the appointment to the available attendant
            await Attendant.bulkWrite([
              {
                updateOne: {
                  filter: { employeeId: secondAttendant.employeeId },
                  update: {
                    $push: { ClientName: recentPendingAppointment },
                    $set: { status: "assigned" },
                  },
                },
              },
            ]);
          } else {
            console.log(
              "No available attendants, keeping appointment rejected."
            );
          }
          // console.log("updatedAttendantResult", secondAttendant);
        } else {
          console.log("Appointment was accepted, no action taken.");
        }
      } catch (error) {
        console.error("Error processing appointment:", error);
      }
    }, 300000); // 5 minutes delay
  } else {
    console.log("No pending appointments found.");
  }

  // Return the filtered upcoming appointments
  res.status(200).json(upcomingAppointments);
});
*/

export const upcomingAppointments = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendantA = await Attendant.findOne({ employeeId });

  if (!attendantA) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  const upcomingAppointments = attendantA.ClientName.filter(
    (log) => log.completed === "progress"
  );

  const pendingAppointments = upcomingAppointments.filter(
    (log) => log.accepted === "pending"
  );

  if (pendingAppointments.length > 0) {
    pendingAppointments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const recentPendingAppointment = pendingAppointments[0];
    console.log(
      "Processing the most recent pending appointment:",
      recentPendingAppointment._id
    );

    const duplicateAppointment = attendantA.ClientName.filter(
      (log) => log._id.toString() === recentPendingAppointment._id.toString()
    );

    if (duplicateAppointment.length > 1) {
      console.log("Duplicate appointment found, rejecting...");
      await Attendant.findOneAndUpdate(
        { employeeId, "ClientName._id": recentPendingAppointment._id },
        {
          $set: {
            "ClientName.$[elem].accepted": "rejected",
            "ClientName.$[elem].completed": "notCompleted",
            status: "available",
          },
        },
        {
          arrayFilters: [{ "elem._id": recentPendingAppointment._id }],
          new: true,
        }
      );
      console.log(
        "Duplicate appointment rejected. No further action required."
      );
    } else {
      let timerA = setTimeout(async () => {
        try {
          console.log("Checking appointment status after 5 minutes...");
          const updatedAttendantA = await Attendant.findOne({
            employeeId,
            "ClientName._id": recentPendingAppointment._id,
            "ClientName.accepted": "pending",
          });

          if (updatedAttendantA) {
            console.log(
              "Appointment still pending, rejecting for Attendant A..."
            );

            await Attendant.findOneAndUpdate(
              { employeeId, "ClientName._id": recentPendingAppointment._id },
              {
                $set: {
                  "ClientName.$[elem].accepted": "rejected",
                  "ClientName.$[elem].completed": "notCompleted",
                  status: "available",
                },
              },
              {
                arrayFilters: [{ "elem._id": recentPendingAppointment._id }],
                new: true,
              }
            );

            // Now transfer to Attendant B
            console.log("Reassigning to second attendant...");
            const attendantB = await Attendant.findOne({
              employeeId: { $ne: updatedAttendantA.employeeId },
              project: updatedAttendantA.project,
              status: "available",
              "ClientName._id": { $ne: recentPendingAppointment._id },
            });

            if (attendantB) {
              console.log("Assigning the appointment to Attendant B...");

              // Check if Attendant B already has the appointment
              const existingAppointment = attendantB.ClientName.find(
                (log) =>
                  log._id.toString() === recentPendingAppointment._id.toString()
              );

              if (!existingAppointment) {
                // Fetch the customer information
                const customer = await Customer.findOne({
                  customerId: recentPendingAppointment.ClientId,
                });
                const PartnerData = await Partner.findOne({
                  partnerId: recentPendingAppointment.ClientId,
                });
                recentPendingAppointment.count += 1;

                await Attendant.bulkWrite([
                  {
                    updateOne: {
                      filter: { employeeId: attendantB.employeeId },
                      update: {
                        $push: { ClientName: recentPendingAppointment },
                        $set: { status: "assigned" },
                      },
                    },
                  },
                ]);

                // Update customer's log with Attendant B's information
                if (customer) {
                  await Customer.updateOne(
                    { _id: customer._id },
                    {
                      $set: {
                        attendantName: attendantB.name,
                        attendant: {
                          _id: attendantB._id,
                          name: attendantB.name,
                        },
                      },
                      $push: {
                        log: {
                          projectName: recentPendingAppointment.projectName,
                          projectLocation:
                            recentPendingAppointment.projectLocation,
                          attendant: attendantB._id,
                          attendantName: attendantB.name,
                          team: attendantB.team,
                        },
                      },
                    }
                  );
                  console.log(
                    "Customer log updated with Attendant B's information."
                  );
                } else if (PartnerData) {
                  await Partner.updateOne(
                    { _id: PartnerData._id },
                    {
                      $set: {
                        attendantName: attendantB.name,
                        attendant: attendantB._id,
                      },
                    }
                  );
                }

                // Start the timer for Attendant B
                let timerB = setTimeout(async () => {
                  const updatedAttendantB = await Attendant.findOne({
                    employeeId: attendantB.employeeId,
                    "ClientName._id": recentPendingAppointment._id,
                    "ClientName.accepted": "pending",
                  });

                  if (updatedAttendantB) {
                    console.log("Attendant B did not accept, rejecting...");

                    await Attendant.findOneAndUpdate(
                      {
                        employeeId: attendantB.employeeId,
                        "ClientName._id": recentPendingAppointment._id,
                      },
                      {
                        $set: {
                          "ClientName.$[elem].accepted": "rejected",
                          "ClientName.$[elem].completed": "notCompleted",
                          status: "available",
                        },
                      },
                      {
                        arrayFilters: [
                          { "elem._id": recentPendingAppointment._id },
                        ],
                        new: true,
                      }
                    );

                    await Attendant.updateMany(
                      {
                        employeeId: {
                          $in: [
                            updatedAttendantA.employeeId,
                            attendantB.employeeId,
                          ],
                        },
                      },
                      { $set: { status: "available" } }
                    );
                    console.log("Both attendants rejected the appointment.");
                  } else {
                    clearTimeout(timerB);
                    console.log(
                      "Attendant B accepted the appointment, no further action."
                    );
                  }
                }, 300000); // 5 minutes for Attendant B
              } else {
                console.log(
                  "Attendant B already has this appointment, no action taken."
                );
              }
            } else {
              console.log(
                "No second attendant found, keeping appointment rejected for Attendant A."
              );
            }
          } else {
            console.log("Appointment was accepted, no action taken.");
            clearTimeout(timerA);
          }
        } catch (error) {
          console.error("Error processing appointment:", error);
        }
      }, 300000); // 5 minutes delay for Attendant A
    }
  } else {
    console.log("No pending appointments found.");
  }

  res.status(200).json(upcomingAppointments);
});

export const getClientHistory = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  const clientHistory = attendant.ClientName;
  res.status(200).json(clientHistory);
});

//delete the employee log in client history

export const deleteHistory = asyncHandler(async (req, res) => {
  const { employeeId, clientId } = req.params;

  try {
    // Find the attendant by employeeId and update the ClientName array
    const result = await Attendant.updateOne(
      { employeeId, "ClientName.ClientId": clientId },
      { $pull: { ClientName: { ClientId: clientId } } }
    );
    console.log(result); // Debugging line

    // Check if a document was modified
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Client deleted successfully" });
    } else {
      res.status(404).json({ message: "Client not found or already deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//update the employee log in client history

// export const UpdatesHistory = asyncHandler(async (req, res) => {
//   const { employeeId, clientId } = req.params;
//   const { name, Email, project, note } = req.body;

//   try {
//     // Find the attendant by employeeId and update the ClientName array
//     const result = await Attendant.updateOne(
//       { employeeId, "ClientName.ClientId": clientId },
//       {
//         $set: {
//           ClientName: {
//             ClientName: name,
//             ClientEmail: Email,
//             ClientProject: project,
//             notes: note,
//           },
//         },
//       },
//       { new: true }
//     );
//     console.log(result); // Debugging line

//     // Check if a document was modified
//     res.status(200).json({ message: "Client deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

export const UpdatesHistory = asyncHandler(async (req, res) => {
  const { employeeId, clientId } = req.params;
  const { name, Email, project, note } = req.body;

  try {
    // Find the attendant by employeeId and update the specific element in the ClientName array
    const result = await Attendant.updateOne(
      { employeeId, "ClientName.ClientId": clientId },
      {
        $set: {
          "ClientName.$.ClientName": name,
          "ClientName.$.ClientEmail": Email,
          "ClientName.$.ClientProject": project,
          "ClientName.$.notes": note,
        },
      }
    );

    console.log(result); // Debugging line

    // Check if a document was modified
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Update successful", result });
    } else {
      res.status(404).json({ message: "No matching client found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
