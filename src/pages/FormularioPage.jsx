import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../services/api"
import { mensagemDeErro } from "../services/erros"

function FormularioPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tipo, setTipo] = useState("")
  const [local, setLocal] = useState("")
  const [prioridade, setPrioridade] = useState("")
  const [dataAbertura, setDataAbertura] = useState("")

  const [tipos, setTipos] = useState([])
  const [locais, setLocais] = useState([])
  const [prioridades, setPrioridades] = useState([])

  const [carregando, setCarregando] = useState(editando)
  const [resolvido, setResolvido] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // opções dos selects
  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const respTipos = await api.get("/tipos")
        setTipos(respTipos.data)
        const respLocais = await api.get("/locais")
        setLocais(respLocais.data)
        const respPrioridades = await api.get("/prioridades")
        setPrioridades(respPrioridades.data)
      } catch (err) {
        console.log(err)
      }
    }
    carregarOpcoes()
  }, [])

  // no modo editar: busca o chamado e preenche os campos
  useEffect(() => {
    if (!id) return
    async function carregarChamado() {
      try {
        const resposta = await api.get(`/chamados/${id}`)
        const c = resposta.data
        if (c.status === "resolvido") setResolvido(true)
        setTitulo(c.titulo)
        setDescricao(c.descricao || "")
        setTipo(c.tipo)
        setLocal(c.local)
        setPrioridade(c.prioridade)
        setDataAbertura(c.data_abertura)
      } catch (err) {
        console.log(err)
        setErro(mensagemDeErro(err, "Não foi possível carregar este chamado."))
      } finally {
        setCarregando(false)
      }
    }
    carregarChamado()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setSucesso(null)
    setEnviando(true)
    try {
      const dados = {
        titulo,
        descricao,
        tipo,
        local,
        prioridade,
        data_abertura: dataAbertura
      }
      if (editando) {
        await api.put(`/chamados/${id}`, dados)
        setSucesso("Chamado atualizado com sucesso!")
      } else {
        await api.post("/chamados", dados)
        setSucesso("Chamado aberto com sucesso!")
      }
      setTimeout(() => navigate("/"), 1500)
    } catch (err) {
      console.log(err)
      setErro(mensagemDeErro(err, "Não foi possível salvar. Confira os campos."))
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) return <p>Carregando chamado...</p>

  if (resolvido) {
    return (
      <main>
           <p className="aviso erro">Chamados resolvidos não podem ser editados.</p>
            <Link to="/" className="voltar">← Voltar</Link>
      </main>
    )
  }

  return (
    <main>
      <h2>{editando ? "Editar chamado" : "Abrir chamado"}</h2>

      <form onSubmit={handleSubmit}>
        <label>Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label>Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <label>Tipo</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Selecione...</option>
          {tipos.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <label>Local</label>
        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option value="">Selecione...</option>
          {locais.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <label>Prioridade</label>
        <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
          <option value="">Selecione...</option>
          {prioridades.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <label>Data de abertura</label>
        <input
          type="date"
          value={dataAbertura}
          onChange={(e) => setDataAbertura(e.target.value)}
        />

        {erro && <p className="aviso erro">{erro}</p>}
        {sucesso && <p className="aviso sucesso">{sucesso}</p>}

        <div className="acoes">
            <button type="submit" disabled={enviando}>Salvar</button>
            <Link to="/" className="botao botao-sec">Cancelar</Link>
        </div>
      </form>
    </main>
  )
}

export default FormularioPage