import './App.scss';
import Footer from '../components/Footer';
import Header from '../components/Header';
import TwoPanels from '../components/TwoPanels';

function App() {
    return (
        <div className="App">
            <Header pageTitle="Каталог" pageIndex="0" />
            <TwoPanels />
            <Footer />
        </div>
    );
}

export default App;
