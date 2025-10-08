import { Router } from 'express';
import { signup, login } from '../controllers/userController';
import { validateSignup, validateLogin } from '../middlewares/userValidation';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
// router.post('/invite', ...); // For admin invite registration (to be implemented)

export default router;