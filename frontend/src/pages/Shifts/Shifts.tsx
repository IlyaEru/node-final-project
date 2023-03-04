import { useState } from 'react';
import EditShiftForm from '../../components/EditShiftForm/EditShiftForm';
import NewShiftForm from '../../components/NewShiftForm';
import ShiftsTable from '../../components/ShiftsTable';
import {
  StyledNewShiftButton,
  StyledNewShiftCancelButton,
  StyledShiftsContainer,
  StyledShiftsTitle,
} from './Shifts.style';

export default function Shifts() {
  const [isCreatingNewShift, setIsCreatingNewShift] = useState(false);
  const [isEditingShift, setIsEditingShift] = useState(false);
  const [editedShift, setEditedShift] = useState('');

  const handleEditShift = (shiftId: string) => {
    if (isEditingShift) {
      return;
    }

    setIsEditingShift(true);
    setEditedShift(shiftId);
  };

  return (
    <StyledShiftsContainer>
      <StyledShiftsTitle>Shifts</StyledShiftsTitle>
      <ShiftsTable handleEditShift={handleEditShift} />
      {isEditingShift && (
        <EditShiftForm
          shiftId={editedShift}
          handleEditShiftCancel={() => setIsEditingShift(false)}
        />
      )}
      {isCreatingNewShift ? (
        <StyledNewShiftCancelButton
          onClick={() => {
            setIsCreatingNewShift(false);
          }}
        >
          Cancel
        </StyledNewShiftCancelButton>
      ) : (
        <StyledNewShiftButton
          onClick={() => {
            setIsCreatingNewShift(true);
          }}
        >
          Create new shift
        </StyledNewShiftButton>
      )}

      {isCreatingNewShift && (
        <NewShiftForm
          handleNewShiftCancel={() => setIsCreatingNewShift(false)}
        />
      )}

      {/* TODO: change existing shifts,*/}
    </StyledShiftsContainer>
  );
}
