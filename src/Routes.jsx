import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cadastro from './paginas/Cadastro';
import CadastroIndicado from './paginas/CadastroIndicado';
import CadIndicado from './paginas/CadIndicado';
import Consulta from './paginas/Consulta';
import Menu from './paginas/Menu';
import Login from './paginas/Login';
import Registrar from './paginas/Registrar';
import Editar from './paginas/Editar';
import Reset from './paginas/Reset';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/menu" element={<Menu />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastro_indicado" element={<CadastroIndicado />} />
        <Route path="/cad_indicado" element={<CadIndicado />} />
        <Route path="/consulta" element={<Consulta />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registrar' element={<Registrar />} />
        <Route path='/editar' element={<Editar />} />
        <Route path='/reset' element={<Reset />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
