import {
  HashRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { useAppSelector } from './redux/hooks';
import NavBar from './components/NavBar';
import { selectToken } from './redux/features/auth/authSlice';
import Departments from './pages/Departments';
import EditDepartment from './pages/EditDepartment';
import EditEmployee from './pages/EditEmployee';
import Employees from './pages/Employees';
import Home from './pages/Home';
import Login from './pages/Login';
import NewDepartment from './pages/NewDepartment';
import NewEmployee from './pages/NewEmployee/NewEmployee';
import Shifts from './pages/Shifts';
import Users from './pages/Users';
import NotFound from './pages/NotFound';

export default function AppRoutes() {
  const token = useAppSelector(selectToken);

  return (
    <HashRouter>
      {/* <NavBar /> */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={token ? <Home /> : <Login />} />
          <Route
            path="/employees"
            element={<PrivateWrapper component={<Employees />} />}
          />
          <Route
            path="/employees/new"
            element={<PrivateWrapper component={<NewEmployee />} />}
          />
          <Route
            path="/employees/:id"
            element={<PrivateWrapper component={<EditEmployee />} />}
          />
          <Route
            path="/departments"
            element={<PrivateWrapper component={<Departments />} />}
          />
          <Route
            path="/departments/new"
            element={<PrivateWrapper component={<NewDepartment />} />}
          />
          <Route
            path="/departments/:id"
            element={<PrivateWrapper component={<EditDepartment />} />}
          />
          <Route
            path="/shifts"
            element={<PrivateWrapper component={<Shifts />} />}
          />
          <Route
            path="/users"
            element={<PrivateWrapper component={<Users />} />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

const PrivateWrapper = ({ component }: { component: JSX.Element }) => {
  const token = useAppSelector(selectToken);

  return token ? component : <Navigate to="/" replace />;
};

const Layout = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <NavBar />}
      <Outlet />
    </>
  );
};
