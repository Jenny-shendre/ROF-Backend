import Attendant from "../Models/Attendant.js";
import Partner from "../Models/ChannelPartner.js";
import Customer from "../Models/customer.js";
import asyncHandler from "../utils/asyncHandler.js";
/*
const parseTimeString = (timeString) => {
  // Assuming the format is "30 Jul | 05:57 PM"
  const [datePart, timePart] = timeString.split(" | ");
  const [day, month] = datePart.split(" ");
  const [hour, minute] = timePart.split(":");
  const isPM = timePart.includes("PM");

  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  let hour24 = parseInt(hour, 10);
  if (isPM && hour24 !== 12) hour24 += 12;
  if (!isPM && hour24 === 12) hour24 = 0;

  return new Date(
    new Date().getFullYear(),
    monthMap[month],
    parseInt(day, 10),
    hour24,
    parseInt(minute, 10)
  );
};
*/
const parseTimeString = (timeString) => {
  if (typeof timeString !== "string") {
    throw new TypeError(`Expected a string but received ${typeof timeString}`);
  }

  // Assuming the format is "30 Jul | 05:57 PM"
  const parts = timeString.split(" | ");
  if (parts.length !== 2) {
    throw new Error(
      "Invalid timeString format. Expected format: '30 Jul | 05:57 PM'"
    );
  }

  const [datePart, timePart] = parts;
  const [day, month] = datePart.split(" ");
  const [hour, minute] = timePart.split(":");
  const isPM = timePart.includes("PM");

  if (!day || !month || !hour || !minute) {
    throw new Error("Incomplete timeString components");
  }

  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  if (!(month in monthMap)) {
    throw new Error(`Invalid month: ${month}`);
  }

  let hour24 = parseInt(hour, 10);
  if (isPM && hour24 !== 12) hour24 += 12;
  if (!isPM && hour24 === 12) hour24 = 0;

  return new Date(
    new Date().getFullYear(),
    monthMap[month],
    parseInt(day, 10),
    hour24,
    parseInt(minute, 10)
  );
};

