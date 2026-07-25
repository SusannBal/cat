import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useData() {
  const [products, setProducts]   = useState([])
  const [sales,    setSales]      = useState([])
  const [loading,  setLoading]    = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [{ data: prods }, { data: salesData }] = await Promise.all([
      supabase.from('productos').select('*').order('created_at', { ascending: false }),
      supabase.from('ventas').select('*').order('sold_at', { ascending: false }),
    ])
    setProducts(prods || [])
    setSales(salesData || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Products ──────────────────────────────────────────────
  async function saveProduct(form) {
    const payload = {
      name:         form.name,
      model:        form.model || null,
      category:     form.category,
      specs:        form.specs || null,
      price:        parseFloat(form.price),
      buy_price:    form.buy_price ? parseFloat(form.buy_price) : null,
      initial_stock: form.initial_stock ? parseInt(form.initial_stock) : 0,
      installments: form.installments || null,
      code:         form.code || null,
      image_url:    form.image_url || null,
    }
    if (form.id) {
      const { error } = await supabase.from('productos').update(payload).eq('id', form.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('productos')
        .insert([{ ...payload, created_at: new Date().toISOString() }])
      if (error) throw error
    }
    await fetchAll()
  }

  async function deleteProduct(id) {
    await supabase.from('ventas').delete().eq('product_id', id)
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) throw error
    await fetchAll()
  }

  async function uploadImage(file) {
    const ext      = file.name.split('.').pop()
    const filename = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('productos').upload(filename, file, {
      cacheControl: '360000', // Guarda la imagen en la caché del navegador por ~4 días (o 31536000 para 1 año)
      upsert: true
    })
    if (error) throw error
    const { data } = supabase.storage.from('productos').getPublicUrl(filename)
    return data.publicUrl
  }

  // ── Sales ─────────────────────────────────────────────────
  async function registerSale(productId, seller = 'N', customPrice = null) {
    const product = products.find(p => p.id === productId)
    const priceToSave = customPrice !== null && customPrice !== ''
      ? parseFloat(customPrice)
      : (product?.price ?? null)

    const { error } = await supabase.from('ventas').insert([{
      product_id: productId,
      sold_at: new Date().toISOString(),
      seller,
      price_at_sale: priceToSave,
    }])
    if (error) throw error
    await fetchAll()
  }

  async function undoLastSale(productId) {
    // find the most recent sale for this product
    const last = sales.find(s => s.product_id === productId)
    if (!last) return
    const { error } = await supabase.from('ventas').delete().eq('id', last.id)
    if (error) throw error
    await fetchAll()
  }

  // ── Derived data ──────────────────────────────────────────
  // units sold per product
  const soldMap = sales.reduce((acc, s) => {
    acc[s.product_id] = (acc[s.product_id] || 0) + 1
    return acc
  }, {})

  // current stock = initial_stock - sold
  function stockOf(product) {
    return (product.initial_stock || 0) - (soldMap[product.id] || 0)
  }

  // total profit across all sales
  const totalProfit = sales.reduce((acc, s) => {
    const prod = products.find(p => p.id === s.product_id)
    if (!prod) return acc
    const salePrice = s.price_at_sale ?? prod.price ?? 0
    return acc + (salePrice - (prod.buy_price || 0))
  }, 0)

  // total revenue
  const totalRevenue = sales.reduce((acc, s) => {
    const prod = products.find(p => p.id === s.product_id)
    const salePrice = s.price_at_sale ?? prod?.price ?? 0
    return acc + salePrice
  }, 0)

  return {
    products, sales, loading,
    saveProduct, deleteProduct, uploadImage,
    registerSale, undoLastSale,
    soldMap, stockOf, totalProfit, totalRevenue,
    refresh: fetchAll,
  }
}
