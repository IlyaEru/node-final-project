import { Request, Response } from 'express';
import { getUserLeftActions } from '../../../modules/actions/actions.dal';
import User from '../user/user.model';

const getAllUsersLeftActions = async (req: Request, res: Response) => {
  const users = await User.find();
  const usersLeftActions = await Promise.all(
    users.map(async (user) => {
      const userLeftActions = await getUserLeftActions(user.id);

      return { user, userLeftActions };
    }),
  );

  res.json(usersLeftActions);
};

const getUsersLeftActions = async (req: Request, res: Response) => {
  const { id: userId } = req.params;
  const userActionsLeft = await getUserLeftActions(userId);
  res.json({ userActionsLeft });
};

export { getUsersLeftActions, getAllUsersLeftActions };
