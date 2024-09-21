import asyncHandler from "../utils/asyncHandler.js";
import Attendant from "../Models/Attendant.js";
import Customer from "../Models/customer.js";
import ChannelPartner from "../Models/ChannelPartner.js";
import { BarDiagram } from "../Models/BarDiagram.js";
import SalesNote from "../Models/SalesNote.js";
import Partner from "../Models/ChannelPartner.js";
import Team from "../Models/teamModel.js";
const calculateStartDate = (interval) => {
  const now = new Date();
  let startDate;

  switch (interval) {
    case "daily":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "weekly":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      );
      break;
    case "monthly":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "yearly":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(0);
  }

  return startDate;
};

export const getNumberOfDirectVisitors = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  const startDate = calculateStartDate(interval);

  const allDirectVisitors = await Customer.find({
    createdAt: { $gte: startDate },
  });

  const numberOfDirectVisitors = allDirectVisitors.length;

  if (numberOfDirectVisitors === 0) {
    return res.status(404).json({ message: "Direct Visitors not found!" });
  }

  res.status(200).json({ numberOfDirectVisitors });
});

export const getNumberOfChannelVisitors = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  const startDate = calculateStartDate(interval);

  const allChannelVisitors = await ChannelPartner.find({
    createdAt: { $gte: startDate },
  });

  if (!allChannelVisitors) {
    return res.status(404).json({ message: "Channel Visitors not found!" });
  }
  const numberOfChannelVisitors = allChannelVisitors.length;

  res.status(200).json({ numberOfChannelVisitors });
});

export const getTotalMeetings = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  const startDate = calculateStartDate(interval);

  const allAttendants = await Attendant.find({
    createdAt: { $gte: startDate },
  });

  const totalMeetings = allAttendants.reduce((total, attendant) => {
    return total + (attendant.ClientName ? attendant.ClientName.length : 0);
  }, 0);

  res.status(200).json({ totalMeetings });
});

