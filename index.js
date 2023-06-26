import  express  from "express";
import dotenv from 'dotenv';
import { authRouter } from "./routes/auth-router.js";
import { productsRouter } from "./routes/products-router.js";


dotenv.config();
const port = process.env.PORT || 3000;

const app = express()
app.use(express.json());

app.use('/authentication', authRouter)
app.use('/products', productsRouter)



app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
  });