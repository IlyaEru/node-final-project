import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import ErrorList from '../../components/ErrorList';
import FormInput from '../../components/FormInput';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useLoginMutation } from '../../redux/api/authApiSlice';
import { setAuth } from '../../redux/features/auth/authSlice';
import { useAppDispatch } from '../../redux/hooks';
import { StyledLoginContainer } from './Login.style';
import validateLogin from './Login.validation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    errors.length > 0 && setErrors([]);
  }, [username, email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateLogin({ username, email });
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const loginData = await login({ username, email }).unwrap();

      localStorage.setItem('refreshToken', loginData.tokens.refresh.token);
      dispatch(
        setAuth({
          token: loginData.tokens.access.token,
          fullName: loginData.user.fullName,
          actions: {
            actionsLeft: loginData.userActionsLeft,
            date: dayjs().format('YYYY-MM-DD'),
          },
        }),
      );
    } catch (error: any) {
      setErrors([error.data.error.message]);
    }
  };

  return (
    <StyledLoginContainer>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Login</button>
        {errors.length > 0 && <ErrorList errors={errors} />}
      </form>
      {isLoading && <LoadingSpinner />}
    </StyledLoginContainer>
  );
}
