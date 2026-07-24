import { useState } from 'react'
import { FileDown, Minus, RotateCcw, TrendingUp, DollarSign, ShoppingBag, Package, Pencil } from 'lucide-react'
import { exportCatalogPdf } from '../lib/exportPdf'
import { Btn, Spinner } from '../components/UI'

export default function InventarioPage({ products, sales, stockOf, soldMap, totalProfit, totalRevenue, registerSale, undoLastSale, loading }) {
  const [exporting, setExp] = useState(false)
  const [search,   setSearch] = useState('')
  const [confirm,  setConfirm] = useState(null) // { id, seller } waiting confirm

  async function handleExport() {
    setExp(true)
    try {
      await exportCatalogPdf(products, 'inventario.pdf')
    } catch (err) {
      console.error('Error exportando PDF:', err)
    }
    setExp(false)
  }

  async function handleSale(productId) {
    if (confirm?.id === productId) {
      await registerSale(productId, confirm.seller, confirm.price)
      setConfirm(null)
    } else {
      const prod = products.find(p => p.id === productId)
      setConfirm({ id: productId, seller: 'S', price: prod?.price ?? '' })
    }
  }

  // Group sales by date for the history section
  const salesByDate = sales.reduce((acc, s) => {
    const date = new Date(s.sold_at).toLocaleDateString('es', { day:'2-digit', month:'short', year:'numeric' })
    if (!acc[date]) acc[date] = []
    acc[date].push(s)
    return acc
  }, {})

  const visible = products.filter(p => {
    const q = search.toLowerCase()
    return !q || p.name?.toLowerCase().includes(q)
  })

  // Total units sold
  const totalUnits = Object.values(soldMap).reduce((a, b) => a + b, 0)

  return (
    <div>
      {/* Stats cards */}
      <div style={{
        background: 'var(--black)', padding: '20px 24px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16,
      }}>
        <StatCard icon={<TrendingUp size={18}/>} label="Ganancia total" value={`Bs. ${totalProfit.toFixed(2)}`} accent />
        <StatCard icon={<DollarSign size={18}/>} label="Ingresos totales" value={`Bs. ${totalRevenue.toFixed(2)}`} />
        <StatCard icon={<ShoppingBag size={18}/>} label="Unidades vendidas" value={totalUnits} />
        <StatCard icon={<Package size={18}/>}     label="Productos activos" value={products.length} />
      </div>

      {/* Controls */}
      <div style={{
        background: 'var(--white)', borderBottom: '1px solid var(--gray-100)',
        padding: '12px 24px', display: 'flex', gap: 12, alignItems: 'center',
      }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..."
          style={{ padding:'8px 12px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-sm)', fontSize:13, outline:'none', width:220 }}/>
        <Btn variant="dark" style={{ marginLeft:'auto' }} onClick={handleExport} disabled={exporting}>
          <FileDown size={14}/> {exporting ? 'Exportando...' : 'Guardar PDF'}
        </Btn>
      </div>

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Inventory table ── */}
        <div id="inv-print" style={{ background:'var(--white)', borderRadius:'var(--radius-md)', overflow:'hidden', boxShadow:'var(--shadow)' }}>
          {/* Table header */}
          <div style={{
            background:'var(--black)', color:'var(--white)',
            padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
            <h2 style={{ fontSize:15, fontWeight:900 }}>INVENTARIO</h2>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>
              {new Date().toLocaleDateString('es', { day:'2-digit', month:'long', year:'numeric' })}
            </p>
          </div>

          {loading ? <Spinner /> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--gray-50)', borderBottom:'1.5px solid var(--gray-200)' }}>
                    {['Producto','Precio venta','Precio compra','Ganancia u.','Ini.','Vendidos','Restantes','Registrar venta'].map(h => (
                      <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--gray-600)', whiteSpace:'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p, i) => {
                    const sold   = soldMap[p.id] || 0
                    const stock  = stockOf(p)
                    const unitProfit = p.buy_price != null ? (p.price - p.buy_price) : null

                    return (
                      <tr key={p.id} style={{
                        borderBottom: '1px solid var(--gray-100)',
                        background: i % 2 === 0 ? 'var(--white)' : 'var(--gray-50)',
                      }}>
                        {/* Product */}
                        <td style={{ padding:'12px 16px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            {p.image_url
                              ? <img src={p.image_url} alt="" crossOrigin="anonymous" style={{ width:36, height:36, objectFit:'contain', borderRadius:4, border:'1px solid var(--gray-100)' }}/>
                              : <div style={{ width:36, height:36, background:'var(--gray-100)', borderRadius:4 }}/>
                            }
                            <div>
                              <p style={{ fontSize:13, fontWeight:700 }}>{p.name}</p>
                              {p.model && <p style={{ fontSize:10, color:'var(--gray-500)' }}>{p.model}</p>}
                            </div>
                          </div>
                        </td>

                        <td style={td}><span style={{ fontWeight:700 }}>Bs. {p.price}</span></td>
                        <td style={td}>{p.buy_price != null ? `Bs. ${p.buy_price}` : <span style={{ color:'var(--gray-300)' }}>—</span>}</td>

                        {/* Unit profit */}
                        <td style={td}>
                          {unitProfit != null
                            ? <span style={{ fontWeight:700, color: unitProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                Bs. {unitProfit.toFixed(2)}
                              </span>
                            : <span style={{ color:'var(--gray-300)' }}>—</span>
                          }
                        </td>

                        <td style={td}>{p.initial_stock ?? '—'}</td>
                        <td style={td}><span style={{ fontWeight:700 }}>{sold}</span></td>

                        {/* Remaining */}
                        <td style={td}>
                          <span style={{
                            fontWeight:800,
                            color: stock <= 0 ? 'var(--danger)' : stock <= 2 ? 'orange' : 'var(--success)',
                          }}>
                            {stock <= 0 ? 'AGOTADO' : stock}
                          </span>
                        </td>

                        {/* Register sale button */}
                        <td style={{ padding:'12px 16px' }}>
                          {stock <= 0 ? (
                            <span style={{ fontSize:11, color:'var(--gray-400)' }}>Sin stock</span>
                          ) : confirm?.id === p.id ? (
                            <div style={{ display:'flex', flexDirection:'column', gap:6, background:'var(--gray-50)', padding:'8px 10px', borderRadius:'var(--radius-sm)', border:'1px solid var(--gray-200)' }}>
                              {/* Seller picker */}
                              <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                                <span style={{ fontSize:10, color:'var(--gray-500)', fontWeight:700, whiteSpace:'nowrap' }}>¿Quién?</span>
                                {['S','F','N'].map(opt => (
                                  <button key={opt} onClick={() => setConfirm(c => ({ ...c, seller: opt }))}
                                    style={{
                                      width:24, height:24, borderRadius:5, border:'none', cursor:'pointer',
                                      fontWeight:800, fontSize:11,
                                      background: confirm.seller === opt ? 'var(--black)' : 'var(--gray-200)',
                                      color: confirm.seller === opt ? 'var(--accent)' : 'var(--gray-600)',
                                      transition:'all 0.15s',
                                    }}>{opt}</button>
                                ))}
                              </div>
                              {/* Custom price picker with Pencil */}
                              <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                                <span style={{ fontSize:10, color:'var(--gray-500)', fontWeight:700, whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:2 }}>
                                  <Pencil size={10}/> Precio:
                                </span>
                                <div style={{ display:'flex', alignItems:'center', background:'var(--white)', border:'1px solid var(--gray-300)', borderRadius:4, padding:'1px 5px' }}>
                                  <span style={{ fontSize:10, fontWeight:700, color:'var(--gray-500)', marginRight:2 }}>Bs.</span>
                                  <input
                                    type="number"
                                    step="0.5"
                                    value={confirm.price ?? ''}
                                    onChange={e => setConfirm(c => ({ ...c, price: e.target.value }))}
                                    style={{ width:50, border:'none', outline:'none', fontSize:11, fontWeight:800, background:'transparent' }}
                                  />
                                </div>
                              </div>
                              {/* Action buttons */}
                              <div style={{ display:'flex', gap:4 }}>
                                <Btn variant="danger" onClick={() => handleSale(p.id)} style={{ padding:'4px 8px', fontSize:11 }}>
                                  <Minus size={11}/> Confirmar
                                </Btn>
                                <Btn variant="ghost" onClick={() => setConfirm(null)} style={{ padding:'4px 6px', fontSize:11 }}>
                                  Cancelar
                                </Btn>
                              </div>
                            </div>
                          ) : (
                            <Btn variant="success" onClick={() => handleSale(p.id)} style={{ padding:'5px 14px', fontSize:12 }}>
                              <Minus size={12}/> Vendí 1
                            </Btn>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>

                {/* Totals row */}
                <tfoot>
                  <tr style={{ background:'var(--black)', color:'var(--white)' }}>
                    <td style={{ padding:'12px 16px', fontWeight:800, fontSize:13 }} colSpan={3}>TOTALES</td>
                    <td style={tdLight}></td>
                    <td style={tdLight}></td>
                    <td style={{ padding:'12px 16px', fontWeight:800 }}>{totalUnits} uds.</td>
                    <td style={tdLight}></td>
                    <td style={{ padding:'12px 16px', fontWeight:800, color:'var(--accent)' }}>
                      Bs. {totalProfit.toFixed(2)} ganancia
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* ── Sales history ── */}
        <div style={{ background:'var(--white)', borderRadius:'var(--radius-md)', boxShadow:'var(--shadow)', overflow:'hidden' }}>
          <div style={{
            background:'var(--black)', color:'var(--white)',
            padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
            <h2 style={{ fontSize:15, fontWeight:900 }}>HISTORIAL DE VENTAS</h2>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>{sales.length} registro(s)</span>
          </div>

          {sales.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px 0', color:'var(--gray-400)', fontSize:13 }}>
              No hay ventas registradas aún.
            </div>
          ) : (
            <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:20 }}>
              {Object.entries(salesByDate).map(([date, daySales]) => {
                const dayRevenue = daySales.reduce((acc, s) => {
                  const prod = products.find(p => p.id === s.product_id)
                  const salePrice = s.price_at_sale ?? prod?.price ?? 0
                  return acc + salePrice
                }, 0)
                const dayProfit = daySales.reduce((acc, s) => {
                  const prod = products.find(p => p.id === s.product_id)
                  if (!prod) return acc
                  const salePrice = s.price_at_sale ?? prod.price ?? 0
                  return acc + (salePrice - (prod.buy_price || 0))
                }, 0)

                return (
                  <div key={date}>
                    {/* Day header */}
                    <div style={{
                      display:'flex', alignItems:'center', gap:12, marginBottom:8,
                    }}>
                      <span style={{
                        background:'var(--accent)', color:'var(--black)',
                        fontWeight:800, fontSize:11, padding:'3px 10px', borderRadius:4,
                      }}>{date}</span>
                      <span style={{ fontSize:12, color:'var(--gray-600)' }}>
                        {daySales.length} venta(s) · Bs. {dayRevenue.toFixed(2)} ingreso · <span style={{ color:'var(--success)', fontWeight:700 }}>Bs. {dayProfit.toFixed(2)} ganancia</span>
                      </span>
                      <div style={{ flex:1, height:1, background:'var(--gray-100)' }}/>
                    </div>

                    {/* Day sales */}
                    <div style={{ display:'flex', flexDirection:'column', gap:6, paddingLeft:8 }}>
                      {daySales.map(s => {
                        const prod = products.find(p => p.id === s.product_id)
                        const time = new Date(s.sold_at).toLocaleTimeString('es', { hour:'2-digit', minute:'2-digit' })
                        return (
                          <div key={s.id} style={{
                            display:'flex', alignItems:'center', gap:12,
                            padding:'8px 12px', background:'var(--gray-50)',
                            borderRadius:'var(--radius-sm)', border:'1px solid var(--gray-100)',
                          }}>
                            {prod?.image_url && (
                              <img src={prod.image_url} alt="" crossOrigin="anonymous" style={{ width:32, height:32, objectFit:'contain', borderRadius:4 }}/>
                            )}
                            <div style={{ flex:1 }}>
                              <p style={{ fontSize:13, fontWeight:700 }}>{prod?.name || 'Producto eliminado'}</p>
                              <p style={{ fontSize:11, color:'var(--gray-500)' }}>{time}</p>
                            </div>
                            <div style={{ textAlign:'right' }}>
                              {(() => {
                                const salePrice = s.price_at_sale ?? prod?.price
                                const isCustom = s.price_at_sale != null && prod && s.price_at_sale !== prod.price
                                return (
                                  <>
                                    <p style={{ fontSize: 13, fontWeight: 800 }}>
                                      Bs. {salePrice ?? '—'}
                                      {isCustom && (
                                        <span title={`Precio de catálogo actual: Bs. ${prod.price}`}
                                          style={{ marginLeft: 4, fontSize: 9, background: '#e8f4fd', color: '#2196f3', borderRadius: 3, padding: '1px 5px', fontWeight: 700, verticalAlign: 'middle' }}>
                                          esp.
                                        </span>
                                      )}
                                    </p>
                                    {prod?.buy_price != null && salePrice != null && (
                                      <p style={{ fontSize: 10, color: 'var(--success)', fontWeight: 700 }}>
                                        +Bs. {(salePrice - prod.buy_price).toFixed(2)}
                                      </p>
                                    )}
                                  </>
                                )
                              })()}
                            </div>
                            <Btn variant="ghost" onClick={() => undoLastSale(s.product_id)}
                              style={{ padding:'4px 8px', fontSize:11 }}
                              title="Deshacer esta venta">
                              <RotateCcw size={11}/>
                            </Btn>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

const td      = { padding:'12px 16px', fontSize:13, color:'var(--black)' }
const tdLight = { padding:'12px 16px', fontSize:13, color:'rgba(255,255,255,0.4)' }

function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      background: accent ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
      borderRadius: 'var(--radius-md)', padding: '14px 18px',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <span style={{ color: accent ? 'var(--black)' : 'rgba(255,255,255,0.5)' }}>{icon}</span>
        <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em',
          color: accent ? 'var(--black)' : 'rgba(255,255,255,0.5)' }}>
          {label}
        </span>
      </div>
      <p style={{ fontSize:24, fontWeight:900, color: accent ? 'var(--black)' : 'var(--white)' }}>{value}</p>
    </div>
  )
}
