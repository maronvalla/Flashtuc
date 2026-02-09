import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Clientes from './pages/Clientes';
import Configuracion from './pages/Configuracion';
import Dashboard from './pages/Dashboard';
import Cotizador from './pages/Cotizador';
import Envios from './pages/Envios';
import Rutas from './pages/Rutas';
import Liquidaciones from './pages/Liquidaciones';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="envios" element={<Envios />} />
          <Route path="rutas" element={<Rutas />} />
          <Route path="cotizador" element={<Cotizador />} />
          <Route path="liquidaciones" element={<Liquidaciones />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
