import './app.css'; 
import { Footer } from './components/Footer/Footer';
import Header from './components/Header/Header';
import { SignupHomepage } from './components/Signup/SignupHomepage';

function App() {

  return (
    <div className="App">
      <Header/>
      <SignupHomepage/>
      <Footer/>
    </div>
  );
}

export default App;
