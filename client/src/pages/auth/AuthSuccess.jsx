import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from '../../store/reducers/userSlice';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      try {
        // Parse the JWT to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);

        // Create the user data object in the same format as regular login
        const userData = {
          token,
          user: {
            id: payload.userId,
            name: payload.name,
            email: payload.email,
            role: payload.role
          }
        };

        // Store the complete user data object in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User data stored:', userData);

        // Update Redux state with the same format
        dispatch(loadUser(userData));

        
        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Error processing token:', error);
        navigate('/login?error=token_processing_failed');
      }
    } else {
      // If no token, redirect to login
      navigate('/login?error=no_token');
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Signing you in...</h2>
      </div>
    </div>
  );
};

export default AuthSuccess;