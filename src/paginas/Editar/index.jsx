import { useRef, useState, useEffect } from 'react'
import { v4 } from 'uuid'
import { Button, Form, Container, Row, Col, Card, Modal, Alert, InputGroup, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../SideBar';
import { useCookies } from 'react-cookie';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

function Editar(){
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [showPasswordAtual, setShowPasswordAtual] = useState(false);
    const [showPasswordNova, setShowPasswordNova] = useState(false);
    const [senha, setSenha] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [senhaNova, setSenhaNova] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // "'d_mt' é o CPF, 'a_fo' é o nome", 'b_ac' é o telefone, j_hk é o email 
    const [cookies] = useCookies(['user', 'd_mt', 'a_fo', 'b_ac', 'j_hk']);

    const desembaralha = (valorEmbaralhado) => {
        return valorEmbaralhado.split('').reverse().join('');
    };


    const togglePasswordVisibilityAtual = () => {
        setShowPasswordAtual(!showPasswordAtual);
    };

    const togglePasswordVisibilityNova = () => {
        setShowPasswordNova(!showPasswordNova);
    };

    const salvar = async () => {
        setIsLoading(true);
        const senhas = {
            'senha': senha,
            'senhaNova': senhaNova,
            'nome': nome,
            'telefone': telefone,
            'email': email
        };

        console.log(senhas)

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/atualizaSenha/${desembaralha(decodeURIComponent(atob(cookies.d_mt)))}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(senhas)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.json();

                setAlertVariant('success');
                setAlertMessage('Informações atualizadas !!!');
                setShowAlert(true);
                
                setSenha('');
                setSenhaNova('');
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Erro na requisição:', error);
            setIsLoading(false);
        }
    };

    const buscar_info = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/busca_cpf/${desembaralha(decodeURIComponent(atob(cookies.d_mt)))}`);
            // if (!response.ok) {
            //     throw new Error('Erro ao buscar dados do usuário.');
            // }

            const data = await response.json();
           
            setNome(data['usuario'].nome);
            setTelefone(data['usuario'].telefone);
            setEmail(data['usuario'].email);
            
        } catch (error) {
            console.error('Erro na consulta:', error);
        }
    };

    useEffect(() => {
        buscar_info();
        
    }, [cookies.cpf]);

    return(
        <Container fluid>
            <Sidebar />
            <Row className="justify-content-md-center d-flex align-items-center">
                <Col xs={12} md={6} lg={4}>
                <Alert variant={alertVariant} show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                </Alert>
                    <Form className="rounded border p-4 shadow">
                    <Form.Group className="mb-3" controlId="formGroupNome">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" placeholder="" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </Form.Group>   
                    <Form.Group className="mb-3" controlId="formGroupTelefone">
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control type="text" placeholder="" value={telefone} onChange={(e) => setTelefone(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>    

                    <Form.Group className="mb-3" controlId="senhaAtual">
                        <strong><Form.Label>Senha Atual</Form.Label></strong>
                        <InputGroup>
                        <Form.Control
                            type={showPasswordAtual ? 'text' : 'password'}
                            placeholder=""
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <InputGroup.Text onClick={togglePasswordVisibilityAtual} style={{ cursor: 'pointer' }}>
                            {showPasswordAtual ? <EyeSlash /> : <Eye />}
                        </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="senhaNova">
                        <strong><Form.Label>Nova Senha</Form.Label></strong>
                        <InputGroup>
                        <Form.Control
                            type={showPasswordNova ? 'text' : 'password'}
                            placeholder=""
                            value={senhaNova}
                            onChange={(e) => setSenhaNova(e.target.value)}
                        />
                        <InputGroup.Text onClick={togglePasswordVisibilityNova} style={{ cursor: 'pointer' }}>
                            {showPasswordNova ? <EyeSlash /> : <Eye />}
                        </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>

                        

                        {isLoading ? (
                            <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : (
                            <div className="mt-3 text-center">
                                <Button variant="primary" className="w-100 mt-3 btn-custom" onClick={salvar} style={{ backgroundColor: '#c52a35', borderColor: '#c52a35', color: 'cor-do-texto-desejada' }}>Atualizar</Button>
                            </div>
                        )}
                    </Form>
                </Col>
            </Row>

        </Container>
        
    );
}

export default Editar;