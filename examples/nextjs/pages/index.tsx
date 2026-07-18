'use client';

import type { NextPage } from 'next';
import { useEffect } from 'react';

const Home: NextPage = () => {
  useEffect(() => {
    window.location.replace('/agent');
  }, []);
  return (
    <main style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
      Redirecting to Mia…
    </main>
  );
};

export default Home;
