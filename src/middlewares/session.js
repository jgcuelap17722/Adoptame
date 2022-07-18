import { verifyToken } from "../helpers/handleJwt.js";

//Middleware para cuando nos toque usar rutas protegidas para usuario normal y fundacion.
export const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) {
      return res.status(401).send({ Error: "User not authenticate" });
    }

    const token = authorization.split(" ").pop();

    const dataToken = await verifyToken(token);
  
    if (!dataToken) {
      return res.status(401).send({ Error: "TOKEN INVALID!!" });
    }
    next();
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};
