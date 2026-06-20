import { useState } from 'react'
import { BookOpen, Settings2, BarChart3 } from 'lucide-react'
import { useData } from './hooks/useData'
import CatalogPage   from './pages/CatalogPage'
import GestionPage   from './pages/GestionPage'
import InventarioPage from './pages/InventarioPage'

const TABS = [
  { id: 'catalogo',   label: 'Catálogo',   icon: BookOpen   },
  { id: 'gestion',    label: 'Gestión',     icon: Settings2  },
  { id: 'inventario', label: 'Inventario',  icon: BarChart3  },
]

export default function App() {
  const [tab, setTab] = useState('catalogo')
  const data = useData()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <div style={{
        background: 'var(--black)', color: 'var(--white)',
        padding: '0 24px', display: 'flex', alignItems: 'center', gap: 24,
        position: 'sticky', top: 0, zIndex: 200,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 24, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{
            background: 'var(--accent)', color: 'var(--black)',
            fontWeight: 900, fontSize: 10, padding: '2px 8px',
            borderRadius: 3, letterSpacing: '0.1em',
          }}>CAT</span>
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-0.01em' }}>Catálogo</span>
        </div>

        {/* Tabs */}
        <nav style={{ display: 'flex', height: 56 }}>
          {TABS.map(t => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  background: 'none', border: 'none',
                  color: active ? 'var(--accent)' : 'rgba(255,255,255,0.5)',
                  fontWeight: active ? 800 : 500,
                  fontSize: 13, padding: '0 18px',
                  display: 'flex', alignItems: 'center', gap: 7,
                  borderBottom: active ? '2.5px solid var(--accent)' : '2.5px solid transparent',
                  cursor: 'pointer', transition: 'color 0.15s',
                }}
              >
                <Icon size={15} />
                {t.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Page content */}
      <div style={{ flex: 1 }}>
        {tab === 'catalogo'   && <CatalogPage    {...data} />}
        {tab === 'gestion'    && <GestionPage    {...data} />}
        {tab === 'inventario' && <InventarioPage  {...data} />}
      </div>
    </div>
  )
}
