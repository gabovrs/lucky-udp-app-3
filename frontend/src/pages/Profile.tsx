import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

interface Transaction {
  _id: string;
  type: 'deposit' | 'withdraw' | 'bet';
  amount: number;
  createdAt: string;
}

const transactionTypes: Record<string, string> = {
  deposit: 'Depósito',
  withdraw: 'Retiro',
  bet: 'Apuesta',
};

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [txs, setTxs] = useState<Transaction[]>([]);

  if (!user) return null;

  useEffect(() => {
    (async () => {
      const data = await apiFetch<Transaction[]>('/history/transactions');
      setTxs(data);
    })();
  }, []);

  return (
    <section className='profile'>
      <header className='profile-wrap'>
        <div>
          <h1>Perfil</h1>
          <p>Bienvenido, <strong>{user.username}</strong></p>
        </div>
        <div className='hero-buttons'>
          <span className='btn btn-secondary' aria-disabled='true' style={{ cursor: 'default' }}>Saldo: <strong>${user.balance.toLocaleString()}</strong></span>
          <a className='btn btn-secondary' href='/withdraw'>Retirar</a>
          <a className='btn btn-primary' href='/deposit'>Depositar</a>
        </div>
      </header>

      <div className='profile-grid'>
        <section className='feature card'>
          <h2>Transacciones recientes</h2>
          {txs.length === 0 ? (
            <p>No hay transacciones recientes.</p>
          ) : (
            <div style={{ maxHeight: '25rem', overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map(tx => (
                    <tr key={tx._id}>
                      <td>{new Date(tx.createdAt).toLocaleString()}</td>
                      <td>{transactionTypes[tx.type]}</td>
                      <td style={{ color: tx.amount > 0 ? 'var(--gold)' : 'var(--error)', fontWeight: 600 }}>
                        ${tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>


        <article className='feature card'>
          <h2>Juegos disponibles</h2>
          <div className='card game-card'>
            <div>
              <strong>Ruleta Europea</strong>
              <p>La ruleta europea es un popular juego de casino que se distingue por tener una sola casilla con el número cero (0), lo que ofrece mejores probabilidades a los jugadores.</p>
            </div>
            <a className='btn btn-secondary' href='/roulette'>Jugar</a>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Profile;
