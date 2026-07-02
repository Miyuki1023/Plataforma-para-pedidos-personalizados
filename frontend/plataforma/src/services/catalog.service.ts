export async function generateCatalog(products: any[]) {
  const itemsHtml = products.map(p => `
    <div style="border-bottom:1px solid #f5ece4;padding:20px 0;display:flex;justify-content:space-between;align-items:center;page-break-inside:avoid;">
      <div style="max-width:75%;">
        <h3 style="margin:0;color:#3F0006;font-family:'Cormorant Garamond',serif;font-size:20px;">${p.nombre}</h3>
        <p style="margin:4px 0;font-size:12px;color:#8b1a2e;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">${p.categoria}</p>
        <p style="margin:6px 0 0;font-size:14px;color:#6b5050;line-height:1.5;">${p.descripcion || 'Una deliciosa creación artesanal de nuestra casa.'}</p>
      </div>
      <div style="font-size:22px;font-weight:700;color:#3F0006;font-family:'Lato',sans-serif;">S/ ${Number(p.precio || 0).toFixed(2)}</div>
    </div>
  `).join('')

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para generar el catálogo.')
    return
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Catálogo Vainilla y Miel</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Lato', sans-serif; padding: 60px; color: #2a1a1a; background: #fff; }
          .header { text-align: center; margin-bottom: 60px; border-bottom: 4px double #8b1a2e; padding-bottom: 40px; }
          h1 { font-family: 'Cormorant Garamond', serif; font-size: 48px; color: #3F0006; margin: 0; }
          .subtitle { font-size: 18px; color: #7c5730; margin-top: 12px; font-style: italic; }
          .footer { text-align: center; font-size: 11px; color: #9e8080; margin-top: 60px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Vainilla y Miel</h1>
          <div class="subtitle">Catálogo Exclusivo de Repostería Artesanal</div>
        </div>
        ${itemsHtml}
        <div class="footer">Vainilla y Miel - Pedidos Personalizados</div>
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.onload = () => printWindow.print()
}