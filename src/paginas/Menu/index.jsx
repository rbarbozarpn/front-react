import { useRef, useState } from 'react'
import { Button, Form, Container, Row, Col, Card, FloatingLabel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Menu () {
    return (
        <Container fluid="md" style={{ marginTop: '50px' }}>
            <Row>   
                <Col>

                <Card className="text-center">
                    <Card.Header>MENU</Card.Header>
                    <Card.Body>
                        <Card.Title>Selecione a opção desejada</Card.Title>
                        <Link to="/cadastro"><Button variant="info" className="mx-2">Cadastrar</Button></Link>
                        <Link to="/cadastro_indicado"><Button variant="info" className="mx-2">Indicar</Button></Link>
                        <Link to="/cad_indicado"><Button variant="info" className="mx-2">Cadatsro Indicado</Button></Link>
                        <Link to="/consulta"><Button variant="info" className="mx-2">Consulta</Button></Link>
                    </Card.Body>
                </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Menu