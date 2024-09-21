import Partner from "../Models/ChannelPartner.js";
import Customer from "../Models/customer.js";
import Project from "../Models/projectModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const ChequeImage = asyncHandler(async (req, res) => {
  const {
    name,
    mobile,
    projectName,
    customerId,
    customerName,
    customerMobileLastFour,
    partnerId,
  } = req.body;

  if (!req.files || !req.files?.chequeImage || !req.files?.chequeImage[0]) {
    return res.status(400).json({ message: "Cheque Image file is required" });
  }

  const chequeImageLocalPath = req.files.chequeImage[0].path;
  console.log(chequeImageLocalPath);
  // Upload the image to Cloudinary
  const chequeImageUpload = await uploadOnCloudinary(chequeImageLocalPath);
  console.log(chequeImageUpload);

  const findUserscustomer = await Customer.findOne({ customerId });
  const findUserspartner = await Partner.findOne({ partnerId });

  if (!findUserscustomer && !findUserspartner) {
    return res.status(404).json({ message: "Customer or Partner not found" });
  }

  let updatedChequeImage;

  if (findUserscustomer) {
    updatedChequeImage = await Customer.findByIdAndUpdate(
      findUserscustomer._id,
      {
        $set: {
          name,
          mobile,
          projectName,
          customerId: findUserscustomer.customerId,
        },
        $push: {
          chequeImage: {
            chequeImages: chequeImageUpload.url,
          },
        },
      },
      { new: true }
    );
  }

  if (findUserspartner) {
    updatedChequeImage = await Partner.findByIdAndUpdate(
      findUserspartner._id,
      {
        $set: {
          customerName,
          customerMobileLastFour,
          projectName,
          partnerId: findUserspartner.partnerId,
        },
        $push: {
          chequeImage: {
            chequeImages: chequeImageUpload.url,
          },
        },
      },
      { new: true }
    );
  }

  res.status(201).json(updatedChequeImage);
});

export const getChequeImages = asyncHandler(async (req, res) => {
  const { customerId, partnerId } = req.query;

  let user;
  if (customerId) {
    user = await Customer.findOne({ customerId });
  } else if (partnerId) {
    user = await Partner.findOne({ partnerId });
  }

  if (!user) {
    return res.status(404).json({ message: "Customer or Partner not found" });
  }

  res.status(200).json(user);
});

// GET Handler for all cheques
export const getAllCheques = asyncHandler(async (req, res) => {
  const customers = await Customer.find({})
    .select("chequeImage createdAt")
    .lean();
  const partners = await Partner.find({})
    .select("chequeImage createdAt")
    .lean();

  const allCheques = [
    ...customers.map((customer) => ({
      type: "customer",
      id: customer._id,
      chequeImage: customer.chequeImage,
      createdAt: customer.createdAt,
    })),
    ...partners.map((partner) => ({
      type: "partner",
      id: partner._id,
      chequeImage: partner.chequeImage,
      createdAt: partner.createdAt,
    })),
  ];

  // Sort by createdAt in descending order
  allCheques.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.status(200).json(allCheques);
});

export const getEntriesWithChequeImage = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const project = await Project.findOne({ name });
  if (!project) return res.json({ message: "Project not found" });

  try {
    // Find customers with non-empty chequeImage arrays
    const customersWithChequeImage = await Customer.find({
      chequeImage: { $exists: true, $not: { $size: 0 } },
    })
      .select("chequeImage createdAt name mobile projectName customerId")
      .lean();

    // Find partners with non-empty chequeImage arrays
    const partnersWithChequeImage = await Partner.find({
      chequeImage: { $exists: true, $not: { $size: 0 } },
    })
      .select(
        "chequeImage createdAt customerName customerMobileLastFour projectName partnerId"
      )
      .lean();

    // Combine and format results
    const entriesWithChequeImage = [
      ...customersWithChequeImage.map((customer) => ({
        type: "customer",
        id: customer._id,
        chequeImage: customer.chequeImage,
        createdAt: customer.createdAt,
        name: customer.name,
        mobile: customer.mobile,
        projectName: customer.projectName,
        customerId: customer.customerId,
      })),
      ...partnersWithChequeImage.map((partner) => ({
        type: "partner",
        id: partner._id,
        chequeImage: partner.chequeImage,
        createdAt: partner.createdAt,
        customerName: partner.customerName,
        customerMobileLastFour: partner.customerMobileLastFour,
        projectName: partner.projectName,
        partnerId: partner.partnerId,
      })),
    ];

    // Sort by createdAt in descending order
    entriesWithChequeImage.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const filteredEntries = entriesWithChequeImage.filter(
      (entry) => entry.projectName === name
    );
    // Send the response
    res.status(200).json(filteredEntries);
  } catch (error) {
    console.error("Error fetching entries with cheque images:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});
