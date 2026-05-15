import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Cotizador from './pages/Cotizador'
import Seguimiento from './pages/Seguimiento'
import PanelTecnico from './pages/PanelTecnico'
import ProgramarRetiro from './pages/ProgramarRetiro'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cotizador" element={<Cotizador />} />
          <Route path="programar-retiro/:id" element={<ProgramarRetiro />} />
          <Route path="seguimiento" element={<Seguimiento />} />
          <Route path="panel" element={<PanelTecnico />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
