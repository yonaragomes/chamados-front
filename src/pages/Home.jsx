import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { mensagemDeErro } from "../services/erros"

function Home() {
  const [chamados, setChamados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")
  const [tipo, setTipo] = useState("")
  const [local, setLocal] = useState("")
  const [prioridade, setPrioridade] = useState("")

  const [tipos, setTipos] = useState([])
  const [locais, setLocais] = useState([])
  const [prioridades, setPrioridades] = useState([])

  // 1) opções dos selects: busca uma vez só
  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const respTipos = await api.get("/tipos")
        setTipos(respTipos.data)
        const respLocais = await api.get("/locais")
        setLocais(respLocais.data)
        const respPrioridades = await api.get("/prioridades")
        setPrioridades(respPrioridades.data)
      } catch (e) {
        console.log(e)
      }
    }
    carregarOpcoes()
  }, [])

  // 2) lista: busca de novo quando um filtro muda
  useEffect(() => {
    async function carregarChamados() {
      setCarregando(true)
      setErro(null)
      try {
        const params = {}
        if (busca) params.busca = busca
        if (status) params.status = status
        if (tipo) params.tipo = tipo
        if (local) params.local = local
        if (prioridade) params.prioridade = prioridade
        const resposta = await api.get("/chamados", { params })
        setChamados(resposta.data)
      } catch (e) {
        console.log(e)
        setErro(mensagemDeErro(e, "Não foi possível carregar. Verifique sua chave."))
      } finally {
        setCarregando(false)
      }
    }
    carregarChamados()
  }, [busca, status, tipo, local, prioridade])

  return (
  <main>
    <div className="topo-lista">
      <h2>Chamados</h2>
      <Link to="/novo" className="botao">+ Abrir chamado</Link>
    </div>

    <div className="filtros">
      <input
        type="text"
        placeholder="Buscar por título ou descrição..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Status</option>
        <option value="aberto">aberto</option>
        <option value="em andamento">em andamento</option>
        <option value="resolvido">resolvido</option>
      </select>

      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="">Tipo</option>
        {tipos.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select value={local} onChange={(e) => setLocal(e.target.value)}>
        <option value="">Local</option>
        {locais.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
        <option value="">Prioridade</option>
        {prioridades.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>

    {carregando && <p className="aviso">Carregando chamados...</p>}
    {erro && <p className="aviso erro">{erro}</p>}
    {!carregando && !erro && chamados.length === 0 && (
      <p className="aviso">Nenhum chamado encontrado.</p>
    )}

    <div className="lista">
      {!carregando && !erro && chamados.map((chamado) => (
        <Link to={`/chamado/${chamado.id}`} className="card" key={chamado.id}>
          <div className="card-topo">
            <h3>{chamado.titulo}</h3>
            <span className={`badge ${chamado.status.replace(" ", "-")}`}>
              {chamado.status}
            </span>
          </div>
          <p className="prio">Prioridade {chamado.prioridade}</p>
        </Link>
      ))}
    </div>
  </main>
)
}

export default Home