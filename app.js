import express from "express";
import cookieParser from "cookie-parser";
import partnerRouter from "./router/partnerRouter.js";
import customerRoutes from "./router/customerRoutes.js";
import channelRouter from "./router/channelRouter.js";
import cors from "cors";
import logger from "./Middlewares/logger.js";
import errorMiddleware from "./Middlewares/errorMiddleware.js";
import authRoutes from "./router/authRoutes.js";
import attendantRoutes from "./router/attendantRoutes.js";
import projectRoutes from "./router/projectRoutes.js";
import serviceRequest from "./router/serviceRequestRoutes.js";
import serviceRoutes from "./router/serviceRoutes.js";
import servicePersonRouter from "./router/servicePersonRouter.js";
import bodyParser from "body-parser";
import timeline from "./router/timesheet.routes.js";
import chequeImage from "./router/ChequeImage.js";
import salesManagerRouter from "./router/salesManagerRouter.js";
import teamRouter from "./router/teamRouter.js";
import clientManagement from "./router/clientManagementRoutes.js";
import adminRouter from "./router/adminRouter.js";
import teamMemberRouter from "./router/teamMemberRouter.js";
import recordRoute from "./router/recordRoute.js";
import editFormRoutes from "./router/editFormRoutes.js";
import salesRoutes from "./router/salesRoutes.js";
import detailsRouter from "./router/detailsRouter.js";
import settingsExecutiveRouter from "./router/settingsExecutive.js";
import settingsManagerRouter from "./router/settingsManager.js";
import settingsAdminRouter from "./router/settingsAdmin.js";
import overviewRouter from "./router/overviewRouter.js";
import managerRouter from "./router/managerRouter.js";
import ViewMembersRouter from "./router/ViewMembers.router.js";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(logger);
app.use(errorMiddleware);

app.use("/api/partners", partnerRouter);
app.use("/api/customers", customerRoutes);
app.use("/api/attendants", attendantRoutes);
app.use("/api/login", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/seviceRequest", serviceRequest);
app.use("/api/services", serviceRoutes);
app.use("/api/servicePerson", servicePersonRouter);
app.use("/api/timeSheet", timeline);
app.use("/api/channels", channelRouter);
app.use("/api/chequeImage", chequeImage);
app.use("/api/salesManager", salesManagerRouter);
app.use("/api/teams", teamRouter);
app.use("/api/clientManagement", clientManagement);
app.use("/api/admin", adminRouter);
app.use("/api/teamMember", teamMemberRouter);
app.use("/api/record", recordRoute);
app.use("/api/forms", editFormRoutes);
app.use("/api", salesRoutes);
app.use("/api/details", detailsRouter);
app.use("/api/settingsExecutive", settingsExecutiveRouter);
app.use("/api/settingsManager", settingsManagerRouter);
app.use("/api/settingsAdmin", settingsAdminRouter);
app.use("/api/overview", overviewRouter);
app.use("/api/manager", managerRouter);
app.use("/api/ViewMembers", ViewMembersRouter);

export { app };
