import { useContext } from 'react';
import AuthContext from '../contexts/AmplifyContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;
