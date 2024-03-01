import { useRef, useState, useEffect } from 'react'
import { Container, Navbar, Offcanvas, Nav, NavDropdown, Button } from 'react-bootstrap';
import { FaHome, FaUserPlus, FaEdit, FaBars, FaSearch } from 'react-icons/fa';
import { BsBoxArrowRight, BsGearFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './style.css';

const Sidebar = () => {
    // "'d_mt' é o CPF, 'a_fo' é o nome" 
    const [cookies, removeCookie] = useCookies(['user', 'd_mt', 'a_fo']);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const desembaralha = (valorEmbaralhado) => {
        return valorEmbaralhado.split('').reverse().join('');
    };

    const handleLogout = () => {
        // Adicione lógica de logout aqui
        // Por exemplo, remova os cookies e redirecione para a página de login
        removeCookie('user');
        removeCookie('d_mr');
        removeCookie('a_fo');
        // Redireciona para a página de login
        window.location.href = '/login';
    };

    return (
        <>
            {[false].map((expand) => (
                <Navbar key={expand} expand={expand} className="bg-body-tertiary bg-body-tertiary-custom mb-3">
                    <Container fluid>
                        <Navbar.Offcanvas
                            show={show} onHide={handleClose}
                            style={{ backgroundColor: '#c52a35', color: '#ffffff' }}
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                <div className="text-center mb-4">
                                    <img src='assets/imagens/GrupoCellular_1_Branco.png' alt="Sistema VPI'" style={{ maxWidth: '100%' }} />
                                </div>
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <Nav.Link href="/menu"><FaHome /> Início</Nav.Link>
                                    <Nav.Link href="/cadastro_indicado"><FaUserPlus /> Indique um Amigo</Nav.Link>
                                    <Nav.Link href="/consulta"><FaSearch /> Suas indiações</Nav.Link>
                                    <Nav.Link href="/cad_indicado"><FaUserPlus /> Cadastro indicado ( Retirar ao final )</Nav.Link>
                                    <Nav.Link href="/editar"><FaEdit /> Minhas Infomarções</Nav.Link>
                                    <NavDropdown.Item onClick={handleLogout}><BsBoxArrowRight /> Sair</NavDropdown.Item>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                        <Button variant="" onClick={handleShow} >
                            <FaBars style={{ color: 'white', marginRight: '5px', borderColor: '#fff !important'}} />
                        </Button>
                        <Navbar.Brand href="#" style={{ backgroundColor: '#c52a35', color: '#ffffff' }} >{desembaralha(decodeURIComponent(atob(cookies.a_fo)))}</Navbar.Brand>
                    </Container>
                </Navbar>
            ))}
        </>
    );
}

export default Sidebar;
