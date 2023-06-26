import  express  from "express";
import { getProduct, getProducts, verifyToken } from "../controllers/products-controllers.js";

export const productsRouter = express.Router();


productsRouter.get('/', getProducts('./database/products.json'))
productsRouter.get('/:id', verifyToken('./database/users.json'), getProduct('./database/products.json'))