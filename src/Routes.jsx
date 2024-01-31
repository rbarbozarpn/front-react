import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cadastro from './paginas/Cadastro';
import CadastroIndicado from './paginas/CadastroIndicado';
import CadIndicado from './paginas/CadIndicado';
import Consulta from './paginas/Consulta';
import Menu from './paginas/Menu';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastro_indicado" element={<CadastroIndicado />} />
        <Route path="/cad_indicado" element={<CadIndicado />} />
        <Route path="/consulta" element={<Consulta />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
