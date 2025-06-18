import express from 'express';
import userRoutes from './user/userRoutes';
import contactRoutes from './contact/contactRoutes';

const router = express.Router();

// Mount sub-routes
router.use('/user', userRoutes);
router.use('/user/:userId/contact', contactRoutes);

export default router; 