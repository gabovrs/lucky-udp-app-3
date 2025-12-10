import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWinners, placeBet, type BetType, type RouletteWinner } from '../api/roulette';

const ORDER = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const REDS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16,
  18, 19, 21, 23, 25, 27, 30,
  32, 34, 36,
]);

const SEG = 360 / ORDER.length;

const Roulette: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [winners, setWinners] = useState<RouletteWinner[]>([]);
  const [betType, setBetType] = useState<BetType>('straight');
  const [selection, setSelection] = useState<string>('0');
  const [amount, setAmount] = useState<number>(0);
  const [isPlacingBet, setIsPlacingBet] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [payout, setPayout] = useState<number | null>(null);

  // refs para la rueda
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const labelsRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef(0);
  const spinningRef = useRef(false);

  if (!user) return null;

  // Inicializamos últimos ganadores desde la API
  useEffect(() => {
    (async () => {
      try {
        const data = await getWinners();
        setWinners(data);
      } catch (err) {
        console.error('Error al obtener winners:', err);
      }
    })();
  }, []);

  // --- funciones de la rueda (imperativas pero encapsuladas) ---

  const colorOf = (n: number): string => {
    const rootStyles = getComputedStyle(document.documentElement);

    if (n === 0) {
      return rootStyles.getPropertyValue('--accent').trim();
    }
    const red = rootStyles.getPropertyValue('--error').trim();
    const black = rootStyles.getPropertyValue('--bg').trim();

    return REDS.has(n) ? red : black;
  };

  const paintWheel = () => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    const stops = ORDER.map((num, i) => {
      const start = (i * SEG).toFixed(6);
      const end = ((i + 1) * SEG).toFixed(6);
      return `${colorOf(num)} ${start}deg ${end}deg`;
    }).join(', ');

    wheel.style.background = `conic-gradient(from -90deg, ${stops})`;
  };

  const buildLabels = () => {
    const wheel = wheelRef.current;
    const labelsBox = labelsRef.current;
    if (!wheel || !labelsBox) return;

    labelsBox.innerHTML = '';

    const radius = wheel.clientWidth / 2 - 36;

    ORDER.forEach((num, i) => {
      const el = document.createElement('div');
      el.className = 'wheel-label ' + (num === 0 ? 'green' : REDS.has(num) ? 'red' : 'black');
      el.textContent = String(num);

      const angle = -90 + (i + 0.5) * SEG;

      el.style.transform =
        `translate(-50%, -50%) rotate(${angle}deg) translate(0, -${radius}px) rotate(${-angle}deg)`;

      el.dataset.index = String(i);
      labelsBox.appendChild(el);
    });
  };

  const clearActive = () => {
    const labelsBox = labelsRef.current;
    if (!labelsBox) return;

    labelsBox.querySelectorAll('.wheel-label.active')
      .forEach(el => el.classList.remove('active'));
  };

  const highlightIndex = (i: number) => {
    const labelsBox = labelsRef.current;
    if (!labelsBox) return;

    const el = labelsBox.querySelector<HTMLDivElement>(`.wheel-label[data-index="${i}"]`);
    if (el) el.classList.add('active');
  };

  const rotationForIndex = (targetIndex: number): number => {
    const aligned = 90 - (targetIndex + 0.5) * SEG;
    const alignedNorm = ((aligned % 360) + 360) % 360;

    const currentMod = ((rotationRef.current % 360) + 360) % 360;
    const deltaToAligned = ((alignedNorm - currentMod) + 360) % 360;

    const extraSpins = 4 + Math.floor(Math.random() * 3);
    return rotationRef.current + extraSpins * 360 + deltaToAligned;
  };

  const spinToNumber = (targetNumber: number): Promise<void> => {
    return new Promise(resolve => {
      const wheel = wheelRef.current;
      if (!wheel) {
        resolve();
        return;
      }

      if (spinningRef.current) {
        resolve();
        return;
      }

      spinningRef.current = true;
      clearActive();

      const targetIndex = ORDER.indexOf(targetNumber);
      if (targetIndex === -1) {
        console.warn('Número no encontrado en ORDER', targetNumber);
        spinningRef.current = false;
        resolve();
        return;
      }

      const finalRotation = rotationForIndex(targetIndex);
      wheel.style.transform = `rotate(${finalRotation}deg)`;

      const onEnd = () => {
        wheel.removeEventListener('transitionend', onEnd);
        rotationRef.current = finalRotation;
        highlightIndex(targetIndex);

        setTimeout(() => {
          spinningRef.current = false;
          resolve();
        }, 350);
      };

      wheel.addEventListener('transitionend', onEnd);
    });
  };

  // inicialización de rueda + labels en el primer render
  useEffect(() => {
    paintWheel();
    buildLabels();

    const handleResize = () => {
      buildLabels();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const updateSelection = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSelection(e.target.value);
  };

  const updateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleBetTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as BetType;
    setBetType(newType);

    switch (newType) {
      case 'straight':
        setSelection('0');
        break;
      case 'color':
        setSelection('red');
        break;
      case 'parity':
        setSelection('even');
        break;
      case 'dozen':
        setSelection('1');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPlacingBet || spinningRef.current) return;

    setError(null);

    if (!amount || amount <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    setIsPlacingBet(true);
    setPayout(null);

    try {
      const result = await placeBet({ betType, selection, amount });

      await spinToNumber(result.number);

      await refreshUser();

      setPayout(result.payout);

      const winners = await getWinners();
      setWinners(winners);
    } catch (err: any) {
      setError(err.message || 'Error al apostar');
    } finally {
      setIsPlacingBet(false);
    }
  };

  // subcomponentes para cada tipo de apuesta
  const StraightBetType: React.FC = () => (
    <label>
      Número 0-36
      <input
        className='input'
        name='selection'
        type='number'
        min='0'
        max='36'
        required
        onChange={updateSelection}
        value={selection}
      />
    </label>
  );

  const ColorBetType: React.FC = () => (
    <label>
      Color
      <select className='input' name='selection' onChange={updateSelection} value={selection}>
        <option value='red'>Rojo</option>
        <option value='black'>Negro</option>
      </select>
    </label>
  );

  const ParityBetType: React.FC = () => (
    <label>
      Paridad
      <select className='input' name='selection' onChange={updateSelection} value={selection}>
        <option value='even'>Par</option>
        <option value='odd'>Impar</option>
      </select>
    </label>
  );

  const DozenBetType: React.FC = () => (
    <label>
      Docena
      <select className='input' name='selection' onChange={updateSelection} value={selection}>
        <option value='1'>1-12</option>
        <option value='2'>13-24</option>
        <option value='3'>25-36</option>
      </select>
    </label>
  );

  return (
    <section className='game'>
      <section className='profile'>
        <header className='profile-wrap'>
          <h1>Ruleta Europea</h1>
          <span className='btn btn-secondary' aria-disabled='true' style={{ cursor: 'default' }}>
            Saldo:
            <strong id='balanceValue'>
              ${user.balance.toLocaleString()}
            </strong>
          </span>
        </header>

        <form onSubmit={handleSubmit}>
          <div className='form-grid'>
            <div>
              <label className='label' htmlFor='amount'>
                Monto
              </label>
              <input
                className='input'
                name='amount'
                id='amount'
                type='number'
                min='1'
                required
                onChange={updateAmount}
                value={amount || ''}
              />
            </div>

            <div>
              <label className='label' htmlFor='betType'>
                Tipo de apuesta
              </label>
              <select
                className='input'
                name='betType'
                id='betType'
                onChange={handleBetTypeChange}
                value={betType}
              >
                <option value='straight'>Número (35:1)</option>
                <option value='color'>Color (1:1)</option>
                <option value='parity'>Par/Impar (1:1)</option>
                <option value='dozen'>Docena (2:1)</option>
              </select>
            </div>

            <div id='selection-wrap'>
              {betType === 'straight' && <StraightBetType />}
              {betType === 'color' && <ColorBetType />}
              {betType === 'parity' && <ParityBetType />}
              {betType === 'dozen' && <DozenBetType />}
            </div>

            <div className='form-actions'>
              <button className='btn btn-primary' type='submit' disabled={isPlacingBet || spinningRef.current}>
                {isPlacingBet || spinningRef.current ? 'Apostando...' : 'Apostar'}
              </button>
            </div>
          </div>

          {error && <p className='error'>{error}</p>}
        </form>

        {
          payout !== null && (
            <section className='feature card'>
              {
                payout > 0
                  ? <p className='won'>¡Ganaste ${payout.toLocaleString()}!</p>
                  : <p className='lost'>No has ganado esta vez. ¡Inténtalo de nuevo!</p>
              }
            </section>
          )
        }
      </section>

      <section className='game-wrap'>
        <div className='roulette-wrap' id='roulette'>
          <div className='pointer' aria-hidden='true'></div>
          <div id='wheel' className='wheel' aria-label='Rueda de ruleta europea' ref={wheelRef}>
            <div className='ticks' aria-hidden='true'></div>
            <div id='wheel-labels' className='wheel-labels' aria-hidden='true' ref={labelsRef}></div>
            <div className='hub'></div>
          </div>
        </div>
      </section>

      <section className='feature card'>
        <h3>Últimos números ganadores</h3>
        <div id='winners' className='winners-list'>
          {winners.map((winner, index) => (
            <span
              key={`${winner.number}-${winner.color}-${index}`}
              className={`winner-chip ${winner.color}`}
              title={winner.color}
            >
              {winner.number}
            </span>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Roulette;
