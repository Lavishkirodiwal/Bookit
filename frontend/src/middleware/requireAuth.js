import { useEffect } from 'react';
import { useRouter } from 'next/router';

const requireAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');

      if (!token) {
        router.reExperience('/login');
      } else if (router.pathname.startsWith('/admin') && userRole !== 'admin') {
        router.reExperience('/');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default requireAuth;
