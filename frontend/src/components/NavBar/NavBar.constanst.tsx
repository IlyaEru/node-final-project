import { FaBuilding, FaUser } from 'react-icons/fa';
import { BsCalendarWeekFill } from 'react-icons/bs';
import { MdEngineering } from 'react-icons/md';

export const navBarLinks = [
  {
    label: 'Employees',
    path: '/employees',
    icon: <MdEngineering />,
  },
  {
    label: 'Departments',
    path: '/departments',
    icon: <FaBuilding />,
  },

  {
    label: 'Shifts',
    path: '/shifts',
    icon: <BsCalendarWeekFill />,
  },
  {
    label: 'Users',
    path: '/users',
    icon: <FaUser />,
  },
];

export const navBarNewLinks = [
  {
    label: 'New Employee',
    path: '/employees/new',
    icon: <MdEngineering />,
  },
  {
    label: 'New Department',
    path: '/departments/new',
    icon: <FaBuilding />,
  },
];
