import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

function Cabecalho() {
  const [usuario, setUsuario] = useState(null) // cria o estado usuario, vazio no começo, porque a resposta ainda não chegou

  // roda dps da primeira renderização, que é o momento ceto para buscar dados
  useEffect(() => {
    async function carregarUsuario() {
      try {
        const resposta = await api.get("/eu")
        setUsuario(resposta.data) // guarda o objeto, e a mudança de estado faz o componente renderizar de novo, agora com os dados.
      } catch (erro) {
        console.log(erro)
      } // try/catch evita que um erro derrube a tela, apenas mostra no console
    }
    carregarUsuario()
  }, [])

  return (
    <header>
      <Link to="/">Chamados</Link>
      {usuario && <span>Olá, {usuario.nome}</span>}
      // mostra o nome só quando usuario existe. sem isso, na primeira renderização usuario.nome quebraria a tela, porque null não tem .nome
    </header>
  )
}

export default Cabecalho