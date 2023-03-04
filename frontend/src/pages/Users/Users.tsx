import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useGetAllUserActionsQuery } from '../../redux/api/actionsApiSlice';
import { api } from '../../redux/api/apiSlice';
import { useAppDispatch } from '../../redux/hooks';
import { allUserActionsDataItem } from '../../types/allUserActions.type';
import {
  StyledUsersContainer,
  StyledUsersTableContainer,
  StyledUsersTitle,
} from './Users.style';

export default function Users() {
  const { data: allUserActions, isLoading: isLoadingAllUserActions } =
    useGetAllUserActionsQuery();

  const dispatch = useAppDispatch();

  const [isCacheCleared, setIsCacheCleared] = useState(false);

  useEffect(() => {
    dispatch(api.util.invalidateTags(['Action']));
    setIsCacheCleared(true);
  }, [allUserActions]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'maxActions', headerName: 'Max Actions', width: 200 },
    { field: 'currentActions', headerName: 'Current Actions', width: 200 },
  ];

  const rows =
    allUserActions?.map((userAction: allUserActionsDataItem) => ({
      id: userAction.user._id,
      name: userAction.user.fullName,
      maxActions: userAction.user.maxActions,
      currentActions: userAction.userLeftActions,
    })) || [];
  if (isLoadingAllUserActions || !isCacheCleared) {
    return <LoadingSpinner />;
  }
  return (
    <StyledUsersContainer>
      <StyledUsersTitle>Users</StyledUsersTitle>
      <StyledUsersTableContainer style={{ width: '100%' }}>
        <DataGrid
          autoHeight={true}
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </StyledUsersTableContainer>
    </StyledUsersContainer>
  );
}
