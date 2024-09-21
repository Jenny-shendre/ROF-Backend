

import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";



export function verifyTokenAndRole(role) {
    return (req, res, next) => {
        const header = req.get('Authorization');
        if (header) {
            const token = header.split(" ")[1];
            jwt.verify(token, "secret1234", (error, payload) => {
                if (error) {
                    return res.status(StatusCodes.UNAUTHORIZED).send({ message: "Invalid token" });
                } else if (payload.role !== role) {
                    return res.status(StatusCodes.FORBIDDEN).send({ message: "You do not have access to this resource" });
                } else {
                    next();
                }
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).send({ message: "Please login first" });
        }
    };
}



export const verifyToken = (req, res, next) => {
  const header = req.get("Authorization");

  if (!header) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication token required" });
  }

  const token = header.split(" ")[1]; // Extract token from "Bearer <token>"
  
  // Verify the token
  jwt.verify(token, "secret1234", (error, decoded) => {
    if (error) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid or expired token" });
    }
    
    // Attach user information from the decoded token to req.user
    req.user = decoded; 
    next();
  });
};
