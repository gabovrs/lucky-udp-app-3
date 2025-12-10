import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deposit } from '../api/wallet';
import { useNavigate } from 'react-router-dom';

const Deposit: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!user) return null;

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await deposit(amount);
      await refreshUser();
      setAmount(0);
      navigate('/profile');

    } catch (err: any) {
      setError(err.message || 'Error al depositar');
    }
  };

  return (
    <>
      <section className='profile'>
        <header className='profile-wrap'>
          <div>
            <h1>Depositar</h1>
          </div>
          <span className='btn btn-secondary' aria-disabled='true' style={{ cursor: 'default' }}>Saldo: <strong>${user.balance.toLocaleString()}</strong></span>
        </header>
        <form onSubmit={handleDeposit}>
          <div className='form-grid'>
            <div>
              <label className='label' htmlFor='amount'>Cantidad</label>
              <input
                className='input'
                type='number'
                name='amount'
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className='label' htmlFor='paymentMethod'>Método de pago</label>
              <select className='input' id='paymentMethod' name='paymentMethod' required>
                <option value='bankTransfer' selected>Transferencia bancaria</option>
                <option value='creditCard'>Tarjeta de crédito</option>
                <option value='debitCard'>Tarjeta de débito</option>
              </select>
            </div>
          </div>

          {error && <p className='form-error'>{error}</p>}

          <div className='form-actions'>
            <button className='btn btn-primary' type='submit'>Depositar</button>
            <a className='btn btn-secondary' href='/profile'>Cancelar</a>
          </div>
        </form>
      </section>
    </>
  );
};

export default Deposit;
