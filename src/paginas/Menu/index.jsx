import { useRef, useState, useEffect } from 'react'
import { Button, Form, Container, Row, Col, Card, FloatingLabel, Table, Image, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../SideBar';
import { useCookies } from 'react-cookie';
import QRCode from 'react-qr-code';
import { IoMdQrScanner } from 'react-icons/io';

import './style.css';


function Menu () {
    const variant = 'Light';

    const [dadosUsuario, setDadosUsuario] = useState(null);
    const [dadosVouchers, setDadosVoucher] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [qrcodeValue, setQrcodeValue] = useState('');
    const [selectedToken, setSelectedToken] = useState('');
    const [showQRCodeModal, setShowQRCodeModal] = useState(false);

    const handleAbrirModal = () => setShowModal(true);
    const handleFecharModal = () => {
        setShowModal(false);
        setShowQRCodeModal(false);
      };

    const handleAbrirModalQRCode = (token) => {
        setQrcodeValue(token);
        setShowQRCodeModal(true);
      };

    const formatPhoneNumber = (phoneNumber) => {
    // Verifica se o número de telefone tem pelo menos 10 dígitos
    if (phoneNumber && phoneNumber.length >= 10) {
        // Formata o número de telefone
        return `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 3)} ${phoneNumber.substring(3, 7)}-${phoneNumber.substring(7)}`;
    }
    return phoneNumber; // Retorna o número de telefone sem formatação se for inválido
    };

    // "'d_mt' é o CPF, 'a_fo' é o nome", 'b_ac' é o telefone, j_hk é o email 
    const [cookies] = useCookies(['user', 'd_mt', 'a_fo', 'b_ac', 'j_hk']);
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
            
            const response = await fetch('https://sistema.api.vpi.cellular.com.br/api/buscar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [btoa('cpf')]: btoa(desembaralha(decodeURIComponent(atob(cookies.d_mt)))) }), // Envie o CPF no corpo da requisição
            });

            const data = await response.json();

            /**Decodificando a resposta da api */
            const usuariosDecodificados = data.resposta.map(usuarioCodificado => {
                const usuarioString = atob(usuarioCodificado);
                return JSON.parse(usuarioString);
            });
    
            setDadosUsuario(usuariosDecodificados);
              
        } catch (error) {
            console.error('Erro na consulta:', error);
        }
    };

    const buscar_vouchers = async () => {
        try {

            const response = await fetch('https://sistema.api.vpi.cellular.com.br/api/buscar_vouchers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [btoa('cpf')]: btoa(desembaralha(decodeURIComponent(atob(cookies.d_mt)))) }), // Envie o CPF no corpo da requisição
            });
            const data = await response.json();

            /**Decodificando a resposta da API */
            const vouchersDecodificados = data.resposta.map(voucherCodificado => {
                const voucherString = atob(voucherCodificado);
                return JSON.parse(voucherString);
            });

            setDadosVoucher(vouchersDecodificados);
            
        
        } catch (error) {
            console.error('Erro na consulta:', error);
        }
    }

    function formatarData(data) {
        const partesData = data.split('-');
        return `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
    }

    // console.log(cookies.cpf);

    useEffect(() => {
        verificarUsuarioValido(); 
        
        if (cookies.d_mt) {
            buscar();
            buscar_vouchers();
            
        }
    }, [cookies.cpf, navigate]);
    

    const numeroRegistros = dadosVouchers ? dadosVouchers.length : 0;
    const somaValores = dadosVouchers ? dadosVouchers.reduce((total, voucher) => total + voucher.valor, 0) : 0;


    return (
        
        <Container fluid>
            <Sidebar />
            <div className="d-flex justify-content-center align-items-center mb-5" style={{ height: '60vh' }}>
                <Image src='assets/imagens/Selo.png' fluid style={{ maxWidth: '400px', maxHeight: '400px' }} />
            </div>
            <Row className="justify-content-center">   
                <Col md={3}>
                    <Card
                        bg={variant.toLowerCase()}
                        key={variant}
                        text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                        width="auto" 
                        className="mb-2"
                        align="center"
                        
                    >
                        <Card.Header style={{ backgroundColor: '#c52a35', color: '#ffffff' }}><Card.Title onClick={handleAbrirModal}>Vouchers</Card.Title></Card.Header>
                        <Card.Body>                      
                            <Card.Text>
                                {numeroRegistros}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Modal show={showModal} onHide={handleFecharModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Meus Vouchers</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {dadosVouchers && dadosVouchers.length > 0 ? (
                            <table className="table">
                            <thead>
                                <tr>
                                <th>Código</th>
                                <th>Data Validade</th>
                                <th>Status</th>
                                <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dadosVouchers.map((item, index) => (
                                <tr key={index}>
                                    <td variant="link" onClick={() => handleAbrirModalQRCode(item.token)}><IoMdQrScanner /></td>
                                    <td>{formatarData(item.data_validade)}</td>
                                    <td>{item.situacao ? 'disponivel' : 'utilizado'}</td>
                                    <td>R${item.valor}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        ) : (
                            <p>Nenhum dado de voucher disponível.</p>
                        )}
                    </Modal.Body>

                    
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleFecharModal}>
                        Fechar
                    </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showQRCodeModal} onHide={handleFecharModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>QRCode</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="d-flex flex-column align-items-center">
                        <div className="mb-3">
                            <QRCode value={qrcodeValue} />
                        </div>
                        <div><strong><h3>{qrcodeValue}</h3></strong></div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleFecharModal}>
                        Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Col md={3}>
                    <Card
                        bg={variant.toLowerCase()}
                        key={variant}
                        text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                        width="auto" 
                        className="mb-2"
                        align="center"
                    >
                        <Card.Header style={{ backgroundColor: '#c52a35', color: '#ffffff' }}><Card.Title>Saldo Disponivel</Card.Title></Card.Header>
                        <Card.Body>
                            
                            <Card.Text>
                                R$ {somaValores.toFixed(2)}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                <Table className="mb-3 table-custom">
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
                                <td>{formatPhoneNumber(usuario.telefone)}</td>
                                <td>
                                    {usuario.situacao === 0 ? 'Pendente de cadastro' : 
                                    usuario.situacao === 1 ? 'Pendente de compra' :
                                    usuario.situacao === 2 ? 'Usuário não habilitado à promoção' :
                                    usuario.situacao === 3 ? 'Compra realizada' : ''}
                                </td>
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