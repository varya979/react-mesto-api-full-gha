const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar,
  getMyUser,
} = require('../controllers/users');

const {
  getUserValidation,
  updateUserProfileValidation,
  updateUserAvatarValidation,
} = require('../middlewares/celebrate-validation');

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getMyUser); // ставить строго до роута /users/:userId - иначе падает 400
userRouter.get('/users/:userId', getUserValidation, getUser);
userRouter.patch('/users/me', updateUserProfileValidation, updateUserProfile);
userRouter.patch('/users/me/avatar', updateUserAvatarValidation, updateUserAvatar);

module.exports = userRouter;
