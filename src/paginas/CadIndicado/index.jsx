import { useRef, useState, useEffect } from 'react'
import { v4} from 'uuid'
import { Button, Form, Container, Row, Col, Card, FloatingLabel, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function CadIndicado () {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [operadora, setOperadora] = useState('');
    const [modelo, setModelo] = useState('');
    const [id, setId] = useState('');

   const [showAlert, setShowAlert] = useState(false);
   const [alertVariant, setAlertVariant] = useState('success'); // 'success', 'danger', etc.
   const [alertMessage, setAlertMessage] = useState('');

    const handleTelChange = (e) => {
        const tel = e.target.value;
        setTelefone(tel);
    
    
        buscarUsuario(tel);
    };

    const buscarUsuario = async (tel) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/usuario_ind/${tel}`);
          if (!response.ok) {
            throw new Error('Erro ao buscar dados do usuário.');
          }
    
          const data = await response.json();
          
          setNome(data['usuario'].nome);
          setEmail(data['usuario'].email);
          setCpf(data['usuario'].cpf);
          setEstado(data['usuario'].estado);
          setOperadora(data['usuario'].operadora);
          setModelo(data['usuario'].modelo);
          setCidade(data['usuario'].cidade);
          setId(data['usuario'].id);

          
        } catch (error) {
          console.error('Erro na consulta:', error);
        }
    };

    const atualizar = async () => {
        const usuario = {
          'nome': nome,
          'telefone': telefone,
          'cpf': cpf,
          'email': email,
          'estado': estado,
          'cidade': cidade,
          'operadora': operadora,
          'modelo': modelo
        }
      
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/atualizaUsuarioIndicado/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const data = await response.json();
            setAlertVariant('success');
            setAlertMessage(data.mensagem);
            setShowAlert(true);
      
            // Limpa os campos após a atualização bem-sucedida
            setNome('');
            setTelefone('');
            setCpf('');
            setEmail('');
            setEstado('');
            setCidade('');
            setOperadora('');
            setModelo('');
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
                    <Card.Header>Cadastro Indicado (Terminar o cadastro) </Card.Header>
                        <Card.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formGroupTelefone">
                                <Form.Label>Telefone</Form.Label>
                                <Form.Control type="text" placeholder="" value={telefone} onChange={handleTelChange}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGroupNome">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" placeholder="" value={nome} onChange={(e) => setNome(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGroupCpf">
                                <Form.Label>Cpf</Form.Label>
                                <Form.Control type="text" placeholder="" value={cpf} onChange={(e) => setCpf(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGroupEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGroupEstado">
                                <Form.Label>Estado</Form.Label>
                                <Form.Control type="text" placeholder="" value={estado} onChange={(e) => setEstado(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGroupCidade">
                                <Form.Label>Cidade</Form.Label>
                                <Form.Control type="text" placeholder="" value={cidade} onChange={(e) => setCidade(e.target.value)}/>
                            </Form.Group>
                            <FloatingLabel controlId="operadora" label="Qual sua operadora ?">
                                <Form.Select aria-label="Floating label select example" value={operadora} onChange={(e) => setOperadora(e.target.value)}>
                                    <option value="claro">Claro</option>
                                    <option value="tim">Tim</option>
                                    <option value="vivo">Vivoo</option>
                                    <option value="outra">Outra</option>
                                </Form.Select>
                            </FloatingLabel>
                            <Form.Group className="mb-3" controlId="formGroupModelo">
                                <Form.Label>Modelo</Form.Label>
                                <Form.Control type="text" placeholder="" value={modelo} onChange={(e) => setModelo(e.target.value)}/>
                            </Form.Group>
                            <Button variant="primary" className="mt-4" onClick={atualizar}>Salvar</Button><br />
                        </Form>
                        <Alert variant={alertVariant} show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                            {alertMessage}
                        </Alert>
                        </Card.Body>
                    </Card> 
                </Col>
                <Col>
                </Col>
            </Row>
        </Container>
    );
}

export default CadIndicado