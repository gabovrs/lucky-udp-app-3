import React from 'react';

const Home: React.FC = () => {
  return (
    <>
      <section className='hero'>
        <div className='container hero-grid'>
          <div>
            <h1>Bienvenido a <span style={{color: 'var(--gold)'}}>Lucky UDP</span></h1>
            <p>El casino del ludópata.</p>
            <ul className='hero-buttons' role='list'>
              <li><a className='btn btn-primary' href='/register'>Crear cuenta</a></li>
              <li><a className='btn btn-secondary' href='/login'>Acceder</a></li>
            </ul>
          </div>


          <aside className='hero-card'>
            <div className='facts'>
              <div className='card fact'>
                <h3>1 juego</h3>
                <p>Gran variedad de apuestas.</p>
              </div>
              <div className='card fact'>
                <h3>24/7</h3>
                <p>Soporte que responde.</p>
              </div>
              <div className='card fact'>
                <h3>1 segundo</h3>
                <p>Retiros promedio.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className='features'>
        <div className='container features-grid'>
          <article className='feature card'>
            <span className='kicker'>Ruleta europea</span>
            <h3>Juego limpio</h3>
            <p>Probabilidades transparentes y mesas digitales fluidas. Nada de trucos, pura estadística.
            </p>
          </article>
          <article className='feature card'>
            <span className='kicker'>Seguridad</span>
            <h3>Seguridad sin drama</h3>
            <p>Tu contraseña está a salvo con cifrado de última generación.</p>
          </article>
          <article className='feature card'>
            <span className='kicker'>Cookies</span>
            <h3>Uso de cookies</h3>
            <p>Utilizamos cookies para mejorar tu experiencia. Al continuar, aceptas nuestra política de cookies.</p>
          </article>
        </div>
      </section>

      <section className='cta'>
        <div className='container'>
          <div className='cta-box card'>
            <h2>¿Listo para jugar?</h2>
            <a className='btn btn-primary' href='/register'>Crear cuenta</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
