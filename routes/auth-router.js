import  express  from "express";

export const authRouter = express.Router();
import { addUserToLocalDatabase , loginValidation, registerValidation, sendTokenToUser } from "../controllers/auth-controllers.js";






authRouter.post('/register', registerValidation, addUserToLocalDatabase('./database/users.json'))
authRouter.post('/login', loginValidation, sendTokenToUser('./database/users.json'))

