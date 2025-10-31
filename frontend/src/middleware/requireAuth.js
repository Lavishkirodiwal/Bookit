import { useEffect } from 'react';
import { useRouter } from 'next/router';

const requireAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');

      if (!token) {
        router.replace('/login'); // fixed typo: reExperience → replace
      } else if (router.pathname.startsWith('/admin') && userRole !== 'admin') {
        router.replace('/');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `requireAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
};

export default requireAuth;