export const DealsClosed = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  try {
    const startDate = calculateStartDate(interval);

    const allAttendants = await Attendant.find({
      createdAt: { $gte: startDate },
    });

    const totalClientConversion = allAttendants.reduce((total, attendant) => {
      return total + attendant.clientConversion;
    }, 0);

    console.log(totalClientConversion);
    res.status(200).json({ totalClientConversion });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export const onlineEmployStatus = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  try {
    const startDate = calculateStartDate(interval);
    const allAttendants = await Attendant.find({
      updatedAt: { $gte: startDate },
    });

    const totalStatus = allAttendants.reduce((total, attendant) => {
      return total + (attendant.StaffStatus === "online" ? 1 : 0);
    }, 0);
    console.log(allAttendants);
    res.status(200).json({ totalStatus });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
/*
export const Top_Executive = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  const startDate = calculateStartDate(interval);
  const allAttendants = await Attendant.find({
    updatedAt: { $gte: startDate },
  });
  const TopAttendants = allAttendants.sort(
    (a, b) => b.clientConversion - a.clientConversion
  );
  const attendantsWithMeetings = TopAttendants.map((attendant) => {
    const totalMeetings = attendant.ClientName.length;
    return {
      ...attendant.toObject(), //* Convert Mongoose document to plain object
      totalMeetings, //* Add total meetings count to each attendant
    };
  });
  console.log(attendantsWithMeetings);
  return res.status(200).json(attendantsWithMeetings);
});
*/
/*
! Top Executive
export const Top_Executive = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  try {
    const startDate = calculateStartDate(interval);

    const allAttendants = await Attendant.find({
      updatedAt: { $gte: startDate },
    });

    const TopAttendants = allAttendants.sort(
      (a, b) => b.clientConversion - a.clientConversion
    );

    const attendantsWithFilteredMeetings = TopAttendants.map((attendant) => {
      const filteredMeetings = attendant.ClientName.filter((client) => {
        const meetingDate = new Date(client.updatedAt);
        return meetingDate >= startDate;
      });

      const totalMeetings = filteredMeetings.length;

      return {
        ...attendant.toObject(), //* Convert Mongoose document to plain object
        totalMeetings, //* Add total filtered meetings count to each attendant
      };
    });

    console.log(attendantsWithFilteredMeetings);
    return res.status(200).json(attendantsWithFilteredMeetings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
*/
// Top Executive TOP 3
export const Top_Executive = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  try {
    const startDate = calculateStartDate(interval);

    const allAttendants = await Attendant.find({
      updatedAt: { $gte: startDate },
    });

    // Sort attendants by client conversion in descending order
    const TopAttendants = allAttendants.sort(
      (a, b) => b.clientConversion - a.clientConversion
    );

    // Take the top 3 attendants
    const top3Attendants = TopAttendants.slice(0, 3);

    const attendantsWithFilteredMeetings = top3Attendants.map((attendant) => {
      const filteredMeetings = attendant.ClientName.filter((client) => {
        const meetingDate = new Date(client.updatedAt);
        return meetingDate >= startDate;
      });

      const totalMeetings = filteredMeetings.length;

      return {
        ...attendant.toObject(), //* Convert Mongoose document to plain object
        totalMeetings, //* Add total filtered meetings count to each attendant
      };
    });

    console.log(attendantsWithFilteredMeetings);
    return res.status(200).json(attendantsWithFilteredMeetings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Bar Diagram
/*
export const Bar = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  const startDate = calculateStartDate(interval);

  // Get the current date and set the start of the day at 8:00 AM
  const startOfDay = new Date();
  startOfDay.setHours(8, 0, 0, 0);

  // Set the end of the day at 6:00 PM
  const endOfDay = new Date();
  endOfDay.setHours(21, 0, 0, 0);

  const allCustomer = await Customer.find({
    updatedAt: { $gte: startDate },
  });

  // Create an array to store the count of customer updates per hour
  const hourlyCounts = new Array(13).fill(0); // For 13 hours from 8:00 AM to 8:00 PM

  // Calculate the start of the hour for each update within the specified time range
  allCustomer.forEach((customer) => {
    const customerUpdatedAt = new Date(customer.updatedAt);

    // Check if the update time is within the 8:00 AM to 8:00 PM range
    if (customerUpdatedAt >= startOfDay && customerUpdatedAt <= endOfDay) {
      const hourIndex = customerUpdatedAt.getHours() - 8; // Adjust index for 8:00 AM as 0
      if (hourIndex >= 0 && hourIndex < 13) {
        hourlyCounts[hourIndex]++;
      }
    }
  });

  res.json({
    data: hourlyCounts,
  });
});
*/
//! Bar Diagram
/*
export const Bar = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  const startDate = calculateStartDate(interval);

  // Get the current date and set the start of the day at 8:00 AM
  const startOfDay = new Date();
  startOfDay.setHours(8, 0, 0, 0);

  // Set the end of the day at 6:00 PM
  const endOfDay = new Date();
  endOfDay.setHours(21, 0, 0, 0);

  const allCustomer = await Customer.find({
    updatedAt: { $gte: startDate },
  });

  // Create an array to store the count of customer updates per hour
  const hourlyCounts = new Array(13).fill(0); // For 13 hours from 8:00 AM to 8:00 PM

  // Iterate over each customer
  allCustomer.forEach((customer) => {
    // Iterate over each log entry within the customer
    customer.log.forEach((logEntry) => {
      const logUpdatedAt = new Date(logEntry.updatedAt);

      // Check if the log entry update time is within the 8:00 AM to 8:00 PM range
      if (logUpdatedAt >= startOfDay && logUpdatedAt <= endOfDay) {
        const hourIndex = logUpdatedAt.getHours() - 8; // Adjust index for 8:00 AM as 0
        if (hourIndex >= 0 && hourIndex < 13) {
          hourlyCounts[hourIndex]++;
        }
      }
    });
  });

  res.json({
    data: hourlyCounts,
  });
});
*/

// Bar Diagram

// export const Bar = asyncHandler(async (req, res) => {
//   const { interval } = req.query;
//   const startDate = calculateStartDate(interval);

//   // Get the current date and set the start of the day at 8:00 AM
//   const startOfDay = new Date();
//   startOfDay.setHours(8, 0, 0, 0);

//   // Set the end of the day at 6:00 PM
//   const endOfDay = new Date();
//   endOfDay.setHours(21, 0, 0, 0);

//   const allCustomer = await Customer.find({
//     updatedAt: { $gte: startDate },
//   });

//   // Create an array to store the count of customer updates per hour
//   const hourlyCounts = new Array(13).fill(0); // For 13 hours from 8:00 AM to 8:00 PM

//   // Iterate over each customer
//   allCustomer.forEach((customer) => {
//     // Iterate over each log entry within the customer
//     customer.log.forEach((logEntry) => {
//       const logUpdatedAt = new Date(logEntry.updatedAt);

//       // Check if the log entry update time is within the 8:00 AM to 8:00 PM range
//       if (logUpdatedAt >= startOfDay && logUpdatedAt <= endOfDay) {
//         const hourIndex = logUpdatedAt.getHours() - 8; // Adjust index for 8:00 AM as 0
//         if (hourIndex >= 0 && hourIndex < 13) {
//           hourlyCounts[hourIndex]++;
//         }
//       }
//     });
//   });

//   // Save the hourly counts to the database
//   const newHourlyCount = new BarDiagram({
//     date: new Date(), // Set the date to the current date
//     counts: hourlyCounts, // Store the calculated hourly counts
//   });

//   let database = await newHourlyCount.save();
//   console.log(database);
//   res.json({
//     data: hourlyCounts,
//   });
// });
/* !!! 
export const Bar = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  const startDate = calculateStartDate(interval);

  // Get the current date and set the start of the day at 8:00 AM
  const startOfDay = new Date();
  startOfDay.setHours(8, 0, 0, 0);

  // Set the end of the day at 8:00 PM
  const endOfDay = new Date();
  endOfDay.setHours(20, 0, 0, 0);

  const allCustomer = await Customer.find({
    updatedAt: { $gte: startDate },
  });

  // Create an array to store the count of customer updates per hour
  const hourlyCounts = new Array(13).fill(0); // For 13 hours from 8:00 AM to 8:00 PM

  // Iterate over each customer
  allCustomer.forEach((customer) => {
    // Iterate over each log entry within the customer
    customer.log.forEach((logEntry) => {
      const logUpdatedAt = new Date(logEntry.updatedAt);
      console.log("Log entry updatedAt:", logUpdatedAt);

      // Check if the log entry update time is within the 8:00 AM to 8:00 PM range
      if (logUpdatedAt >= startOfDay && logUpdatedAt <= endOfDay) {
        const hourIndex = logUpdatedAt.getHours() - 8; // Adjust index for 8:00 AM as 0
        console.log("Hour index:", hourIndex);

        if (hourIndex >= 0 && hourIndex < 13) {
          hourlyCounts[hourIndex]++;
        }
      }
    });
  });

  // Get the current date without time to ensure only one record per day
  const currentDay = new Date();
  currentDay.setHours(0, 0, 0, 0);

  // Check if an entry already exists for today
  const existingEntry = await BarDiagram.findOne({ date: currentDay });

  if (existingEntry) {
    // Update the existing entry with the new counts
    existingEntry.counts = hourlyCounts;
    await existingEntry.save();
  } else {
    // Create a new entry if one doesn't exist
    const newHourlyCount = new BarDiagram({
      date: currentDay,
      counts: hourlyCounts,
    });
    await newHourlyCount.save();
  }

  res.json({
    data: hourlyCounts,
  });
});


*/
/*
export const Bar = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  const startDate = calculateStartDate(interval);

  // Get the current date and set the start of the day at 8:00 AM
  const startOfDay = new Date();
  startOfDay.setHours(8, 0, 0, 0);

  // Set the end of the day at 8:00 PM
  const endOfDay = new Date();
  endOfDay.setHours(20, 0, 0, 0);

  const allCustomer = await Customer.find({
    updatedAt: { $gte: startDate },
  });
  const allPartner = await Partner.find({
    updatedAt: { $gte: startDate },
  });

  // Create an array to store the count of updates per hour
  const hourlyCounts = new Array(13).fill(0); // For 13 hours from 8:00 AM to 8:00 PM

  // Process customer data
  allCustomer.forEach((customer) => {
    customer.log.forEach((logEntry) => {
      if (!logEntry.updatedAt) {
        console.warn("Missing updatedAt in log entry");
        return;
      }
      const logUpdatedAt = new Date(logEntry.updatedAt);
      console.log("Customer log entry updatedAt:", logUpdatedAt);

      if (logUpdatedAt >= startOfDay && logUpdatedAt <= endOfDay) {
        const hourIndex = logUpdatedAt.getHours() - 8;
        console.log("Hour index (Customer):", hourIndex);

        if (hourIndex >= 0 && hourIndex < 13) {
          hourlyCounts[hourIndex]++;
        }
      }
    });
  });

  // Process partner data
  allPartner.forEach((partner) => {
    if (Array.isArray(partner)) {
      partner.forEach((logEntry) => {
        if (!logEntry.updatedAt) {
          console.warn("Missing updatedAt in log entry");
          return;
        }
        const logUpdatedAt = new Date(logEntry.updatedAt);
        console.log("Partner log entry updatedAt:", logUpdatedAt);

        if (logUpdatedAt >= startOfDay && logUpdatedAt <= endOfDay) {
          const hourIndex = logUpdatedAt.getHours() - 8;
          console.log("Hour index (Partner):", hourIndex);

          if (hourIndex >= 0 && hourIndex < 13) {
            hourlyCounts[hourIndex]++;
          }
        }
      });
    } else {
      console.warn("Expected partner to be an array, but got:", partner);
    }
  });

  console.log("Hourly counts:", hourlyCounts);

  const currentDay = new Date();
  currentDay.setHours(0, 0, 0, 0);

  const existingEntry = await BarDiagram.findOne({ date: currentDay });

  if (existingEntry) {
    existingEntry.counts = hourlyCounts;
    await existingEntry.save();
  } else {
    const newHourlyCount = new BarDiagram({
      date: currentDay,
      counts: hourlyCounts,
    });
    await newHourlyCount.save();
  }

  res.json({
    data: hourlyCounts,
  });
});
*/

//20-08-2024
/* 
export const Bar = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  const startDate = calculateStartDate(interval);

  // Get the current date and set the start of the day at 8:00 AM
  const startOfDay = new Date();
  startOfDay.setHours(8, 0, 0, 0);

  // Set the end of the day at 8:00 PM
  const endOfDay = new Date();
  endOfDay.setHours(20, 0, 0, 0);

  // Fetch data
  const allCustomer = await Customer.find({ updatedAt: { $gte: startDate } });
  const allPartner = await Partner.find({ updatedAt: { $gte: startDate } });

  // Create an array to store the count of updates per hour
  const hourlyCounts = new Array(13).fill(0); // For 13 hours from 8:00 AM to 8:00 PM

  // Process customer data
  allCustomer.forEach((customer) => {
    customer.log.forEach((logEntry) => {
      if (!logEntry.updatedAt) {
        console.warn("Missing updatedAt in log entry");
        return;
      }
      const logUpdatedAt = new Date(logEntry.updatedAt);
      console.log("Customer log entry updatedAt:", logUpdatedAt);

      if (logUpdatedAt >= startOfDay && logUpdatedAt <= endOfDay) {
        const hourIndex = logUpdatedAt.getHours() - 8;
        console.log("Hour index (Customer):", hourIndex);

        if (hourIndex >= 0 && hourIndex < 13) {
          hourlyCounts[hourIndex]++;
        }
      }
    });
  });

  // Process partner data
  allPartner.forEach((partner) => {
    if (!partner.updatedAt) {
      console.warn("Missing updatedAt in partner entry");
      return;
    }
    const logUpdatedAt = new Date(partner.updatedAt);
    console.log("Partner entry updatedAt:", logUpdatedAt);

    if (logUpdatedAt >= startOfDay && logUpdatedAt <= endOfDay) {
      const hourIndex = logUpdatedAt.getHours() - 8;
      console.log("Hour index (Partner):", hourIndex);

      if (hourIndex >= 0 && hourIndex < 13) {
        hourlyCounts[hourIndex]++;
      }
    }
  });

  console.log("Hourly counts:", hourlyCounts);

  const currentDay = new Date();
  currentDay.setHours(0, 0, 0, 0);

  const existingEntry = await BarDiagram.findOne({ date: currentDay });

  if (existingEntry) {
    existingEntry.counts = hourlyCounts;
    await existingEntry.save();
  } else {
    const newHourlyCount = new BarDiagram({
      date: currentDay,
      counts: hourlyCounts,
    });
    await newHourlyCount.save();
  }

  res.json({
    data: hourlyCounts,
  });
});
*/

export const Bar = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  const startDate = calculateStartDate(interval);

  // Fetch data based on the interval start date
  const allCustomer = await Customer.find({ updatedAt: { $gte: startDate } });
  const allPartner = await Partner.find({ updatedAt: { $gte: startDate } });

  // Initialize an array to store the count of updates per interval
  const intervalCounts = new Array(13).fill(0); // Modify as needed for different intervals

  // Process customer data
  allCustomer.forEach((customer) => {
    customer.log.forEach((logEntry) => {
      if (!logEntry.updatedAt) {
        console.warn("Missing updatedAt in log entry");
        return;
      }
      const logUpdatedAt = new Date(logEntry.updatedAt);

      if (logUpdatedAt >= startDate) {
        const hourIndex = logUpdatedAt.getHours() - 8;

        if (hourIndex >= 0 && hourIndex < 13) {
          intervalCounts[hourIndex]++;
        }
      }
    });
  });

  // Process partner data
  allPartner.forEach((partner) => {
    if (!partner.updatedAt) {
      console.warn("Missing updatedAt in partner entry");
      return;
    }
    const logUpdatedAt = new Date(partner.updatedAt);

    if (logUpdatedAt >= startDate) {
      const hourIndex = logUpdatedAt.getHours() - 8;

      if (hourIndex >= 0 && hourIndex < 13) {
        intervalCounts[hourIndex]++;
      }
    }
  });

  console.log("Interval counts:", intervalCounts);

  // Save the aggregated data based on the interval
  const currentInterval = new Date();
  currentInterval.setHours(0, 0, 0, 0);

  const existingEntry = await BarDiagram.findOne({ date: currentInterval });

  if (existingEntry) {
    existingEntry.counts = intervalCounts;
    await existingEntry.save();
  } else {
    const newIntervalCount = new BarDiagram({
      date: currentInterval,
      counts: intervalCounts,
    });
    await newIntervalCount.save();
  }

  res.json({
    data: intervalCounts,
  });
});

// notes about

export const getNotes = async (req, res) => {
  try {
    const notes = await SalesNote.find().sort({ time: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const TOP3Team = asyncHandler(async (req, res) => {
  const { interval } = req.query; // Assuming interval might be used for filtering

  try {
    // Fetch all teams from the database
    const teams = await Team.find();

    // Create an array to store teams with their client count and conversion count
    const teamsWithClientStats = teams.map((team) => {
      let clientCount = 0;
      let conversionCount = 0;

      // Count clients and conversions for each team member
      team.teamMemberNames.forEach((member) => {
        // Increment client count by the length of the ClientName array
        clientCount += Array.isArray(member.ClientName)
          ? member.ClientName.length
          : 0;

        // Increment conversion count by the member's clientConversion value
        conversionCount += member.clientConversion || 0;
      });

      return {
        teamName: team.teamName,
        managerName: team.managerName,
        clientCount: clientCount,
        conversionCount: conversionCount,
      };
    });

    // Sort teams based on conversion count in descending order
    teamsWithClientStats.sort((a, b) => b.conversionCount - a.conversionCount);

    // Get the top 3 teams
    const top3Teams = teamsWithClientStats.slice(0, 3);

    // Send the top 3 teams as a response
    res.status(200).json(top3Teams);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// export const TOP3Team = asyncHandler(async (req, res) => {
//   const { interval } = req.query; // Assuming interval might be used for filtering

//   try {
//     // Fetch all teams from the database

//     const teams = await Team.find();

//     // Create an array to store teams with their client count and conversion count
//     const teamsWithClientStats = teams.map((team) => {
//       let clientCount = 0;
//       let conversionCount = 0;

//       // Count clients and conversions for each team member
//       team.teamMemberNames.forEach((member) => {
//         // Increment client count by the length of the ClientName array
//         clientCount += Array.isArray(member.ClientName)
//           ? member.ClientName.length
//           : 0;

//         // Increment conversion count by the member's clientConversion value
//         conversionCount += member.clientConversion || 0;
//       });

//       return {
//         teamName: team.teamName,
//         managerName: team.managerName,
//         clientCount: clientCount,
//         conversionCount: conversionCount,
//       };
//     });

//     // Sort teams based on conversion count in descending order
//     teamsWithClientStats.sort((a, b) => b.conversionCount - a.conversionCount);

//     // Get the top 3 teams
//     const top3Teams = teamsWithClientStats.slice(0, 3);

//     // Send the top 3 teams as a response
//     res.status(200).json(top3Teams);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// });

// export const TOP3Team = asyncHandler(async (req, res) => {
//   const { interval } = req.query;

//   try {
//     // Calculate the start date based on the interval
//     const startDate = calculateStartDate(interval);

//     // Fetch all teams updated within the specified interval
//     const allTeams = await Team.find({
//       updatedAt: { $gte: startDate },
//     });

//     // Sort teams by client conversion count in descending order
//     const sortedTeams = allTeams.sort(
//       (a, b) => b.clientConversion - a.clientConversion
//     );

//     // Take the top 3 teams
//     const top3Teams = sortedTeams.slice(0, 3);

//     // Add filtered meetings count to each team
//     const teamsWithFilteredMeetings = top3Teams.map((team) => {
//       const filteredMeetings = team.teamMemberNames.flatMap((member) => {
//         return Array.isArray(member.ClientName)
//           ? member.ClientName.filter((client) => {
//               const meetingDate = new Date(client.updatedAt);
//               return meetingDate >= startDate;
//             })
//           : [];
//       });

//       const totalMeetings = filteredMeetings.length;

//       return {
//         ...team.toObject(), // Convert Mongoose document to plain object
//         totalMeetings, // Add total filtered meetings count to each team
//       };
//     });

//     console.log(teamsWithFilteredMeetings);
//     return res.status(200).json(teamsWithFilteredMeetings);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// });
