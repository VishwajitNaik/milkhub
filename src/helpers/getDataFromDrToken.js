import Jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
    try {
        const token = request.cookies.get("docterToken")?.value || '';
        const decodedToken = Jwt.verify(token, process.env.DOCTER_TOKEN_SECRETE);
        return decodedToken.id;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}