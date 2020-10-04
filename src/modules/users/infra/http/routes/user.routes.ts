import { Router } from 'express';
import multer from 'multer';

import UsersController from '../controllers/UsersController';
import UpadateAvatarController from '../controllers/UpdateAvatarController';

import UploadConfig from '../../../../../config/upload';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(UploadConfig);

const usersControler = new UsersController();
const updateAvatarController = new UpadateAvatarController();

usersRouter.post('/', usersControler.create);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  updateAvatarController.update,
);

export default usersRouter;
