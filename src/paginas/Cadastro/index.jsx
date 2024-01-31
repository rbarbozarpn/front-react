import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-modal';

function Cadastro() {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [usuario, setDadosUsuario] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const buscarUsuario = async (cpf) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/busca_cpf/${cpf}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do usuário.');
      }

      const data = await response.json();
      
      setDadosUsuario(data['usuario']);
      setNome(data['usuario'].nome);
      setTelefone(data['usuario'].telefone);
      setEmail(data['usuario'].email);
      
    } catch (error) {
      console.error('Erro na consulta:', error);
    }
  };

  const salvar = async (newCpf) => {
    
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/addUsuarioIndicador/${cpf}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            // Your data goes here
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.json();
          openModal();
        }
    
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
  };

  const handleCpfChange = (e) => {
    const newCpf = e.target.value;
    setCpf(newCpf);

    // Chama a função buscarUsuario ao alterar o valor do campo CPF
    buscarUsuario(newCpf);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  return (
    <Container fluid="md" style={{ marginTop: '50px' }}>
      <Row>
        <Col>
          <Link to="/">
            <Button variant="info" className="mx-2">
              Voltar
            </Button>
          </Link>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Header>Cadastro</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formGroupCpf">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control type="text" value={cpf} onChange={handleCpfChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupNome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupTelefone">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Button variant="primary" onClick={salvar}>Adicionar</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col></Col>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Cadastro Realizado!!!"
        >
          <h2>Cadastro Realizado!!!</h2>
          <p>Clique no botão abaixo para começar a indicar.</p>
          <Link to={`/cadastro_indicado`} target="_blank">
            <Button variant="primary">Indicar</Button>
          </Link>
        </Modal>
      </Row>
    </Container>
  );
}

export default Cadastro;
