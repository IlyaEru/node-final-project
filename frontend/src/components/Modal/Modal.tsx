import {
  StyledModalButtonsContainer,
  StyledModalCancelButton,
  StyledModalConfirmButton,
  StyledModalContainer,
  StyledModalContent,
  StyledModalText,
  StyledModalTitle,
} from './Modal.style';

interface ModalProps {
  handleModalClose?: () => void;
  handleModalConfirm?: () => void;
  title?: string;
  modalText?: string;
  modalConfirmText?: string;
  modalCancelText?: string;
  children?: React.ReactNode;
}

export default function Modal({
  handleModalClose,
  handleModalConfirm,
  title,
  modalText,
  modalConfirmText,
  modalCancelText,
  children,
}: ModalProps) {
  return (
    <StyledModalContainer>
      <StyledModalContent>
        {title && <StyledModalTitle>{title}</StyledModalTitle>}
        {modalText && <StyledModalText>{modalText}</StyledModalText>}
        <StyledModalButtonsContainer>
          <>
            {handleModalClose && (
              <StyledModalCancelButton onClick={handleModalClose}>
                {modalCancelText || 'Cancel'}
              </StyledModalCancelButton>
            )}
            {handleModalConfirm && (
              <StyledModalConfirmButton onClick={handleModalConfirm}>
                {modalConfirmText || 'Confirm'}
              </StyledModalConfirmButton>
            )}
          </>
        </StyledModalButtonsContainer>
      </StyledModalContent>
    </StyledModalContainer>
  );
}
