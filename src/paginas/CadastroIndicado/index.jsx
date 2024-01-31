import { useRef, useState } from 'react'
import { v4} from 'uuid'
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function CadastroIndicado () {
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');

    const salvar = async () => {

        const indicado = {
            'nome':nome,
            'telefone':telefone,
            'email':email
        }
    
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/adicionarUsuarioIndicado/${cpf}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
              indicado
            )
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const data = await response.json();
            console.log(data);
          }
      
        } catch (error) {
          console.error('Erro na requisição:', error);
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
                    <Card className="text-center">
                    <Card.Header>Convidar Amigo (Cadastro Indicado) </Card.Header>
                        <Card.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formGroupNome">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" placeholder="" value={nome} onChange={(e) => setNome(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGroupTelefone">
                                <Form.Label>Telefone</Form.Label>
                                <Form.Control type="text" placeholder="" value={telefone} onChange={(e) => setTelefone(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGroupEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </Form.Group>
                            <Button variant="primary" onClick={salvar}>Adicionar</Button><br />
                        </Form>
                        </Card.Body>
                    </Card> 
                </Col>
                <Col>
                    <Form.Group className="mb-3" controlId="formGroupCpfIndicador">
                        <Form.Label>Infomr seu CPF</Form.Label>
                        <Form.Control type="text" placeholder="" value={cpf} onChange={(e) => setCpf(e.target.value)}/>
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    );
}

export default CadastroIndicado