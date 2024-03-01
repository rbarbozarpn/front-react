import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

function Reset () {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [disableFields, setDisableFields] = useState(false); 

    const handleCpfChange = (e) => {
        const newCpf = e.target.value;
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

        try {
            const response = await fetch('https://sistema.api.vpi.cellular.com.br/api/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ [btoa('cpf')] : btoa(cpf) })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.json();

                setAlertVariant('success');
                setAlertMessage(data.mensagem);
                setShowAlert(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000); 
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
                        <h2 style={{ color: '#fc404d', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '2em' }}>Esqueceu a Senha ?</h2>
                    </div>
                    <Form className="rounded border p-4 shadow">
                        <Form.Group className="mb-3" controlId="cpf">
                            <strong><Form.Label>Digite seu CPF</Form.Label></strong>
                            <Form.Control type="cpf" placeholder="" value={cpf} onChange={handleCpfChange} />
                        </Form.Group>

                        <div className="mt-3 text-center">
                            <Button variant="primary" className="w-100 mt-3 btn-custom" onClick={salvar} disabled={disableFields}>Enviar</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Reset;
