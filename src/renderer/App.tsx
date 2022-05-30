import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import StoreProvider from './background/store';
import ApplicationWrapper from './components/ApplicationWrapper/ApplicationWrapper';

const EntryPoint = () => {
  return (
    <div>
      <StoreProvider>
        <ApplicationWrapper />
      </StoreProvider>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EntryPoint />} />
      </Routes>
    </Router>
  );
}
