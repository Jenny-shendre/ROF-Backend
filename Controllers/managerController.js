import Team from "../Models/teamModel.js";

export const getTeamsByManagerEmail = async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: "Invalid manager email" });
  }

  console.log(`Received request to get teams for manager: ${email}`);

  try {
    // Log the regex pattern that will be used for the search
    const regexPattern = new RegExp(`^${email.trim()}$`, 'i');
    console.log(`Searching for teams with managerEmail: ${regexPattern}`);

    // Use a case-insensitive search for managerEmail
    const teams = await Team.find({
      managerEmail: { $regex: regexPattern }
    });

    console.log(`Query Result: ${JSON.stringify(teams)}`);

    if (teams.length === 0) {
      return res.status(404).json({ message: "No teams found for this manager" });
    }

    const teamsWithMembers = teams.map((team) => ({
      teamName: team.teamName,
      projectName: team.projectName,
      managerName: team.managerName,
      managerEmail: team.managerEmail,
      members: team.teamMemberNames.map((member) => ({
        name: member.name,
        employeeId: member.employeeId,
        teamName: member.teamName,
        email: member.email,
        projectName: member.projectName,
        managerName: member.managerName,
        ClientName: member.ClientName,
      })),
    }));

    // Sort teams by teamName
    teamsWithMembers.sort((a, b) => a.teamName.localeCompare(b.teamName));

    res.status(200).json(teamsWithMembers);
  } catch (error) {
    console.error(`Error fetching teams for manager: ${email}`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// export const getTeamsByManagerName = async (req, res) => {
//   const { name } = req.body;

//   if (!name || typeof name !== 'string') {
//     return res.status(400).json({ message: "Invalid manager name" });
//   }

//   console.log(`Received request to get teams for manager: ${name}`);

//   try {
//     // Log the regex pattern that will be used for the search
//     const regexPattern = new RegExp(`^${name.trim()}$`, 'i');
//     console.log(`Searching for teams with managerName: ${regexPattern}`);

//     // Use a case-insensitive search for managerName
//     const teams = await Team.find({
//       managerName: { $regex: regexPattern }
//     });

//     console.log(`Query Result: ${JSON.stringify(teams)}`);

//     if (teams.length === 0) {
//       return res.status(404).json({ message: "No teams found for this manager" });
//     }

//     const teamsWithMembers = teams.map((team) => ({
//       teamName: team.teamName,
//       projectName: team.projectName,
//       managerName: team.managerName,
//       members: team.teamMemberNames.map((member) => ({
//         name: member.name,
//         employeeId: member.employeeId,
//         teamName: member.teamName,
//         email: member.email, 
//         projectName: member.projectName,
//         managerName: member.managerName,
//         ClientName: member.ClientName,
//       })),
//     }));

//     // Sort teams by teamName
//     teamsWithMembers.sort((a, b) => a.teamName.localeCompare(b.teamName));

//     res.status(200).json(teamsWithMembers);
//   } catch (error) {
//     console.error(`Error fetching teams for manager: ${name}`, error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// export const getTeamsByManagerName = async (req, res) => {
//   const { name } = req.params;

//   if (!name || typeof name !== 'string') {
//     return res.status(400).json({ message: "Invalid manager name" });
//   }

//   console.log(`Received request to get teams for manager: ${name}`);

//   try {
//     // Log the regex pattern that will be used for the search
//     const regexPattern = new RegExp(`^${name.trim()}$`, 'i');
//     console.log(`Searching for teams with managerName: ${regexPattern}`);

//     // Use a case-insensitive search for managerName
//     const teams = await Team.find({
//       managerName: { $regex: regexPattern }
//     });

//     console.log(`Query Result: ${JSON.stringify(teams)}`);

//     if (teams.length === 0) {
//       return res.status(404).json({ message: "No teams found for this manager" });
//     }

//     const teamsWithMembers = teams.map((team) => ({
//       teamName: team.teamName,
//       projectName: team.projectName,
//       managerName: team.managerName,
//       members: team.teamMemberNames.map((member) => ({
//         name: member.name,
//         employeeId: member.employeeId,
//         teamName: member.teamName,
//         email: member.email, 
//         projectName: member.projectName,
//         managerName: member.managerName,
//         ClientName: member.ClientName,
//       })),
//     }));

//     // Sort teams by teamName
//     teamsWithMembers.sort((a, b) => a.teamName.localeCompare(b.teamName));

//     res.status(200).json(teamsWithMembers);
//   } catch (error) {
//     console.error(`Error fetching teams for manager: ${name}`, error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();

    if (teams.length === 0) {
      return res.status(404).json({ message: "No teams found" });
    }

    const teamsWithMembers = teams.map((team) => ({
      teamName: team.teamName,
      projectName: team.projectName,
      managerName: team.managerName,
      members: team.teamMemberNames.map((member) => ({
        name: member.name,
        employeeId: member.employeeId,
        teamName: member.teamName,
        emailID: member.email,  // Use 'email' to match the schema field
        projectName: member.projectName,
        managerName: member.managerName,
        ClientName: member.ClientName,
      })),
    }));

    res.status(200).json(teamsWithMembers);
  } catch (error) {
    console.error('Error fetching all teams:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};
