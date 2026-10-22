import { Routes, Route } from "react-router-dom"
import Cabecalho from "./components/Cabecalho"
import Home from "./pages/Home"
import Detalhe from "./pages/Detalhe"
import FormularioPage from "./pages/FormularioPage"

function App() {
  return (
    <>
      <Cabecalho />
      <Routes>
        // liga um caminho a uma tela
        <Route path="/" element={<Home />} />
        <Route path="/chamado/:id" element={<Detalhe/>} />
        <Route path="/novo" element={<FormularioPage />} />
        <Route path="/editar/:id" element={<FormularioPage />} />
      </Routes>
    </>
  )
}

export default App