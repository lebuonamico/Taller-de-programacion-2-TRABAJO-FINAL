const formatearMoneda = valor => {
    const numero = Number(valor) || 0
    return numero.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
}

const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const construirFilasEvolucion = meses => {
    if (!meses || meses.length === 0) {
        return '<tr><td colspan="4" style="padding:8px;text-align:center;color:#888;">Sin datos de evolución</td></tr>'
    }

    return meses.map(m => `
        <tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">${m.periodo}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;color:#2e7d32;">${formatearMoneda(m.ingresos)}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;color:#c62828;">${formatearMoneda(m.gastos)}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;">${formatearMoneda(m.balance)}</td>
        </tr>
    `).join('')
}

export const construirReporteHTML = ({ periodo, mensuales, categorias, tendencias }) => {
    const nombreMes = nombresMeses[periodo.mes - 1] ?? periodo.mes
    const mayorGasto = categorias?.categoriaConMayorGasto

    const bloqueMayorGasto = mayorGasto
        ? `${mayorGasto.nombre} — ${formatearMoneda(mayorGasto.total)} (${mayorGasto.porcentaje}% del total)`
        : 'Sin gastos registrados en el período'

    return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <h1 style="color:#1565c0;">Reporte Financiero</h1>
        <p style="font-size:16px;">Resumen de <strong>${nombreMes} ${periodo.anio}</strong></p>

        <h2 style="color:#1565c0;border-bottom:2px solid #1565c0;padding-bottom:4px;">Resumen del mes</h2>
        <table style="width:100%;border-collapse:collapse;">
            <tr>
                <td style="padding:8px;">Ingresos</td>
                <td style="padding:8px;text-align:right;color:#2e7d32;font-weight:bold;">${formatearMoneda(mensuales.ingresos)}</td>
            </tr>
            <tr>
                <td style="padding:8px;">Gastos</td>
                <td style="padding:8px;text-align:right;color:#c62828;font-weight:bold;">${formatearMoneda(mensuales.gastos)}</td>
            </tr>
            <tr>
                <td style="padding:8px;">Balance</td>
                <td style="padding:8px;text-align:right;font-weight:bold;">${formatearMoneda(mensuales.balance)}</td>
            </tr>
            <tr>
                <td style="padding:8px;">Porcentaje de ahorro</td>
                <td style="padding:8px;text-align:right;font-weight:bold;">${mensuales.porcentajeAhorro}%</td>
            </tr>
        </table>

        <h2 style="color:#1565c0;border-bottom:2px solid #1565c0;padding-bottom:4px;">Categoría con mayor gasto</h2>
        <p style="font-size:15px;">${bloqueMayorGasto}</p>

        <h2 style="color:#1565c0;border-bottom:2px solid #1565c0;padding-bottom:4px;">Evolución mensual</h2>
        <p style="color:#666;">${tendencias?.periodoAnalizado ?? ''} — ${tendencias?.tendenciaGeneral ?? ''}</p>
        <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr style="background:#f5f5f5;">
                    <th style="padding:8px;text-align:left;">Período</th>
                    <th style="padding:8px;text-align:left;">Ingresos</th>
                    <th style="padding:8px;text-align:left;">Gastos</th>
                    <th style="padding:8px;text-align:left;">Balance</th>
                </tr>
            </thead>
            <tbody>
                ${construirFilasEvolucion(tendencias?.meses)}
            </tbody>
        </table>

        <p style="margin-top:24px;color:#999;font-size:12px;">Este es un reporte automático generado por tu API de Finanzas Personales.</p>
    </div>
    `
}
