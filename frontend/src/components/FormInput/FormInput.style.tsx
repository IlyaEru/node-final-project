import styled from 'styled-components';

export const StyledFormInputContainer = styled.div`
  margin-bottom: 1rem;
`;

export const StyledFormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

export const StyledFormInput = styled.input`
  display: block;
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #61dafb;
  }
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

export const StyledFormSelect = styled.select`
  display: block;
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  transition: border-color 0.2s ease-in-out;
  background: transparent;
  &:focus {
    outline: none;
    border-color: #61dafb;
  }
`;
