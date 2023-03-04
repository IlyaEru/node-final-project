import styled from 'styled-components';
import {
  StyledDangerButton,
  StyledOutlineButton,
} from '../../style/globalStyle';

export const StyledModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

export const StyledModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 500px;
  max-width: 100%;
  position: relative;
`;

export const StyledModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

export const StyledModalText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

export const StyledModalButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export const StyledModalConfirmButton = styled(StyledDangerButton)``;

export const StyledModalCancelButton = styled(StyledOutlineButton)``;
