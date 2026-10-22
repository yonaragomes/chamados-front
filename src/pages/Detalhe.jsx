import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import api from "../services/api"

function Detalhe() {
  const { id } = useParams()
  const [chamado, setChamado] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function carregarChamado() {
      try {
        const resposta = await api.get(`/chamados/${id}`)
        setChamado(resposta.data)
      } catch (e) {
        setErro("Não foi possível carregar este chamado.")
      } finally {
        setCarregando(false)
      }
    }
    carregarChamado()
  }, [id])

  if (carregando) return <p>Carregando chamado...</p>
  if (erro) {
    return (
      <main>
        <p>{erro}</p>
        <Link to="/">← Voltar</Link>
      </main>
    )
  }

  return (
    <main>
      <Link to="/">← Voltar</Link>
      <h2>{chamado.titulo}</h2>
      <p>{chamado.status} · {chamado.prioridade}</p>
      <p>Descrição: {chamado.descricao}</p>
      <p>Tipo: {chamado.tipo}</p>
      <p>Local: {chamado.local}</p>
      <p>Aberto em: {chamado.data_abertura}</p>
      {chamado.responsavel && <p>Responsável: {chamado.responsavel}</p>}
      {chamado.solucao && <p>Solução: {chamado.solucao}</p>}
      {chamado.status !== "resolvido" && <Link to={`/editar/${id}`}>Editar</Link>}
    </main>
  )
}

export default Detalhe