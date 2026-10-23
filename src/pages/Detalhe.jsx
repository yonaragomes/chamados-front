import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import { mensagemDeErro } from "../services/erros"

function Detalhe() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [chamado, setChamado] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const [responsavel, setResponsavel] = useState("")
  const [solucao, setSolucao] = useState("")
  const [erroAcao, setErroAcao] = useState(null)
  const [confirmando, setConfirmando] = useState(false)

  useEffect(() => {
    async function carregarChamado() {
      try {
        const resposta = await api.get(`/chamados/${id}`)
        setChamado(resposta.data)
      } catch (e) {
        console.log(e)
        setErro(mensagemDeErro(e, "Não foi possível carregar este chamado."))
      } finally {
        setCarregando(false)
      }
    }
    carregarChamado()
  }, [id])

  async function recarregar() {
    const resposta = await api.get(`/chamados/${id}`)
    setChamado(resposta.data)
  }

  async function iniciar(e) {
    e.preventDefault()
    setErroAcao(null)
    try {
      await api.patch(`/chamados/${id}/iniciar`, { responsavel })
      setResponsavel("")
      await recarregar()
    } catch (err) {
      console.log(err)
      setErroAcao(mensagemDeErro(err, "Não foi possível iniciar o atendimento."))
    }
  }

  async function resolver(e) {
    e.preventDefault()
    setErroAcao(null)
    try {
      await api.patch(`/chamados/${id}/resolver`, { solucao })
      setSolucao("")
      await recarregar()
    } catch (err) {
      console.log(err)
      setErroAcao(mensagemDeErro(err, "Não foi possível resolver o chamado."))
    }
  }

  async function excluir() {
    setErroAcao(null)
    try {
      await api.delete(`/chamados/${id}`)
      navigate("/")
    } catch (err) {
      console.log(err)
      setErroAcao(mensagemDeErro(err, "Não foi possível excluir o chamado."))
      setConfirmando(false)
    }
  }

  if (carregando) return <p className="aviso">Carregando chamado...</p>

if (erro) {
  return (
    <main>
      <p className="aviso erro">{erro}</p>
      <Link to="/" className="voltar">← Voltar</Link>
    </main>
  )
}

if (!chamado) return null

return (
  <main>
    <Link to="/" className="voltar">← Voltar</Link>

    <div className="detalhe">
      <div className="card-topo">
        <h2>{chamado.titulo}</h2>
        <span className={`badge ${chamado.status.replace(" ", "-")}`}>
          {chamado.status}
        </span>
      </div>
      <p className="prio">Prioridade {chamado.prioridade}</p>

      <dl className="campos">
        <dt>Descrição</dt>
        <dd>{chamado.descricao}</dd>
        <dt>Tipo</dt>
        <dd>{chamado.tipo}</dd>
        <dt>Local</dt>
        <dd>{chamado.local}</dd>
        <dt>Aberto em</dt>
        <dd>{chamado.data_abertura}</dd>
        {chamado.responsavel && (
          <>
            <dt>Responsável</dt>
            <dd>{chamado.responsavel}</dd>
          </>
        )}
        {chamado.solucao && (
          <>
            <dt>Solução</dt>
            <dd>{chamado.solucao}</dd>
          </>
        )}
      </dl>

      <div className="acoes">
        {chamado.status !== "resolvido" && (
          <Link to={`/editar/${id}`} className="botao botao-sec">Editar</Link>
        )}

        {confirmando ? (
          <div className="confirma">
            <p>Tem certeza que deseja excluir este chamado?</p>
            <button className="botao-sec perigo" onClick={excluir}>Excluir</button>
            <button className="botao-sec" onClick={() => setConfirmando(false)}>Cancelar</button>
          </div>
        ) : (
          <button className="botao-sec perigo" onClick={() => setConfirmando(true)}>Excluir</button>
        )}
      </div>
    </div>

    {chamado.status === "aberto" && (
      <div className="etapa">
        <form onSubmit={iniciar}>
          <h3>Próxima etapa: iniciar atendimento</h3>
          <input
            type="text"
            placeholder="Responsável"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
          />
          <button type="submit">Iniciar</button>
        </form>
      </div>
    )}

    {chamado.status === "em andamento" && (
      <div className="etapa">
        <form onSubmit={resolver}>
          <h3>Próxima etapa: resolver</h3>
          <textarea
            placeholder="Solução"
            value={solucao}
            onChange={(e) => setSolucao(e.target.value)}
          />
          <button type="submit">Resolver</button>
        </form>
      </div>
    )}

    {erroAcao && <p className="aviso erro">{erroAcao}</p>}
  </main>
)
}

export default Detalhe