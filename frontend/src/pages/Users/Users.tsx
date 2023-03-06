import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useGetAllUserActionsQuery } from '../../redux/api/actionsApiSlice';
import { api } from '../../redux/api/apiSlice';
import { useAppDispatch } from '../../redux/hooks';
import { StyledScrollableContainer } from '../../style/globalStyle';
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
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      renderCell: (params: any) => (
        <StyledScrollableContainer>{params.value}</StyledScrollableContainer>
      ),
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'maxActions', headerName: 'Max Actions', flex: 1 },
    { field: 'currentActions', headerName: 'Current Actions', flex: 1 },
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
          disableSelectionOnClick={true}
        />
      </StyledUsersTableContainer>
    </StyledUsersContainer>
  );
}