const TimeCalcul = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { StartTime, EndTime } = req.body;

  if (!StartTime || !EndTime) {
    return res
      .status(400)
      .json({ error: "StartTime and EndTime are required" });
  }

  const customer =
    (await Customer.findOne({ customerId: customerId })) ||
    (await Partner.findOne({ partnerId: customerId }));

  console.log("customer", customer);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const InTime = customer.createdAt;
  const attendantId = customer.attendant._id;
  const attendantData = await Attendant.findById(attendantId);
  if (!attendantData) {
    return res.status(404).json({ error: "Attendant not found" });
  }
  const OutTime = attendantData.updatedAt;

  const calculateTimeDifference = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);

    // return `${diffHrs}:${diffMins}`;
    const paddedHrs = String(diffHrs).padStart(2, "0");
    const paddedMins = String(diffMins).padStart(2, "0");
    return `${paddedHrs}:${paddedMins}`;
  };

  try {
    const startDate = parseTimeString(StartTime);
    const endDate = parseTimeString(EndTime);

    const timeDuration = calculateTimeDifference(startDate, endDate);
    console.log("Time difference", typeof timeDuration);
    const customerUpdate =
      (await Customer.findByIdAndUpdate(
        customer._id,
        {
          timeDuration,
        },
        { new: true }
      )) ||
      (await Partner.findByIdAndUpdate(
        customer._id,
        {
          timeDuration,
        },
        { new: true }
      ));

    await Attendant.findOneAndUpdate(
      {
        _id: attendantId, // The Attendant's ID
        "ClientName.ClientId": customerId, // Match the specific client inside the ClientName array
      },
      {
        $set: { "ClientName.$.timeDuration": timeDuration }, // Update the timeDuration for the matched client
      },
      { new: true } // Return the updated document
    );

    res.status(200).json(customerUpdate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/*
const timeResponse = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { EndTime } = req.body;

  const customer =
    (await Customer.findOne({ customerId: customerId })) ||
    (await Partner.findOne({ partnerId: customerId }));

  console.log("customer", customer);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const InTime = customer.createdAt;
  const attendantId = customer.attendant._id;
  const attendantData = await Attendant.findById(attendantId);
  if (!attendantData) {
    return res.status(404).json({ error: "Attendant not found" });
  }
  const OutTime = attendantData.updatedAt;

  const calculateTimeDifference = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);

    // return `${diffHrs}:${diffMins}`;
    const paddedHrs = String(diffHrs).padStart(2, "0");
    const paddedMins = String(diffMins).padStart(2, "0");
    return `${paddedHrs}:${paddedMins}`;
  };

  try {
    const timeResponse = calculateTimeDifference(InTime, EndTime);
    console.log("Time difference", typeof timeDuration);
    const customerUpdate =
      (await Customer.findByIdAndUpdate(
        customer._id,
        {
          timeResponse,
        },
        { new: true }
      )) ||
      (await Partner.findByIdAndUpdate(
        customer._id,
        {
          timeResponse,
        },
        { new: true }
      ));

    res.status(200).json(customerUpdate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
*/
/*
const convertToDateTimeString = (timeString) => {
  // Assuming the timeString is in "HH:mm" format
  const [hours, minutes] = timeString.split(":").map(Number);
  const now = new Date(); // Current date and time
  // Create a new Date object with the current date and provided time
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );
};

const timeResponse = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { EndTime } = req.body;

  const customer =
    (await Customer.findOne({ customerId: customerId })) ||
    (await Partner.findOne({ partnerId: customerId }));

  console.log("customer", customer);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const InTime = new Date(customer.createdAt);
  const attendantId = customer.attendant._id;
  const attendantData = await Attendant.findById(attendantId);
  if (!attendantData) {
    return res.status(404).json({ error: "Attendant not found" });
  }
  const OutTime = new Date(attendantData.updatedAt);

  const calculateTimeDifference = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Invalid date";
    }

    const diffMs = end - start;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);

    const paddedHrs = String(diffHrs).padStart(2, "0");
    const paddedMins = String(diffMins).padStart(2, "0");
    return `${paddedHrs}:${paddedMins}`;
  };

  try {
    // Convert EndTime to a Date object
    const EndTimeDate = convertToDateTimeString(EndTime);
    // Calculate time difference using ISO strings
    const timeResponse = calculateTimeDifference(InTime, EndTimeDate);
    console.log(`Calculating time difference endTime`, InTime, EndTimeDate);
    console.log("Time difference", timeResponse);

    const customerUpdate =
      (await Customer.findByIdAndUpdate(
        customer._id,
        { timeResponse },
        { new: true }
      )) ||
      (await Partner.findByIdAndUpdate(
        customer._id,
        { timeResponse },
        { new: true }
      ));

    res.status(200).json(customerUpdate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
*/

// const timeResponse = asyncHandler(async (req, res) => {
//   const { customerId } = req.params;
//   const { StartTime, EndTime } = req.body;

//   if (!StartTime || !EndTime) {
//     return res
//       .status(400)
//       .json({ error: "StartTime and EndTime are required" });
//   }

//   const customer =
//     (await Customer.findOne({ customerId: customerId })) ||
//     (await Partner.findOne({ partnerId: customerId }));

//   console.log("customer", customer);
//   if (!customer) {
//     return res.status(404).json({ error: "Customer not found" });
//   }

//   const InTime = customer.createdAt;
//   const attendantId = customer.attendant._id;
//   const attendantData = await Attendant.findById(attendantId);
//   if (!attendantData) {
//     return res.status(404).json({ error: "Attendant not found" });
//   }
//   const OutTime = attendantData.updatedAt;

//   const calculateTimeDifference = (startTime, endTime) => {
//     const start = new Date(startTime);
//     const end = new Date(endTime);
//     const diffMs = end - start;
//     const diffHrs = Math.floor(diffMs / 3600000);
//     const diffMins = Math.floor((diffMs % 3600000) / 60000);

//     // return `${diffHrs}:${diffMins}`;
//     const paddedHrs = String(diffHrs).padStart(2, "0");
//     const paddedMins = String(diffMins).padStart(2, "0");
//     return `${paddedHrs}:${paddedMins}`;
//   };

//   try {
//     const startDate = parseTimeString(StartTime);
//     const endDate = parseTimeString(EndTime);

//     const timeResponse = calculateTimeDifference(startDate, endDate);
//     console.log("Time difference", typeof timeDuration);
//     const customerUpdate =
//       (await Customer.findByIdAndUpdate(
//         customer._id,
//         {
//           timeResponse,
//         },
//         { new: true }
//       )) ||
//       (await Partner.findByIdAndUpdate(
//         customer._id,
//         {
//           timeResponse,
//         },
//         { new: true }
//       ));

//     res.status(200).json(customerUpdate);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
// const timeResponse = asyncHandler(async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const { StartTime, EndTime } = req.body;

//     if (!StartTime || !EndTime) {
//       return res
//         .status(400)
//         .json({ error: "StartTime and EndTime are required" });
//     }

//     const customer =
//       (await Customer.findOne({ customerId: customerId })) ||
//       (await Partner.findOne({ partnerId: customerId }));

//     if (!customer) {
//       return res.status(404).json({ error: "Customer not found" });
//     }

//     const InTime = customer.createdAt;
//     const attendantId = customer.attendant._id;
//     const attendantData = await Attendant.findById(attendantId);
//     if (!attendantData) {
//       return res.status(404).json({ error: "Attendant not found" });
//     }
//     const OutTime = attendantData.updatedAt;

//     // Function to convert time strings to seconds
//     function timeStringToSeconds(timeString) {
//       const [hours, minutes, seconds] = timeString.split(":").map(Number);
//       return hours * 3600 + minutes * 60 + seconds;
//     }

//     // Convert time strings to seconds
//     const timeInSecondsStart = timeStringToSeconds(StartTime);
//     const timeInSecondsEnd = timeStringToSeconds(EndTime);

//     // Calculate the difference in seconds
//     const differenceInSeconds = timeInSecondsEnd - timeInSecondsStart;

//     // Convert the difference back to minutes and seconds
//     const differenceMinutes = Math.floor(differenceInSeconds / 60);
//     const differenceSeconds = differenceInSeconds % 60;

//     const timeResponses = `${differenceMinutes}:${differenceSeconds
//       .toString()
//       .padStart(2, "0")}`;

//     console.log("Time difference", timeResponses);

//     // Update the customer or partner with the calculated timeResponse
//     const customerUpdate =
//       (await Customer.findByIdAndUpdate(
//         customer._id,
//         {
//           timeResponse: timeResponses,
//         },
//         { new: true }
//       )) ||
//       (await Partner.findByIdAndUpdate(
//         customer._id,
//         {
//           timeResponse: timeResponses,
//         },
//         { new: true }
//       ));

//     res.status(200).json(customerUpdate);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

const timeResponse = asyncHandler(async (req, res) => {
  try {
    const { customerId } = req.params;
    const { StartTime, EndTime } = req.body;

    if (!StartTime || !EndTime) {
      return res
        .status(400)
        .json({ error: "StartTime and EndTime are required" });
    }

    const customer =
      (await Customer.findOne({ customerId: customerId })) ||
      (await Partner.findOne({ partnerId: customerId }));

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const InTime = customer.createdAt;
    const attendantId = customer.attendant._id;
    const attendantData = await Attendant.findById(attendantId);
    if (!attendantData) {
      return res.status(404).json({ error: "Attendant not found" });
    }
    const OutTime = attendantData.updatedAt;

    // Function to convert MM:SS time strings to seconds
    function timeStringToSeconds(timeString) {
      const [minutes, seconds] = timeString.split(":").map(Number);
      return minutes * 60 + seconds; // Convert total time to seconds
    }

    // Convert time strings to seconds
    const timeInSecondsStart = timeStringToSeconds(StartTime);
    const timeInSecondsEnd = timeStringToSeconds(EndTime);

    // Calculate the difference in seconds
    const differenceInSeconds = timeInSecondsEnd - timeInSecondsStart;

    // Convert the difference back to minutes and seconds
    const differenceMinutes = Math.floor(differenceInSeconds / 60);
    const differenceSeconds = differenceInSeconds % 60;

    // Check for NaN values
    let timeResponses;
    if (isNaN(differenceMinutes) || isNaN(differenceSeconds)) {
      timeResponses = "NaN:NaN";
    } else {
      const paddedMinutes = String(differenceMinutes).padStart(2, "0");
      const paddedSeconds = String(differenceSeconds).padStart(2, "0");

      timeResponses = `${paddedMinutes}:${paddedSeconds}`;
    }

    console.log("Time difference", timeResponses);

    // Update the customer or partner with the calculated timeResponse
    const customerUpdate =
      (await Customer.findByIdAndUpdate(
        customer._id,
        {
          timeResponse: timeResponses,
        },
        { new: true }
      )) ||
      (await Partner.findByIdAndUpdate(
        customer._id,
        {
          timeResponse: timeResponses,
        },
        { new: true }
      ));

    res.status(200).json(customerUpdate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export { TimeCalcul, timeResponse };
