import registerSchema from "../models/schema/register-schema.js";
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { readFile, writeFile } from 'fs/promises';
import loginSchema from "../models/schema/login-schema.js";








export const registerValidation = (req, res, next)=>{

	

	try {
		const validatedData = registerSchema.parse(req.body);

	
		
	next()
	  } catch (error) {
		if (error instanceof z.ZodError) {
		  // Create a custom error message
		  const errorMessage = error.errors
			.map((err) => {
			  return {
				field: err.path.join('.'),
				message: err.message,
			  };
			});
	
		  // Throw the modified error message
		  res.status(400)
		  res.json(errorMessage)
		  throw errorMessage;
		} else {
		  // Rethrow any other type of error
		  throw error;
		}
	  }

}



export const addUserToLocalDatabase =  (filePath)=>async(req, res)=>{
	
	try {
		const { name, email, password, age } = req.body;

		const data = await readFile(filePath, {encoding: 'utf-8'});
		
		let parsedData = JSON.parse(data);

		let userInDatabase = parsedData.users.find( user => user.email === email)

		if(userInDatabase) return res.status(400).json("you have already an account please login")

		
		
		// Hash password

		
		const hashedPassword = await bcrypt.hash(password, 10);
	
		// Store data in database
		
		const token = jwt.sign({ name, email, age , roles:["products.read"]}, process.env.JWT_SECRET);
		
		const userData = { name, email, password: hashedPassword, age , token, roles:["products.read"]};
		// ...
		
		// Send a response back to the client
		
		res.send(`User ${name} registered successfully`);
		
		// Read data from file
		
		
		
		

		parsedData.users.push(userData);
		 
	const dataUpdated = await writeFile(filePath, JSON.stringify(parsedData));
		 
		console.log("user added to database")
	  } catch (err) {
		// Handle errors
		console.log(`unable to get all users data and add user to database : ${err}`);
		
	  }
	
}


export const loginValidation = (req, res, next)=>{

	

	try {
		const validatedData = loginSchema.parse(req.body);
		
		console.log(validatedData)
		next()
	  } catch (error) {
		if (error instanceof z.ZodError) {
		  // Create a custom error message
		  const errorMessage = error.errors
			.map((err) => {
			  return {
				field: err.path.join('.'),
				message: err.message,
			  };
			});
	
		  // Throw the modified error message
		  res.status(400)
		  res.json(errorMessage)
		  throw errorMessage;
		} else {
		  // Rethrow any other type of error
		  throw error;
		}
	  }

}

export const sendTokenToUser = (filePath)=>async(req, res)=>{
	const { name, email, password, age } = req.body;

	try{
		const data = await readFile(filePath, {encoding: 'utf-8'});
		
	let parsedData = JSON.parse(data);

	let userInDatabase = parsedData.users.find( user => user.email === email)

	if (userInDatabase) {

		console.log(password)
		console.log(userInDatabase.password)
		//user have an account so check pawwrord 
		bcrypt.compare(password, userInDatabase.password).then(isMatch => {
    if (isMatch) {
		return res.status(200).json({name : userInDatabase.name, email : userInDatabase.email,token : userInDatabase.token });
	
      
    } else {
		return res.status(400).json('password is not correct');
    }
  })
  .catch(err => console.error(err));

		  } else {
		return res.status(400).json('you don\'t have an account, please register and create an account');
	  }
	}catch(err){
		console.error(err);
		return res.status(500).send('Internal Server Error');
	}
	
}