import jsPDF from 'jspdf'

async function imageUrlToBase64(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/jpeg', 0.92))
      } catch { resolve(null) }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

export async function exportCatalogPdf(products, filename = 'catalogo.pdf') {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const PW = 210, PH = 297
  const margin = 8, gap = 5
  const cols = 2, rows = 3
  const headerH = 18, footerH = 12

  const cardW = (PW - margin * 2 - gap) / cols
  const cardH = (PH - headerH - footerH - margin * 2 - gap * (rows - 1)) / rows

  const pad = 5
  const imgColW = cardW * 0.45        // foto ocupa 45% del ancho (columna derecha completa)
  const textColW = cardW - imgColW - pad * 2  // texto ocupa el resto
  const priceR = 14                   // radio círculo precio

  const imgCache = {}
  for (const p of products) {
    if (p.image_url) imgCache[p.id] = await imageUrlToBase64(p.image_url)
  }

  // ── Header ───────────────────────────────────────────────────
  function drawHeader() {
    pdf.setFillColor(15, 15, 15)
    pdf.rect(0, 0, PW, headerH, 'F')

    pdf.setFillColor(255, 210, 0)
    pdf.roundedRect(margin, 3, 14, 12, 1.5, 1.5, 'F')
    pdf.setFontSize(5); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(15, 15, 15)
    pdf.text('PAGE', margin + 7, 6.8, { align: 'center' })
    pdf.setFontSize(9)
    pdf.text(String(pdf.internal.getCurrentPageInfo().pageNumber), margin + 7, 12.5, { align: 'center' })

    pdf.setDrawColor(255, 210, 0); pdf.setLineWidth(0.5); pdf.setFillColor(15, 15, 15)
    pdf.roundedRect(margin + 16, 3, 112, 12, 1.5, 1.5, 'FD')
    pdf.setFontSize(10.5); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(255, 255, 255)
    pdf.text('CATÁLOGO DE PRODUCTOS', margin + 19, 11)

    const dateStr = new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' }).toUpperCase()
    pdf.setFontSize(8); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(190, 190, 190)
    pdf.text(dateStr, PW - margin, 11, { align: 'right' })
  }

  // ── Footer ───────────────────────────────────────────────────
  function drawFooter() {
    pdf.setDrawColor(210, 210, 210); pdf.setLineWidth(0.2)
    pdf.line(margin, PH - footerH + 2, PW - margin, PH - footerH + 2)
    pdf.setFontSize(6); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(150, 150, 150)
    pdf.text('Precios en bolivianos (Bs.). Válidos hasta agotar existencias.', margin, PH - 4)
  }

  // ── Tarjeta ───────────────────────────────────────────────────
  function drawCard(p, cx, cy) {
    const imgData = imgCache[p.id]

    // Fondo blanco + borde gris
    pdf.setFillColor(255, 255, 255)
    pdf.setDrawColor(185, 185, 185); pdf.setLineWidth(0.35)
    pdf.roundedRect(cx, cy, cardW, cardH, 2.5, 2.5, 'FD')

    // ── COLUMNA DERECHA: imagen llena toda la altura ──────────
    const imgX = cx + cardW - imgColW
    const imgY = cy
    // Clip redondeado sólo en las esquinas derechas
    pdf.setFillColor(242, 242, 242)
    pdf.roundedRect(imgX, imgY, imgColW, cardH, 2.5, 2.5, 'F')
    // Sobrescribir las esquinas izquierdas del rect de imagen (para que sean rectas)
    pdf.setFillColor(242, 242, 242)
    pdf.rect(imgX, imgY, 3, cardH, 'F')

    if (imgData) {
      try {
        // imagen a escala "contain" dentro del área derecha
        const areaW = imgColW - 4
        const areaH = cardH - 4
        pdf.addImage(imgData, 'JPEG', imgX + 2, imgY + 2, areaW, areaH, undefined, 'FAST')
      } catch {}
    }

    // Línea divisoria vertical entre texto e imagen
    pdf.setDrawColor(215, 215, 215); pdf.setLineWidth(0.25)
    pdf.line(imgX, cy + pad, imgX, cy + cardH - pad)

    // ── COLUMNA IZQUIERDA: texto + precio abajo ───────────────
    const tx = cx + pad
    let ty = cy + pad + 4

    // Nombre (grande, bold)
    pdf.setFontSize(12.5); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(15, 15, 15)
    const nameLines = pdf.splitTextToSize(p.name || '', textColW)
    pdf.text(nameLines.slice(0, 2), tx, ty)
    ty += nameLines.slice(0, 2).length * 6.5 + 1

    // Código (verde)
    const codLabel = [p.code, p.model].filter(Boolean).join(' · ')
    if (codLabel) {
      pdf.setFontSize(8); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(25, 100, 55)
      pdf.text(codLabel, tx, ty)
      ty += 5.5
    }

    // Separador
    pdf.setDrawColor(210, 210, 210); pdf.setLineWidth(0.2)
    pdf.line(tx, ty, imgX - 3, ty)
    ty += 4

    // Specs (fuente más grande, llena el espacio disponible)
    const bottomLimit = cy + cardH - priceR * 2 - pad * 2 - 4  // reservar espacio para el precio
    if (p.specs) {
      pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(65, 65, 65)
      const specLines = pdf.splitTextToSize(p.specs, textColW)
      const lineH = 4.8
      for (const line of specLines) {
        if (ty + lineH > bottomLimit) break
        pdf.text(line, tx, ty)
        ty += lineH
      }
    }

    // ── PRECIO: círculo abajo izquierda ──────────────────────
    const pcx = cx + pad + priceR + 1
    const pcy = cy + cardH - priceR - pad

    // Sombra
    pdf.setFillColor(180, 140, 0)
    pdf.circle(pcx + 0.8, pcy + 0.8, priceR, 'F')
    // Círculo amarillo
    pdf.setFillColor(255, 210, 0)
    pdf.circle(pcx, pcy, priceR, 'F')
    // Borde
    pdf.setDrawColor(25, 25, 25); pdf.setLineWidth(0.5)
    pdf.circle(pcx, pcy, priceR, 'S')

    // "Bs."
    pdf.setFontSize(7); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(20, 20, 20)
    pdf.text('Bs.', pcx, pcy - 5, { align: 'center' })

    // Número precio
    const priceStr = String(p.price)
    const fs = priceStr.length <= 2 ? 15 : priceStr.length <= 4 ? 12 : 10
    pdf.setFontSize(fs); pdf.setFont('helvetica', 'bold')
    pdf.text(priceStr, pcx, pcy + 3, { align: 'center' })

    // Cuotas
    if (p.installments) {
      pdf.setFontSize(5); pdf.setFont('helvetica', 'normal')
      const il = pdf.splitTextToSize(p.installments, priceR * 2 - 2)
      pdf.text(il.slice(0, 2), pcx, pcy + 8.5, { align: 'center' })
    }
  }

  // ── Render ───────────────────────────────────────────────────
  const startY = headerH + margin / 2
  let col = 0, row = 0
  drawHeader()

  for (let i = 0; i < products.length; i++) {
    let fy = startY + row * (cardH + gap)
    if (fy + cardH > PH - footerH - 2) {
      drawFooter(); pdf.addPage(); row = 0; col = 0; drawHeader()
    }
    const fx = margin + col * (cardW + gap)
    fy = startY + row * (cardH + gap)
    drawCard(products[i], fx, fy)
    col++
    if (col >= cols) { col = 0; row++ }
  }
  drawFooter()

  // ── Descarga ─────────────────────────────────────────────────
  const blob = pdf.output('blob')
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(url)
}
