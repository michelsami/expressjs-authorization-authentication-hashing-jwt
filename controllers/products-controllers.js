
import { readFile } from 'fs/promises';
import jwt from 'jsonwebtoken';


export const getProducts = (filePath)=>async(req, res )=>{

	const data = await readFile(filePath, {encoding: 'utf-8'});
		
	let parsedData = JSON.parse(data);

	res.status(200)
	res.send(parsedData)
}

export const getProduct = (filePath)=>async(req, res )=>{

	const data = await readFile(filePath, {encoding: 'utf-8'});
		
	let parsedData = JSON.parse(data);

	const id = req.params.id; // Get ID from URL parameter
	const product = parsedData.find(p => p.id === parseInt(id)); // Search for product with matching ID
	if (!product) {
	  // If product is not found, return a 404 error
	  return res.status(404).send('Product not found');
	}

	
	res.json(product)
}



export const verifyToken =(filePath)=> async (req, res, next) => {
	const [_, token] = req.headers.authorization?.split(" ")

	
	if (!token) {
	  return res.status(401).json({ message: 'No token provided' });
	}
	try {
	
		const data = await readFile(filePath, {encoding: 'utf-8'});
		
		let parsedData = JSON.parse(data);
		
		const decoded = await jwt.verify(token, process.env.JWT_SECRET);
		const userExists = parsedData.users.find(user => user.email === decoded.email);
		// Search for product with matching ID
		
		if(!userExists) return res.status(400).json("you have to create an account to see this page") 
		const userAuthorization = userExists.roles.includes("products.amend");
		
		if(!userAuthorization)  return res.status(400).json("you are not authorized to see this page")  
	  
	
	  next();
	} catch (err) {
		console.log(err)
	  return res.status(401).json({ message: 'Invalid token' });
	}
  };