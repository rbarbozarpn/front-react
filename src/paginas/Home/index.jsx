import { useRef, useState } from 'react'
import { v4} from 'uuid'
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const inputRef = useRef();

  const [produtos, setProdutos] = useState([]);

  const alerta = () => {
    
    setProdutos([{ id: v4(), nome: inputRef.current.value},...produtos]);
    inputRef.current.value = ''
  }

  const deletar = (id) => {
    setProdutos(produtos.filter(produto => produto.id !== id))
  }

  return (
    <div>
      <h1>Home</h1>
      <Form.Control type="text" ref={inputRef}/><br /><br />
      <Button variant="primary" onClick={alerta}>Adicionar</Button><br />

      {
        produtos.map( produto => (
          <div key={produto.id}>
            <p>{produto.nome}</p>
            <Button variant="danger" onClick={() => deletar(produto.id)}>🗑️</Button>
          </div>
        ))
      }
    </div>
  )
}

export default Home
