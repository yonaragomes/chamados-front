import { useEffect } from "react"
import api from "./services/api"

function App() {
  useEffect(() => {
    async function testar() {
      try {
        const resposta = await api.get("/tipos")
        console.log(resposta.data)
      } catch (erro) {
        console.log("Erro:", erro)
      }
    }
    testar()
  }, [])

  return <h1>Teste</h1>
}

export default App