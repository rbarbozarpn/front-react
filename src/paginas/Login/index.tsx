import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, InputGroup, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie'; 

function Login() {
    const history = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [cookies, setCookie] = useCookies(['user', 'cpf', 'nome']);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const embaralha = (valor) => {
        return valor.split('').reverse().join('');
    }

    const setEncodedCookie = (nome, valor, opcoes) => {
        const encodeValor = btoa(encodeURIComponent(embaralha(valor)));
        setCookie(nome, encodeValor, opcoes);
    }

    const login = async () => {
        setIsLoading(true);
        const usuario = {
            'cpf': cpf,
            'senha': senha
        };

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

                const data = await response.json();

                if(data.cod === "ok"){
                    // setCookie('user', data.usuario.id, { path: '/' });
                    setEncodedCookie('d_mt', cpf, { path: '/' });
                    setEncodedCookie('a_fo', data.usuario.nome, { path: '/' });
                    // setCookie('cpf', cpf, { path: '/' });
                    // setCookie('nome', data.usuario.nome, { path: '/' });
                    setIsAuthenticated(true);
                    history('/menu');
                }else{
                    setAlertVariant('danger');
                    setAlertMessage(data.retorno);
                    setShowAlert(true);
                    setTimeout(() => {
                    history('/login');
                }, 3000);
                    
                }

               
            setIsLoading(false);
        } catch (error) {
            console.error('Erro na requisição:', error);
            setIsLoading(false);
        }
    };

    return (
        <Container className="custom-container" style={{ marginTop: '80px' }}>
            <Row className="justify-content-md-center d-flex align-items-center">
            <Alert variant={alertVariant} show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                {alertMessage}
            </Alert>
                <Col xs={12} md={6} lg={4}>
                <div className="text-center mb-4">
                    <img src='assets/imagens/GrupoCellular_1_Colorido.png' alt="Sistema VPI'" style={{ maxWidth: '100%' }} />
                </div>

                    <Form className="rounded border p-4 shadow">
                        <Form.Group className="mb-3" controlId="cpf">
                            <strong><Form.Label>CPF</Form.Label></strong>
                            <Form.Control type="cpf" placeholder="" value={cpf} onChange={(e) => setCpf(e.target.value)}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="senha">
                            <strong><Form.Label>Senha</Form.Label></strong>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder=""
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                                <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                    {showPassword ? <EyeSlash /> : <Eye />}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        {isLoading ? (
                            <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : (
                            <Button variant="primary" onClick={login} className="w-100 mt-3 btn-custom" style={{ backgroundColor: '#c52a35', borderColor: '#c52a35', color: 'cor-do-texto-desejada' }}>
                            Entrar
                            </Button>
                        )}

                        <div className="mt-3 text-center">
                            <Link to="/registrar" className="btn btn-outline-primary btn-custom mr-2" style={{ borderColor: '#c52a35', color: '#c52a35' }}>
                                Registrar
                            </Link>
                            <Link to="/reset" className="btn btn-link" style={{color: '#c52a35' }}>
                                Esqueceu a senha?
                            </Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
