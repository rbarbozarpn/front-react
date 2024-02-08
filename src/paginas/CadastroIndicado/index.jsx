import { useRef, useState, useEffect } from 'react'
import { v4 } from 'uuid'
import { Button, Form, Container, Row, Col, Card, Modal, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../SideBar';
import { useCookies } from 'react-cookie';

function CadastroIndicado () {
    const navigate = useNavigate();
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [linkWhatsapp, setLinkWhatsapp] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // "'d_mt' é o CPF, 'a_fo' é o nome" 
    const [cookies] = useCookies(['user', 'd_mt', 'a_fo']);
 
    /**IMPORTANTE VERIFICAÇÃO SE É UM UM USUÁRIO VALIDO */
    const verificarUsuarioValido = () => {
        if (cookies.d_mt === 'undefined') {
            
            navigate('/login');
        }
    };

    /**Decodificar o Cpf */
    const desembaralha = (valorEmbaralhado) => {
        return valorEmbaralhado.split('').reverse().join('');
    };

    /**GERA O LINK PARA WHATSAPP */
    const gerarLinkWhatsapp = (telefone, token) => {
        return `https://api.whatsapp.com/send?phone=55${telefone}&text=http://127.0.0.1:8000/api/cad_indicado`;
    };

    /**SALVA O INDICADO  */
    const salvar = async () => {
        setIsLoading(true);
        const indicado = {
            'nome':nome,
            'telefone':telefone,
            'email':email
        }
    
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/adicionarUsuarioIndicado/${desembaralha(decodeURIComponent(atob(cookies.d_mt)))}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
              indicado
            )
          });
  
            const data = await response.json();
            

            if(data.cod === 'ok'){
                const novoLink = gerarLinkWhatsapp(telefone);
                setLinkWhatsapp(novoLink);
                setShowModal(true);
                setNome('');
                setTelefone('');
                setEmail('');
                setIsLoading(false);
            }else{
                setAlertVariant('success');
                setAlertMessage(data.mensagem);
                setShowAlert(true);
                setTimeout(() => {
                    navigate('/cadastro_indicado');
                }, 3000); 
                setIsLoading(false);
            }
         
        setIsLoading(false);
        } catch (error) {
          console.error('Erro na requisição:', error);
          setIsLoading(false);
        }
    };

    /**FECHA O MODAL */
    const handleCloseModal = () => {
        // Fecha o modal
        setShowModal(false);
    };

    /**VERIFICANDO SE O USUÁRIO É VALIDO */
    useEffect(() => {
        verificarUsuarioValido(); 
       
    }, [cookies.d_mt, navigate]);

    return (
        
        <Container fluid>
        
        <Sidebar /> {/*CODIGO DO SIDEBAR */}
            <Alert variant={alertVariant} show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                {alertMessage}
            </Alert> {/*CODIGO DA DIV COM A MENSAGEM DE ALERT */}
            <Row>
                <Col md={4}>
                    <div className="text-center d-flex justify-content-center align-items-center mb-4" style={{ height: '100%' }}>
                        <img src='assets/imagens/GrupoCellular_1_Colorido.png' alt="Sistema VPI'" style={{ maxWidth: '100%' }}/>
                    </div>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                    <Card.Header style={{ backgroundColor: '#c52a35', borderColor: '#c52a35', color: '#fff' }}><h2>Convidar Amigo</h2></Card.Header>
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

                            {isLoading ? (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            ) : (
                                <Button variant="primary" onClick={salvar} className="w-100 mt-3 btn-custom" style={{ backgroundColor: '#c52a35', borderColor: '#c52a35', color: 'cor-do-texto-desejada' }}>
                                Cadastrar
                                </Button>
                            )}
                        </Form>
                        </Card.Body>
                    </Card> 
                </Col>
                
                <Col md={4}>
                    <div className="text-center d-flex justify-content-center align-items-center mb-4" style={{ height: '100%' }}>
                        <img src='assets/imagens/Selo.png' alt="Sistema VPI'" style={{ maxWidth: '100%' }} />
                    </div>
                </Col>
            </Row>
            <Modal show={showModal} onHide={handleCloseModal}>{/*MODAL COM O LINK DO WHATSAPP */}
                <Modal.Header closeButton>
                <Modal.Title>Link do WhatsApp gerado com sucesso!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                Clique no botão abaixo para compartilhar o link via WhatsApp.
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Fechar
                </Button>
                
                <Button variant="primary" onClick={() => window.open(linkWhatsapp, '_blank')}>
                    Compartilhar
                </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default CadastroIndicado