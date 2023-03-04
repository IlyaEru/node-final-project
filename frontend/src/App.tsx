import dayjs from 'dayjs';
import { useState } from 'react';
import axios from 'redaxios';
import AppRoutes from './AppRoutes';
import { useGetUserActionsQuery } from './redux/api/actionsApiSlice';
import {
  selectActions,
  selectToken,
  setActions,
} from './redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';

const decryptToken = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

const getUsersActionsLeft = async (userId: string) => {
  const { data } = await axios.get(
    `http://localhost:3000/api/v1/actions/${userId}`,
  );

  return data;
};

function App() {
  const token = useAppSelector(selectToken);
  const { actionsLeft } = useAppSelector(selectActions);
  const dispatch = useAppDispatch();

  // const [tokenSub, setTokenSub] = useState('');
  // const { data, isLoading } = useGetUserActionsQuery(tokenSub);

  const actionsDate = useAppSelector(selectActions);

  if (actionsDate.date !== dayjs().format('YYYY-MM-DD') || !actionsLeft) {
    if (token) {
      const { sub } = decryptToken(token);
      getUsersActionsLeft(sub).then((data) => {
        dispatch(setActions(data.userActionsLeft));
      });
    }
  }

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
