import { useRef, useState, useEffect } from 'react'
import { Button, Form, Container, Row, Col, Card, FloatingLabel, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../SideBar';
import { useCookies } from 'react-cookie';


function Menu () {
    const variant = 'Light';

    const [dadosUsuario, setDadosUsuario] = useState(null);

    // "'d_mt' é o CPF, 'a_fo' é o nome" 
    const [cookies] = useCookies(['user', 'd_mt', 'a_fo']);
    const navigate = useNavigate();

    const desembaralha = (valorEmbaralhado) => {
        return valorEmbaralhado.split('').reverse().join('');
    };
    
    // "'d_mt' é o CPF do usuario"
    const verificarUsuarioValido = () => {
        if (cookies.d_mt === 'undefined') {
            
            navigate('/login');
        }
    };
    

    const buscar = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/buscar/${desembaralha(decodeURIComponent(atob(cookies.d_mt)))}`);
            // if (!response.ok) {
            //     throw new Error('Erro ao buscar dados do usuário.');
            // }

            const data = await response.json();

            console.log(data);
           
            setDadosUsuario(data['usuarios']);
            
        } catch (error) {
            console.error('Erro na consulta:', error);
        }
    };

    console.log(cookies.cpf);

    useEffect(() => {
        verificarUsuarioValido(); 
        if (cookies.d_mt) {
            buscar();
        }
    }, [cookies.cpf, navigate]);


    return (
        
        <Container fluid>
            <Sidebar />
            <Row>   
                <Col md={3}>
                    <Card
                        bg={variant.toLowerCase()}
                        key={variant}
                        text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                        style={{ width: '18rem' }}  
                        className="mb-2"
                    >
                        <Card.Header><Card.Title>Vouchers</Card.Title></Card.Header>
                        <Card.Body>
                            
                            <Card.Text>
                                1
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card
                        bg={variant.toLowerCase()}
                        key={variant}
                        text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                        style={{ width: '18rem' }}  
                        className="mb-2"
                    >
                        <Card.Header><Card.Title>Saldo Disponivel</Card.Title></Card.Header>
                        <Card.Body>
                            
                            <Card.Text>
                                R$ 150,00
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                <Table striped bordered hover className="mb-3" style={{ borderRadius: '10px' }}>
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
                                    <td>{usuario.telefone}</td>
                                    <td>{usuario.cpf ? 'Pendente de compra' : 'Pendente de cadastro'}</td>
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
            </Row>
        </Container>
    );
}

export default Menu