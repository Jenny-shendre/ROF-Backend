import SalesManager from "../Models/salesManager.js";
import Team from "../Models/teamModel.js";
import Project from "../Models/projectModel.js";
import Attendant from "../Models/Attendant.js";
/*
export const createTeam = async (req, res) => {
  try {
    const { teamName, projectName, managerName, teamMemberName } = req.body;

    const updatedProject = await Project.findOneAndUpdate(
      { name: projectName },
      {
        $addToSet: {
          teams: teamName,
        },
      },
      { new: true }
    );

    const Attendants = await Promise.all(
      teamMemberName.map((memberName) => {
        return Attendant.findOneAndUpdate(
          { name: memberName },
          {
            $set: {
              project: projectName,
              team: teamName,
              managerName,
            },
          }
        );
      })
    );

    if (!Attendants) {
      console.error(
        "No attendants found for provided member names:",
        teamMemberName
      );
      return res.status(404).json({ message: "Attendant not found" });
    }

    console.log("Attendants updated:", Attendants);

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const salesManager = await SalesManager.findOne({ name: managerName });

    if (!salesManager) {
      return res.status(404).json({ message: "Sales Manager not found" });
    }

    const existingTeam = await Team.findOne({ teamName });

    if (existingTeam) {
      // Add the new team member names to the existing team's teamMemberNames array
      existingTeam.teamMemberNames = Array.from(
        new Set([...existingTeam.teamMemberNames, ...teamMemberName])
      );
      await existingTeam.save();
      return res.status(200).json(existingTeam);
    }

    const team = await Team.create({
      teamName,
      projectName,
      managerName,
      managerEmail: salesManager.email,
      teamMemberNames: teamMemberName,
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createTeam = async (req, res) => {
  try {
    const { teamName, projectName, managerName, teamMemberName } = req.body;

    // Validate input data
    if (
      !teamName ||
      !projectName ||
      !managerName ||
      !Array.isArray(teamMemberName)
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Update project with new team name
    const updatedProject = await Project.findOneAndUpdate(
      { name: projectName },
      { $addToSet: { teams: teamName } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update attendants with project and team information
    const attendants = await Promise.all(
      teamMemberName.map((memberName) =>
        Attendant.findOneAndUpdate(
          { name: memberName },
          {
            $set: {
              project: projectName,
              team: teamName,
              managerName,
            },
          },
          { new: true }
        )
      )
    );

    // Check if any attendants were not found
    if (attendants.includes(null)) {
      return res
        .status(404)
        .json({ message: "One or more attendants not found" });
    }

    console.log("Attendants updated:", attendants);

    // Find sales manager
    const salesManager = await SalesManager.findOne({ name: managerName });

    if (!salesManager) {
      return res.status(404).json({ message: "Sales Manager not found" });
    }

    // Check if the team already exists
    let existingTeam = await Team.findOne({ teamName });

    if (existingTeam) {
      // Add new team members to the existing team
      existingTeam.teamMemberNames = Array.from(
        new Set([...existingTeam.teamMemberNames, ...teamMemberName])
      );
      await existingTeam.save();
      return res.status(200).json(existingTeam);
    }
    console.log("existingTeam", existingTeam);
    console.log("attendants", attendants);
    // Create a new team
    const team = await Team.create({
      $set: {
        teamName,
        projectName,
        managerName,
        managerEmail: salesManager.email,
        teamMemberNames: attendants,
      },
      $push: {
        teamMemberNames: {
          name: attendants.name,
          employeeId: attendants.employeeId,
          email: attendants.email,
          teamName: teamName,
          projectName: projectName,
          managerName: managerName,
          ClientName: attendants.ClientName,
        },
      },
    });

    res.status(201).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
*/

