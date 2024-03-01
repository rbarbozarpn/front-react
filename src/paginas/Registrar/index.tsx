import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import InputMask from 'react-input-mask';

function Registrar() {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [disableFields, setDisableFields] = useState(false); 

    const handleCpfChange = (e) => {
        const newCpf = e.target.value.replace(/\D/g, '');
        setCpf(newCpf);
        setShowAlert(false);
        
        if (newCpf.length === 11) {
            setDisableFields(false);
            validarUsuario(newCpf);    
        }
    };

    const validarUsuario = async (cpf) => {
        try {

            const response = await fetch('https://sistema.api.vpi.cellular.com.br/api/validarUsuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [btoa('cpf')]: btoa(cpf) }), // Envie o CPF no corpo da requisição
            });

            const data = await response.json();

            const usuariosDecodificados = data.resposta.map(usuarioCodificado => {
                const usuarioString = atob(usuarioCodificado);
                return JSON.parse(usuarioString);
            });

            if (data.status !== "ok") {
                setAlertVariant('danger');
                setAlertMessage(data.mensagem);
                setShowAlert(true);
                setDisableFields(true);
            }
        } catch (error) {
            console.error('Erro na consulta:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const salvar = async () => {
        const usuario = {
            [btoa('cpf')]: btoa(cpf),
            [btoa('senha')]: btoa(senha)
        };

        try {
            const response = await fetch(`https://sistema.api.vpi.cellular.com.br/api/registrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.json();

                if(data.cod === 'ok'){
                    setAlertVariant('success');
                    setAlertMessage(data.mensagem);
                    setShowAlert(true);
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000); 
                }else{
                    setAlertVariant('danger');
                    setAlertMessage(data.mensagem);
                    setShowAlert(true);
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                }

                
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    return (
        <Container className="custom-container" style={{ marginTop: '80px' }}>
            <Alert variant={alertVariant} show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                {alertMessage}
            </Alert>
            <Row className="justify-content-md-center d-flex align-items-center">
                <Col xs={12} md={6} lg={4}>
                    <div className="text-center mb-4">
                        <h2 style={{ color: '#fc404d', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '2em' }}>Registrar</h2>
                    </div>
                    <Form className="rounded border p-4 shadow">
                        <Form.Group className="mb-3" controlId="cpf">
                            <strong><Form.Label>CPF</Form.Label></strong>
                            <Form.Control type="cpf" placeholder="" value={cpf} onChange={handleCpfChange} as={InputMask} mask="999.999.999-99"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="senha">
                            <strong><Form.Label>Senha</Form.Label></strong>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder=""
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    disabled={disableFields} // Desabilita o campo de senha se disableFields for true
                                />
                                <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                    {showPassword ? <EyeSlash /> : <Eye />}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        {/* <div className="mt-3 text-center">
                            <Button variant="primary" className="w-100 mt-3 btn-custom" onClick={salvar} disabled={disableFields}>Criar</Button>
                        </div> */}

                        <Button variant="primary" onClick={salvar} disabled={disableFields} className="w-100 mt-3 btn-custom" style={{ backgroundColor: '#c52a35', borderColor: '#c52a35', color: 'cor-do-texto-desejada' }}>
                            Criar
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Registrar;
