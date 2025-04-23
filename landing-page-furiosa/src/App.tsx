import styles from './App.module.scss';
import logo from './assets/fuira-logo.png';
import { ChatBot } from './components/chatBot';

export function App() {
  return (
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <img src={logo} alt="Furia Logo" width={100}/>
        <h1>FURIA ESPORTS</h1>
      </header>

      <section className={styles.about}>
        <h2>Sobre a Organização</h2>
        <p>Fundada em 2017 em São Paulo, a FURIA se tornou uma das principais organizações de esports do mundo.</p>
        <div className={styles.stats}>
          <div>🏆 $4.9M em prêmios</div>
          <div>🌎 30+ países representados</div>
        </div>
      </section>

      <section className={styles.competitions}>
        <h2>Principais Competições</h2>
        <ul>
          <li>Counter-Strike 2 - ESL Pro League</li>
          <li>Valorant - Champions Tour</li>
          <li>Rocket League - RLCS</li>
        </ul>
      </section>

      <section className={styles.contact}>
        <h2>Contato</h2>
        <p>📧 contato@furia.gg</p>
        <div className={styles.social}>
          <a href="https://twitter.com/furia">Twitter</a>
          <a href="https://instagram.com/furia">Instagram</a>
        </div>
      </section>

      <ChatBot />
    </div>
  );
};

export default App;