import React from 'react';
import Navbar from './Navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className='container'>
        {children}
      </main>
      <footer>
        <div className="container">
          <p>© {new Date().getFullYear()} Lucky UDP. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;
