import React from 'react';
import { Container, Navbar, Offcanvas, Nav, NavDropdown, Button } from 'react-bootstrap';
import { FaHome, FaUserPlus, FaEdit } from 'react-icons/fa';
import { BsBoxArrowRight, BsGearFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Sidebar = () => {
    // "'d_mt' é o CPF, 'a_fo' é o nome" 
    const [cookies, removeCookie] = useCookies(['user', 'd_mt', 'a_fo']);

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
                <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
                    <Container fluid>
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${expand}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                            placement="start"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                    Sistema VPI
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <Nav.Link href="/"><FaHome /> Início</Nav.Link>
                                    <Nav.Link href="/cadastro_indicado"><FaUserPlus /> Cadastrar Indicados</Nav.Link>
                                    <Nav.Link href="/cad_indicado"><FaUserPlus /> Cadastro indicado</Nav.Link>
                                    <Nav.Link href="/editar"><FaEdit /> Trocar Senha</Nav.Link>
                                    <NavDropdown.Item onClick={handleLogout}><BsBoxArrowRight /> Sair</NavDropdown.Item>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                        <Navbar.Brand href="#">{desembaralha(decodeURIComponent(atob(cookies.a_fo)))}</Navbar.Brand>
                    </Container>
                </Navbar>
            ))}
        </>
    );
}

export default Sidebar;
