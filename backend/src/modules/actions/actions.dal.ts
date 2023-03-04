import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import httpStatus from 'http-status';
import jsonfile from 'jsonfile';
import User from '../../api/v1/user/user.model';
import { ApiError } from '../error';
import { Action, ActionsData } from './actions.type';
import mongoose from 'mongoose';

const environment = process.env.NODE_ENV || 'development';
const actionsDataFile =
  environment === 'development' ||
  environment === 'test' ||
  environment === 'middlewareTest'
    ? `${__dirname}/data/actions.test.json`
    : `${__dirname}/data/actions.json`;

const getActions = async (): Promise<ActionsData> => {
  try {
    const actions = await jsonfile.readFile(actionsDataFile);
    return actions;
  } catch (error: any) {
    return { actions: [] };
  }
};

const getActionsByUserId = async (
  userId: string | mongoose.Types.ObjectId,
): Promise<ActionsData> => {
  try {
    const actions = await getActions();
    const userActions = actions.actions.filter(
      (action) => action.userId === userId,
    );
    return { actions: userActions };
  } catch (error: any) {
    return { actions: [] };
  }
};

const getUserLeftActions = async (
  userId: string | mongoose.Types.ObjectId,
): Promise<number> => {
  const usersActions = await getActionsByUserId(userId);
  const today = dayjs().format('YYYY-MM-DD');
  const userActionsToday = usersActions.actions.filter(
    (action) => action.date === today,
  );
  const user = await User.findOne({ _id: userId });
  if (userActionsToday.length === 0) {
    return user?.maxActions || 0;
  }

  const userMaxActions = usersActions.actions[0].userMaxActions;
  const userActionsLeft = userMaxActions - userActionsToday.length;
  return userActionsLeft;
};

const addAction = async (userId: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const userMaxActions = user.maxActions;
  const date = dayjs().format('YYYY-MM-DD');
  const id = uuidv4();
  const actionLeft = (await getUserLeftActions(userId)) - 1;
  const newAction: Action = { id, userId, userMaxActions, date, actionLeft };
  const actions = await getActions();

  // remove old actions from 7 days ago
  const sevenDaysAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
  const newActions = actions.actions.filter((action) =>
    dayjs(action.date).isAfter(sevenDaysAgo),
  );

  actions.actions = newActions;
  actions.actions.push(newAction);
  await jsonfile.writeFile(actionsDataFile, actions);
};

export { getActions, getActionsByUserId, getUserLeftActions, addAction };
