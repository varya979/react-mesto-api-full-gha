const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getMyUsersInfo,
} = require('../controllers/users');

const {
  userIdValidation,
  updateUserProfileValidation,
  updateUserAvatarValidation,
} = require('../middlewares/celebrate-validation');

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getMyUsersInfo); // ставить строго до роута /users/:userId - иначе падает 400
userRouter.get('/users/:userId', userIdValidation, getUserById);
userRouter.patch('/users/me', updateUserProfileValidation, updateUserProfile);
userRouter.patch('/users/me/avatar', updateUserAvatarValidation, updateUserAvatar);

module.exports = userRouter;
