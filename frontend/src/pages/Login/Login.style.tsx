import styled from 'styled-components';

export const StyledLoginContainer = styled.main`
  max-width: 400px;
  margin: 10rem auto;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;

  h1 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;

      label {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
      }

      input {
        height: 40px;
        padding: 0 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-size: 16px;
      }
    }

    button[type='submit'] {
      height: 40px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #0069d9;
      }
    }

    .error-list {
      list-style: none;
      margin: 1rem 0 0;
      padding: 0;
    }

    .error-list li {
      color: #721c24;
      background-color: #f8d7da;
      border-color: #f5c6cb;
      padding: 0.75rem 1.25rem;
      margin-bottom: 1rem;
      border: 1px solid transparent;
      border-radius: 0.25rem;
    }
  }
`;
