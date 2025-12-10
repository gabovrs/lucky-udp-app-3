import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await register(username, password, password2);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    }
  };

  return (
    <section className='profile'>
      <h1>Crear cuenta</h1>
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
              autoComplete='new-password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className='label' htmlFor='password2'>Confirmar contraseña</label>
            <input
              className='input'
              id='password2'
              name='password2'
              type='password'
              minLength={8}
              required
              autoComplete='new-password'
              value={password2}
              onChange={e => setPassword2(e.target.value)}
            />
          </div>
        </div>

        {error && <p className='form-error'>{error}</p>}

        <label style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginTop: '10px' }}>
          <input type='checkbox' required />
          <span>Acepto términos y condiciones</span>
        </label>

        <div className='form-actions'>
          <button className='btn btn-primary' type='submit'>Crear cuenta</button>
          <a className='btn btn-secondary' href='/login'>Ya tengo cuenta</a>
        </div>
      </form>
    </section>
  );
};

export default Register;
