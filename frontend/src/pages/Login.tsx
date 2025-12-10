import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(username, password);
      await refreshUser();

      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <section className='profile'>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-grid'>
          <div>
            <label className='label' htmlFor='username'>Nombre de usuario</label>
            <input
              className='input'
              id='username'
              name='username'
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete='username'
            />
          </div>
          <div>
            <label className='label' htmlFor='password'>Contraseña</label>
            <input
              className='input'
              id='password'
              name='password'
              type='password'
              minLength={8}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete='new-password'
            />
          </div>
        </div>

        {error && <p className='form-error'>{error}</p>}

        <div className='form-actions'>
          <button className='btn btn-primary' type='submit'>Iniciar sesión</button>
          <a className='btn btn-secondary' href='/register'>Crear cuenta</a>
        </div>
      </form>
    </section>
  );
};

export default Login;
