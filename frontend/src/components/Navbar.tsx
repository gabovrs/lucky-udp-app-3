import React from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const { user, loading, logout } = useAuth();

  return (
    <header className='navbar'>
      <div className='container nav-wrap'>
        <a className='brand' href='/'>
          <img src={logo} width='80' />
        </a>
        <nav>
          <a className='btn btn-link' href='/info'>Información</a>
          {!loading && (
            user ? (
              <>
                <a className='btn btn-link' href='/profile'>Perfil</a>
                <button className='btn btn-link' onClick={logout}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <a className='btn btn-link' href='/login'>Acceder</a>
                <a className='btn btn-primary' href='/register'>Crear cuenta</a>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
