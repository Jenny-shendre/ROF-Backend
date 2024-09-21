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
