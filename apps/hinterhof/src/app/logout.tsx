import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { signOut } from '#/firebase/auth';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    signOut().then(() => navigate('/login'));
  }, [navigate]);

  return null;
}
