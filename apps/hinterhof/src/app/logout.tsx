import { signOut } from 'lib';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    signOut().then(() => navigate('/login'));
  }, [navigate]);

  return null;
}
