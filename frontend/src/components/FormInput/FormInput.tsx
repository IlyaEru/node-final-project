import { useId } from 'react';
import {
  StyledFormInput,
  StyledFormInputContainer,
  StyledFormLabel,
  StyledFormSelect,
} from './FormInput.style';

interface FormInputProps {
  label?: string;
  selectPlaceholder?: string;
  type: string;
  placeholder?: string;
  value?: string | number;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  options?: { label: string; value: string }[];
  isLoadingOptions?: boolean;
  [key: string]: any;
}

export default function FormInput({
  label,
  type,
  placeholder,
  value,
  onChange,
  isLoadingOptions,
  selectPlaceholder,
  ...props
}: FormInputProps) {
  const id = useId();
  const isSelectInput = type === 'select';
  value = value || '';

  return (
    <StyledFormInputContainer>
      {label && <StyledFormLabel htmlFor={id}>{label}</StyledFormLabel>}
      {isSelectInput ? (
        <StyledFormSelect
          onChange={onChange}
          id={id || 'DEFAULT'}
          value={value}
        >
          {isLoadingOptions && (
            <option value="DEFAULT" disabled>
              Loading...
            </option>
          )}
          {!isLoadingOptions && (label || selectPlaceholder) && (
            <option value="DEFAULT" disabled hidden>
              {label ? `select ${label}` : `${selectPlaceholder}`}
            </option>
          )}

          {value === '' && (
            <option value="" disabled hidden>
              {label ? `select ${label}` : `${selectPlaceholder}`}
            </option>
          )}
          {props.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledFormSelect>
      ) : (
        <StyledFormInput
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          id={id}
          {...props}
        />
      )}
    </StyledFormInputContainer>
  );
}
