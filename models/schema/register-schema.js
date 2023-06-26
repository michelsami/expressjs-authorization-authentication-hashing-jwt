import { z } from 'zod';

const registerSchema = z.object({
  name : z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number().int().min(18),
});

export default registerSchema;