export const createTeam = async (req, res) => {
  try {
    const { teamName, projectName, managerName, teamMemberName } = req.body;

    // Validate input data
    if (
      !teamName ||
      !projectName ||
      !managerName ||
      !Array.isArray(teamMemberName)
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Update project with new team name
    const updatedProject = await Project.findOneAndUpdate(
      { name: projectName },
      { $addToSet: { teams: teamName } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update attendants with project and team information
    const attendants = await Promise.all(
      teamMemberName.map((memberName) =>
        Attendant.findOneAndUpdate(
          { name: memberName },
          {
            $set: {
              project: projectName,
              team: teamName,
              managerName,
            },
          },
          { new: true }
        )
      )
    );

    // Check if any attendants were not found
    if (attendants.includes(null)) {
      return res
        .status(404)
        .json({ message: "One or more attendants not found" });
    }

    console.log("Attendants updated:", attendants);

    // Find sales manager
    const salesManager = await SalesManager.findOne({ name: managerName });

    if (!salesManager) {
      return res.status(404).json({ message: "Sales Manager not found" });
    }

    // Check if the team already exists
    let existingTeam = await Team.findOne({ teamName });

    if (existingTeam) {
      // Add new team members to the existing team
      existingTeam.teamMemberNames = Array.from(
        new Set([...existingTeam.teamMemberNames, ...teamMemberName])
      );
      await existingTeam.save();
      return res.status(200).json(existingTeam);
    }

    // Create a new team
    const team = new Team({
      teamName,
      projectName,
      managerName,
      managerEmail: salesManager.email,
      teamMemberNames: attendants.map((attendant) => ({
        name: attendant.name,
        employeeId: attendant.employeeId,
        email: attendant.email,
        teamName,
        projectName,
        managerName,
        ClientName: attendant.ClientName.length > 0 ? attendant.ClientName : [], // Ensure ClientName is not an empty array
      })),
    });

    await team.save();

    res.status(201).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// export const addonemember = async (req, res) => {
//   const { teamId, teamMemberName } = req.body;

//   console.log("teamMemberName", teamMemberName);
//   console.log("teamId", teamId);

//   if (!teamId || !teamMemberName) {
//     return res.status(400).json({ message: "Invalid input data" });
//   }

//   const teamData = await Team.findById(teamId);

//   // Update each attendant and collect the results
//   const attendants = await Promise.all(
//     teamMemberName.map(async (memberName) => {
//       const updatedAttendant = await Attendant.findOneAndUpdate(
//         { name: memberName },
//         {
//           $set: {
//             project: teamData.projectName,
//             team: teamData.teamName,
//             managerName: teamData.managerName,
//           },
//         },
//         { new: true }
//       );
//       if (!updatedAttendant) {
//         console.log(`No attendant found for ${memberName}`);
//       }
//       return updatedAttendant;
//     })
//   );

//   // Ensure there are valid attendants to push
//   const validAttendants = attendants.filter((attendant) => attendant);
//   if (validAttendants.length === 0) {
//     console.log("No valid attendants to add to team.");
//     return res
//       .status(404)
//       .json({ message: "No attendants found to add to the team" });
//   }

//   // Update the team with the new members
//   const teamUpdate = await Team.findOneAndUpdate(
//     { teamName: teamData.teamName },
//     {
//       $push: {
//         teamMemberNames: {
//           $each: validAttendants.map((attendant) => ({
//             name: attendant.name,
//             employeeId: attendant.employeeId,
//             email: attendant.email,
//             teamName: teamData.teamName,
//             projectName: teamData.projectName,
//             managerName: teamData.managerName,
//             ClientName:
//               attendant.ClientName.length > 0 ? attendant.ClientName : [], // Ensure ClientName is not an empty array
//           })),
//         },
//       },
//     },
//     { new: true }
//   );

//   if (!teamUpdate) {
//     console.log("No team found to update.");
//     return res.status(404).json({ message: "Team not found" });
//   }

//   return res.status(200).json(teamUpdate);
// };

export const addonemember = async (req, res) => {
  const { teamId, teamMemberName } = req.body;

  try {
    console.log("teamMemberName", teamMemberName);
    console.log("teamId", teamId);

    if (!teamId) {
      return res.status(400).json({ message: "Invalid input data teamId" });
    }
    if (!teamMemberName) {
      return res
        .status(400)
        .json({ message: "Invalid input data teamMemberName" });
    }

    const teamData = await Team.findById(teamId);
    if (!teamData) {
      console.log("Team not found.");
      return res.status(404).json({ message: "Team not found" });
    }

    const attendants = await Promise.all(
      teamMemberName.map(async (memberName) => {
        const updatedAttendant = await Attendant.findOneAndUpdate(
          { name: memberName },
          {
            $set: {
              project: teamData.projectName,
              team: teamData.teamName,
              managerName: teamData.managerName,
            },
          },
          { new: true }
        );
        if (!updatedAttendant) {
          console.log(`No attendant found for ${memberName}`);
        }
        return updatedAttendant;
      })
    );

    const validAttendants = attendants.filter((attendant) => attendant);
    if (validAttendants.length === 0) {
      console.log("No valid attendants to add.");
      return res
        .status(404)
        .json({ message: "No attendants found to add to the team" });
    }

    const teamUpdate = await Team.findByIdAndUpdate(
      teamId,
      {
        $push: {
          teamMemberNames: {
            $each: validAttendants.map((attendant) => ({
              name: attendant.name,
              employeeId: attendant.employeeId,
              email: attendant.email,
              clientConversion: attendant.clientConversion,
              teamName: teamData.teamName,
              projectName: teamData.projectName,
              managerName: teamData.managerName,
              ClientName:
                attendant.ClientName.length > 0 ? attendant.ClientName : [], // Ensure ClientName is not an empty array
            })),
          },
        },
      },
      { new: true }
    );

    if (!teamUpdate) {
      console.log("Failed to update team.");
      return res.status(500).json({ message: "Failed to update team" });
    }

    return res.status(200).json(teamUpdate);
  } catch (error) {
    res.status(200).json({ message: `Failed to update team ${error}` });
  }
};

export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamsById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeams = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true }
    );
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeams = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json({ message: "Team deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const teamfliter = async (req, res) => {
  const { teamName } = req.body;
  try {
    const fliterdata = await Team.findOne({ teamName: teamName });
    if (!fliterdata) {
      return res.status(404).json({ message: "Team not found" });
    }
    return res.status(200).json(fliterdata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
export const updateSalesManagerTeam = async (req, res) => {
  const { id } = req.params;
  const { managerName, teamName } = req.body;
  try {
    const AllDataInTeam = await Team.findByIdAndUpdate(
      id,
      {
        managerName,
        $set: {
          teamMemberNames: {
            $each: validAttendants.map((attendant) => ({
              managerName,
            })),
          },
        },
      },
      { new: true }
    );
    console.log("AllDataInTeam", AllDataInTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSalesManagerTeam = async (req, res) => {
  const { id } = req.params;
  const { managerName } = req.body;
  try {
    // Find the team document by ID
    const team = await Team.findById(id);
    console.log("team", team);
    if (!team) {
      console.log("team not found", team);
      return res.status(404).json({ message: "Team not found" });
    }
    console.log("team out", team);

    const updatePromises = team.teamMemberNames.map(async (memberId) => {
      return teamMemberNames.updateOne(
        { _id: memberId },
        { $set: { managerName } }
      );
    });
    await Promise.all(updatePromises);
    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      { managerName },
      { new: true }
    );
    

    console.log("UpdatedTeam", updatedTeam);
    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/

export const updateSalesManagerTeam = async (req, res) => {
  const { id } = req.params;
  let { managerName } = req.body;
  managerName = Array.isArray(managerName) ? managerName[0] : managerName;
  try {
    // Find the team document by ID
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Update managerName for each team member in the team
    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      {
        $set: {
          managerName,
          "teamMemberNames.$[].managerName": managerName, // Update managerName for all team members
        },
      },
      { new: true }
    );

    console.log("UpdatedTeam", updatedTeam);
    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeamMember = async (req, res) => {
  const { teamId, memberId } = req.params;

  try {
    if (!teamId || !memberId) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    // Find the team document and remove the specific member from the teamMemberNames array
    const result = await Team.findOneAndUpdate(
      { _id: teamId },
      {
        $pull: { teamMemberNames: { _id: memberId } },
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Team or team member not found" });
    }

    return res
      .status(200)
      .json({ message: "Team member deleted successfully", team: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
