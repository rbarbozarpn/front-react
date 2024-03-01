import { useRef, useState, useEffect } from 'react'
import { v4} from 'uuid'
import { Button, Form, Container, Row, Col, Card, FloatingLabel, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Sidebar from '../SideBar';
import InputMask from 'react-input-mask';

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
    const [isLoading, setIsLoading] = useState(false);
    const [allFieldsFilled, setAllFieldsFilled] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState('success'); // 'success', 'danger', etc.
    const [alertMessage, setAlertMessage] = useState('');

    const handleTelChange = (e) => {
        const tel = e.target.value.replace(/\D/g, '');
        setTelefone(tel);
        buscarUsuario(tel);
    };

    const buscarUsuario = async (tel) => {
        try {

            const response = await fetch(`https://sistema.api.vpi.cellular.com.br/api/usuario_ind`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ [btoa('tel')] : btoa(tel)})
            });
    
            const data = await response.json();

            /**Decodificando a resposta da api */
            const usuariosDecodificados = data.resposta.map(usuarioCodificado => {
                const usuarioString = atob(usuarioCodificado);
                return JSON.parse(usuarioString);
            });

            
          setNome(usuariosDecodificados["0"].nome);
          setEmail(usuariosDecodificados["0"].email);
          setCpf(usuariosDecodificados["0"].cpf);
          setEstado(usuariosDecodificados["0"].estado);
          setOperadora(usuariosDecodificados["0"].operadora);
          setModelo(usuariosDecodificados["0"].modelo);
          setCidade(usuariosDecodificados["0"].cidade);
          setId(usuariosDecodificados["0"].id);

          
        } catch (error) {
          console.error('Erro na consulta:', error);
        }
    };

    const atualizar = async () => {
        if (!allFieldsFilled) {
            setAlertVariant('danger');
            setAlertMessage('Por favor, preencha todos os campos antes de salvar.');
            setShowAlert(true);
            return;
        }  


        setIsLoading(true);
        const cpfHabilitado = await verificarCPF(cpf); // Verifica se o CPF está habilitado
        

        if (cpfHabilitado) {
            const usuario = {
            [btoa('nome')]: btoa(nome),
            [btoa('telefone')]: btoa(telefone),
            [btoa('cpf')]: btoa(cpf),
            [btoa('email')]: btoa(email),
            [btoa('estado')]: btoa(estado),
            [btoa('cidade')]: btoa(cidade),
            [btoa('operadora')]: btoa(operadora),
            [btoa('modelo')]: btoa(modelo),
            [btoa('id')] : btoa(id)
            }
        
            try {
            const response = await fetch(`https://sistema.api.vpi.cellular.com.br/api/atualizaUsuarioIndicado`, {
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
                console.log(data);
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
            setIsLoading(false);
            } catch (error) {
            console.error('Erro na requisição:', error);
            setIsLoading(false);
            }
        }
    };

    const verificarCamposPreenchidos = () => {
        if (nome && telefone && cpf && email && estado && cidade && operadora) {
            setAllFieldsFilled(true);
        } else {
            setAllFieldsFilled(false);
        }
    };

    const verificarCPF = async (cpf) => {
        setIsLoading(true);
    
        const usuario = {
            [btoa('cpf')]: btoa(cpf),
        }
    
        try {
            const response = await fetch(`https://sistema.api.vpi.cellular.com.br/api/valida_cpf`, {
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
                console.log(data);
    
                setIsLoading(false);
    
                if (data.cod === 'ok') {
                    return true; // Retorna true se o CPF estiver habilitado
                } else {
                    // Exibe uma mensagem indicando que o CPF não está habilitado
                    setAlertVariant('danger');
                    setAlertMessage(data.mensagem);
                    setShowAlert(true);
                    return false; // Retorna false se o CPF não estiver habilitado
                }
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            setIsLoading(false);
            return false; // Retorna false em caso de erro na requisição
        }
    };

    const handleCpfChange = (e) => {
        setShowAlert(false);
        const newCpf = e.target.value.replace(/\D/g, '');
        setCpf(newCpf);

        if (newCpf.length === 11) {
            verificarCPF(newCpf);
        }

    }
    

    useEffect(() => {
        verificarCamposPreenchidos();
    }, [nome, telefone, cpf, email, estado, cidade, operadora]);
      
 
    return (
        <Container fluid className="my-5">   
            <Row>
                <Col md={4}>
                    <div className="text-center d-flex justify-content-center align-items-center mb-4" style={{ height: '100%' }}>
                        <img src='assets/imagens/GrupoCellular_1_Colorido.png' alt="Sistema VPI'" style={{ maxWidth: '100%' }}/>
                    </div>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                    <Card.Header style={{ backgroundColor: '#c52a35', borderColor: '#c52a35', color: '#fff' }}><h2>Cadastro</h2></Card.Header>
                        <Card.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formGroupTelefone">
                                <Form.Label>Telefone</Form.Label>
                                <Form.Control type="text" placeholder="" value={telefone} onChange={handleTelChange} as={InputMask} mask="(99)9 9999-9999"/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGroupNome">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" placeholder="" value={nome} onChange={(e) => setNome(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGroupCpf">
                                <Form.Label>Cpf</Form.Label>
                                <Form.Control type="text" placeholder="" value={cpf} onChange={handleCpfChange}  as={InputMask} mask="999.999.999-99" onBlur={() => verificarCPF(cpf)} />
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
                                    <option value="vivo">Vivo</option>
                                    <option value="outra">Outra</option>
                                </Form.Select>
                            </FloatingLabel>
                            <Form.Group className="mb-3" controlId="formGroupModelo">
                                <Form.Label>Modelo</Form.Label>
                                <Form.Control type="text" placeholder="" value={modelo} onChange={(e) => setModelo(e.target.value)}/>
                            </Form.Group>
                            {isLoading ? (
                                <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            ) : (
                                <Button variant="primary" className="mt-4" onClick={atualizar} style={{ backgroundColor: '#c52a35', borderColor: '#c52a35', color: 'cor-do-texto-desejada' }}>Salvar</Button>
                            )}
                            
                        </Form>
                        <br />
                        <Alert variant={alertVariant} show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                            {alertMessage}
                        </Alert>
                        </Card.Body>
                    </Card> 
                </Col>
                <Col md={4}>
                    <div className="text-center d-flex justify-content-center align-items-center mb-4" style={{ height: '100%' }}>
                        <img src='assets/imagens/Selo.png' alt="Sistema VPI'" style={{ maxWidth: '100%' }} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default CadIndicado