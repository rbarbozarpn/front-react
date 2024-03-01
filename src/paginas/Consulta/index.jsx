import { useRef, useState, useEffect } from 'react'
import { v4} from 'uuid'
import { Button, Form, Container, Row, Col, Card, FloatingLabel, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import "./style.css";
import Sidebar from '../SideBar';
import DataTable from 'react-data-table-component';

function Consulta() {
    const [cpf, setCpf] = useState('');
    const [dadosUsuario, setDadosUsuario] = useState(null);
    // "'d_mt' é o CPF, 'a_fo' é o nome", 
    const [cookies] = useCookies(['user', 'd_mt', 'a_fo']);

    const desembaralha = (valorEmbaralhado) => {
        return valorEmbaralhado.split('').reverse().join('');
    };

    const buscar = async () => {
        try {
            
            const response = await fetch('https://sistema.api.vpi.cellular.com.br/api/buscar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [btoa('cpf')]: btoa(desembaralha(decodeURIComponent(atob(cookies.d_mt)))) }), // Envie o CPF no corpo da requisição
            });

            const data = await response.json();

            /**Decodificando a resposta da api */
            const usuariosDecodificados = data.resposta.map(usuarioCodificado => {
                const usuarioString = atob(usuarioCodificado);
                return JSON.parse(usuarioString);
            });
    
            setDadosUsuario(usuariosDecodificados);
              
        } catch (error) {
            console.error('Erro na consulta:', error);
        }
    };

    const formatPhoneNumber = (phoneNumber) => {
    // Verifica se o número de telefone tem pelo menos 10 dígitos
    if (phoneNumber && phoneNumber.length >= 10) {
            // Formata o número de telefone
            return `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 3)} ${phoneNumber.substring(3, 7)}-${phoneNumber.substring(7)}`;
        }
        return phoneNumber; // Retorna o número de telefone sem formatação se for inválido
    };

    useEffect(() => {
       
        if (cookies.d_mt) {
            buscar();
        }
    }, [cookies.cpf]);

    return (
        <Container fluid>
            <Sidebar />
            <Row>
                <Col md={3}>
                    <div className="text-center d-flex justify-content-center align-items-center mb-4" style={{ height: '100%' }}>
                        <img src='assets/imagens/GrupoCellular_1_Colorido.png' alt="Sistema VPI'" style={{ maxWidth: '100%' }}/>
                    </div>
                </Col>
                <Col md={6}>
                    <Table className="mb-3 table-custom">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Telefone</th>
                                <th>Situação</th>
                            </tr>
                        </thead>
                        <tbody>
                        {dadosUsuario && dadosUsuario.length > 0 ? (
                            dadosUsuario.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.nome}</td>
                                    <td>{formatPhoneNumber(usuario.telefone)}</td>
                                    <td>
                                        {usuario.situacao === 0 ? 'Pendente de cadastro' : 
                                        usuario.situacao === 1 ? 'Pendente de compra' :
                                        usuario.situacao === 2 ? 'Usuário não habilitado à promoção' :
                                        usuario.situacao === 3 ? 'Compra realizada' : ''}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">Nenhum dado disponível.</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Col>
                <Col md={3}>
                    <div className="text-center d-flex justify-content-center align-items-center mb-4" style={{ height: '100%' }}>
                        <img src='assets/imagens/Selo.png' alt="Sistema VPI'" style={{ maxWidth: '100%' }} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Consulta;