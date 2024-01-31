import { useRef, useState } from 'react'
import { v4} from 'uuid'
import { Button, Form, Container, Row, Col, Card, FloatingLabel, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Consulta() {
    const [cpf, setCpf] = useState('');
    const [dadosUsuario, setDadosUsuario] = useState(null);

    const buscar = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/buscar/${cpf}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar dados do usuário.');
            }

            const data = await response.json();
           
            setDadosUsuario(data['usuarios']);
            
        } catch (error) {
            console.error('Erro na consulta:', error);
        }
    };

    return (
        <Container fluid="md" style={{ marginTop: '50px' }}>
            <Row>
                <Col>
                <Link to="/">
                    <Button variant="info" className="mx-2">
                    Voltar
                    </Button>
                </Link>
                </Col>
                <Col>
                    <Form.Group className="mb-3" controlId="formGroupCpf">
                        <Form.Label>Informe seu CPF</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" onClick={buscar}>
                        Consultar
                    </Button>

                    {dadosUsuario && (
                        <Table striped bordered hover className="mb-3">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Telefone</th>
                                    <th>Situação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dadosUsuario.map((usuario) => (
                                    
                                    <tr key={usuario.id}>
                                        <td>{usuario.nome}</td>
                                        <td>{usuario.telefone}</td>
                                        <td>{usuario.cpf ? 'Pendente de compra' : 'Pendente de cadastro'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Consulta;