// Lógica compartida de las pantallas de finanzas (categorías, transacciones,
// presupuestos, estadísticas y reportes). Todas las rutas requieren un JWT, que
// se guarda en localStorage tras el login y se reutiliza desde la barra de token.

const API = '/api'
const TOKEN_KEY = 'finanzas_token'
const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const getToken = () => localStorage.getItem(TOKEN_KEY) || ''
const setToken = value => localStorage.setItem(TOKEN_KEY, value)

const dineroFmt = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2
})
const dinero = n => dineroFmt.format(Number(n) || 0)
const escapar = texto => String(texto ?? '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

const mostrarMensaje = (texto, tipo = 'success') => {
    const el = document.getElementById('message')
    if (!el) return
    el.textContent = Array.isArray(texto) ? texto.join('\n') : texto
    el.className = `message ${tipo}`
    // Lo traemos a la vista: el mensaje vive al pie de la página y si no se
    // scrollea podría pasar desapercibido.
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// Llamada a la API con el token de sesión. Lanza Error con .details en fallos.
const api = async (path, { method = 'GET', body } = {}) => {
    const token = getToken()
    if (!token) throw new Error('Primero guardá tu token de sesión.')

    const res = await fetch(API + path, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : undefined
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
        const error = new Error(data.error || 'Error en la petición')
        error.details = data.detalles || data.details
        throw error
    }
    return data
}

const errorTexto = error => error.details || error.message

// ---- Barra de token (presente en todas las pantallas de recursos) ----
const initTokenBar = () => {
    const input = document.getElementById('tokenInput')
    const saveBtn = document.getElementById('saveTokenBtn')
    const status = document.getElementById('tokenStatus')
    if (!input || !saveBtn || !status) return

    const refresh = () => {
        const ok = Boolean(getToken())
        status.textContent = ok ? 'Sesión activa ✓' : 'Sin token: pegá el que obtuviste al iniciar sesión.'
        status.className = `token-status ${ok ? 'ok' : 'off'}`
    }

    input.value = getToken()
    refresh()

    saveBtn.addEventListener('click', () => {
        setToken(input.value.trim())
        refresh()
        document.dispatchEvent(new CustomEvent('token:changed'))
    })
}

// Carga las categorías del usuario en uno o varios <select>.
const cargarCategoriasEn = async (selects, { incluirTodas = false } = {}) => {
    const lista = Array.from(selects).filter(Boolean)
    if (!lista.length) return []
    try {
        const categorias = await api('/categories')
        lista.forEach(sel => {
            const previo = sel.value
            const base = incluirTodas ? '<option value="">Todas</option>' : '<option value="">Elegí una categoría</option>'
            sel.innerHTML = base + categorias
                .map(c => `<option value="${c._id}">${escapar(c.name)}</option>`)
                .join('')
            sel.value = previo
        })
        return categorias
    } catch (error) {
        mostrarMensaje(errorTexto(error), 'error')
        return []
    }
}

const nombreCategoria = cat => (cat && typeof cat === 'object' ? cat.name : '—')

/* =========================================================================
 * CATEGORÍAS
 * ========================================================================= */
const initCategorias = () => {
    const form = document.getElementById('categoriaForm')
    const tbody = document.getElementById('categoriasBody')
    if (!form || !tbody) return

    const idInput = document.getElementById('categoriaId')
    const nameInput = document.getElementById('catName')
    const descInput = document.getElementById('catDescription')
    const submitBtn = document.getElementById('catSubmit')
    const cancelBtn = document.getElementById('catCancel')

    const resetForm = () => {
        form.reset()
        idInput.value = ''
        submitBtn.textContent = 'Crear categoría'
        cancelBtn.classList.add('hidden')
    }

    const render = categorias => {
        if (!categorias.length) {
            tbody.innerHTML = '<tr><td colspan="3" class="empty">Todavía no tenés categorías.</td></tr>'
            return
        }
        tbody.innerHTML = categorias.map(c => `
            <tr>
                <td>${escapar(c.name)}</td>
                <td>${escapar(c.description || '—')}</td>
                <td class="actions">
                    <button type="button" class="btn-secondary" data-edit="${c._id}">Editar</button>
                    <button type="button" class="btn-danger" data-del="${c._id}">Eliminar</button>
                </td>
            </tr>`).join('')
        tbody._datos = categorias
    }

    const cargar = async () => {
        try {
            render(await api('/categories'))
        } catch (error) {
            mostrarMensaje(errorTexto(error), 'error')
        }
    }

    form.addEventListener('submit', async event => {
        event.preventDefault()
        const body = { name: nameInput.value.trim() }
        const desc = descInput.value.trim()
        if (desc) body.description = desc

        try {
            if (idInput.value) {
                await api(`/categories/${idInput.value}`, { method: 'PUT', body })
                mostrarMensaje('Categoría actualizada.', 'success')
            } else {
                await api('/categories', { method: 'POST', body })
                mostrarMensaje('Categoría creada.', 'success')
            }
            resetForm()
            cargar()
        } catch (error) {
            mostrarMensaje(errorTexto(error), 'error')
        }
    })

    tbody.addEventListener('click', async event => {
        const editId = event.target.dataset.edit
        const delId = event.target.dataset.del
        if (editId) {
            const cat = (tbody._datos || []).find(c => c._id === editId)
            if (!cat) return
            idInput.value = cat._id
            nameInput.value = cat.name
            descInput.value = cat.description || ''
            submitBtn.textContent = 'Guardar cambios'
            cancelBtn.classList.remove('hidden')
            nameInput.focus()
        }
        if (delId) {
            if (!confirm('¿Eliminar esta categoría?')) return
            try {
                await api(`/categories/${delId}`, { method: 'DELETE' })
                mostrarMensaje('Categoría eliminada.', 'success')
                cargar()
            } catch (error) {
                mostrarMensaje(errorTexto(error), 'error')
            }
        }
    })

    cancelBtn.addEventListener('click', resetForm)
    document.addEventListener('token:changed', cargar)
    if (getToken()) cargar()
}

/* =========================================================================
 * TRANSACCIONES
 * ========================================================================= */
const initTransacciones = () => {
    const form = document.getElementById('transaccionForm')
    const tbody = document.getElementById('transaccionesBody')
    if (!form || !tbody) return

    const idInput = document.getElementById('transaccionId')
    const tipoInput = document.getElementById('txTipo')
    const montoInput = document.getElementById('txMonto')
    const descInput = document.getElementById('txDescripcion')
    const catInput = document.getElementById('txCategoria')
    const fechaInput = document.getElementById('txFecha')
    const submitBtn = document.getElementById('txSubmit')
    const cancelBtn = document.getElementById('txCancel')

    const filtroForm = document.getElementById('filtrosForm')
    const fTipo = document.getElementById('fTipo')
    const fCategoria = document.getElementById('fCategoria')
    const fMes = document.getElementById('fMes')
    const fAnio = document.getElementById('fAnio')
    const fOrden = document.getElementById('fOrden')

    const resetForm = () => {
        form.reset()
        idInput.value = ''
        submitBtn.textContent = 'Registrar transacción'
        cancelBtn.classList.add('hidden')
    }

    const render = transacciones => {
        if (!transacciones.length) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty">No hay transacciones para mostrar.</td></tr>'
            return
        }
        tbody.innerHTML = transacciones.map(t => `
            <tr>
                <td>${new Date(t.fecha).toLocaleDateString('es-AR')}</td>
                <td><span class="badge ${t.tipo}">${t.tipo}</span></td>
                <td>${escapar(nombreCategoria(t.categoria))}</td>
                <td>${escapar(t.descripcion || '—')}</td>
                <td class="num">${dinero(t.monto)}</td>
                <td class="actions">
                    <button type="button" class="btn-secondary" data-edit="${t._id}">Editar</button>
                    <button type="button" class="btn-danger" data-del="${t._id}">Eliminar</button>
                </td>
            </tr>`).join('')
        tbody._datos = transacciones
    }

    const construirQuery = () => {
        const params = new URLSearchParams()
        if (fTipo.value) params.set('tipo', fTipo.value)
        if (fCategoria.value) params.set('categoria', fCategoria.value)
        if (fMes.value && fAnio.value) {
            params.set('mes', fMes.value)
            params.set('anio', fAnio.value)
        }
        if (fOrden.value) params.set('orden', fOrden.value)
        const qs = params.toString()
        return qs ? `?${qs}` : ''
    }

    const cargar = async () => {
        try {
            render(await api(`/transactions${construirQuery()}`))
        } catch (error) {
            mostrarMensaje(errorTexto(error), 'error')
        }
    }

    const cargarTodo = async () => {
        await cargarCategoriasEn([catInput, fCategoria], { incluirTodas: false })
        if (fCategoria) {
            fCategoria.querySelector('option').textContent = 'Todas'
        }
        cargar()
    }

    form.addEventListener('submit', async event => {
        event.preventDefault()
        const body = {
            tipo: tipoInput.value,
            monto: Number(montoInput.value),
            categoria: catInput.value,
            fecha: new Date(fechaInput.value).toISOString()
        }
        const desc = descInput.value.trim()
        if (desc) body.descripcion = desc

        try {
            if (idInput.value) {
                await api(`/transactions/${idInput.value}`, { method: 'PUT', body })
                mostrarMensaje('Transacción actualizada.', 'success')
            } else {
                await api('/transactions', { method: 'POST', body })
                mostrarMensaje('Transacción registrada.', 'success')
            }
            resetForm()
            cargar()
        } catch (error) {
            mostrarMensaje(errorTexto(error), 'error')
        }
    })

    tbody.addEventListener('click', async event => {
        const editId = event.target.dataset.edit
        const delId = event.target.dataset.del
        if (editId) {
            const t = (tbody._datos || []).find(x => x._id === editId)
            if (!t) return
            idInput.value = t._id
            tipoInput.value = t.tipo
            montoInput.value = t.monto
            descInput.value = t.descripcion || ''
            catInput.value = t.categoria?._id || t.categoria || ''
            fechaInput.value = new Date(t.fecha).toISOString().slice(0, 10)
            submitBtn.textContent = 'Guardar cambios'
            cancelBtn.classList.remove('hidden')
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        if (delId) {
            if (!confirm('¿Eliminar esta transacción?')) return
            try {
                await api(`/transactions/${delId}`, { method: 'DELETE' })
                mostrarMensaje('Transacción eliminada.', 'success')
                cargar()
            } catch (error) {
                mostrarMensaje(errorTexto(error), 'error')
            }
        }
    })

    const filtroMsg = document.getElementById('filtroMsg')
    const limpiarFiltroMsg = () => {
        if (filtroMsg) filtroMsg.className = 'message'
        if (filtroMsg) filtroMsg.textContent = ''
    }

    filtroForm.addEventListener('submit', event => {
        event.preventDefault()
        // Mes y año deben ir siempre juntos (la API los valida con .and()).
        if (Boolean(fMes.value) !== Boolean(fAnio.value)) {
            if (filtroMsg) {
                filtroMsg.textContent = 'Para filtrar por período completá el mes y el año.'
                filtroMsg.className = 'message error'
            }
            return
        }
        limpiarFiltroMsg()
        cargar()
    })
    filtroForm.addEventListener('reset', () => {
        limpiarFiltroMsg()
        setTimeout(cargar, 0)
    })
    cancelBtn.addEventListener('click', resetForm)
    document.addEventListener('token:changed', cargarTodo)
    if (getToken()) cargarTodo()
}

/* =========================================================================
 * PRESUPUESTOS
 * ========================================================================= */
const initPresupuestos = () => {
    const form = document.getElementById('presupuestoForm')
    const tbody = document.getElementById('presupuestosBody')
    if (!form || !tbody) return

    const idInput = document.getElementById('presupuestoId')
    const catInput = document.getElementById('bgCategoria')
    const limiteInput = document.getElementById('bgLimite')
    const mesInput = document.getElementById('bgMes')
    const anioInput = document.getElementById('bgAnio')
    const submitBtn = document.getElementById('bgSubmit')
    const cancelBtn = document.getElementById('bgCancel')

    const resetForm = () => {
        form.reset()
        idInput.value = ''
        submitBtn.textContent = 'Crear presupuesto'
        cancelBtn.classList.add('hidden')
    }

    const render = presupuestos => {
        if (!presupuestos.length) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty">No tenés presupuestos cargados.</td></tr>'
            return
        }
        tbody.innerHTML = presupuestos.map(p => `
            <tr>
                <td>${escapar(nombreCategoria(p.categoria))}</td>
                <td>${MESES[p.mes] || p.mes} ${p.anio}</td>
                <td class="num">${dinero(p.limite)}</td>
                <td class="actions">
                    <button type="button" class="btn-secondary" data-edit="${p._id}">Editar</button>
                    <button type="button" class="btn-danger" data-del="${p._id}">Eliminar</button>
                </td>
            </tr>`).join('')
        tbody._datos = presupuestos
    }

    const cargar = async () => {
        try {
            render(await api('/budgets'))
        } catch (error) {
            mostrarMensaje(errorTexto(error), 'error')
        }
    }

    // --- Seguimiento: gastado vs límite (endpoint /stats/budgets) ---
    const seguimientoForm = document.getElementById('seguimientoForm')
    const sgMes = document.getElementById('sgMes')
    const sgAnio = document.getElementById('sgAnio')
    const sgTotales = document.getElementById('seguimientoTotales')
    const sgBody = document.getElementById('seguimientoBody')

    const renderSeguimiento = data => {
        const t = data.totales
        sgTotales.innerHTML = `
            <div class="stat-card"><div class="label">Límite total</div><div class="value">${dinero(t.limite)}</div></div>
            <div class="stat-card"><div class="label">Gastado</div><div class="value neg">${dinero(t.gastado)}</div></div>
            <div class="stat-card"><div class="label">Restante</div><div class="value ${t.restante < 0 ? 'neg' : 'pos'}">${dinero(t.restante)}</div></div>
            <div class="stat-card"><div class="label">Consumido</div><div class="value">${t.porcentaje}%</div></div>`

        sgBody.innerHTML = data.presupuestos.length
            ? data.presupuestos.map(p => `
                <tr>
                    <td>${escapar(p.categoria.nombre)}</td>
                    <td class="num">${dinero(p.limite)}</td>
                    <td class="num">${dinero(p.gastado)}</td>
                    <td class="num">${dinero(p.restante)}</td>
                    <td>
                        <div class="bar ${p.estado === 'excedido' ? 'over' : ''}"><span style="width:${Math.min(p.porcentaje, 100)}%"></span></div>
                        <small class="bar-pct">${p.porcentaje}%</small>
                    </td>
                    <td><span class="badge estado-${p.estado}">${p.estado}</span></td>
                </tr>`).join('')
            : '<tr><td colspan="6" class="empty">No hay presupuestos en este período.</td></tr>'
    }

    const cargarSeguimiento = async () => {
        if (!sgMes.value || !sgAnio.value) return
        try {
            renderSeguimiento(await api(`/stats/budgets?mes=${sgMes.value}&anio=${sgAnio.value}`))
        } catch (error) {
            mostrarMensaje(errorTexto(error), 'error')
        }
    }

    const cargarTodo = async () => {
        await cargarCategoriasEn([catInput])
        cargar()
        cargarSeguimiento()
    }

    form.addEventListener('submit', async event => {
        event.preventDefault()
        const body = {
            categoria: catInput.value,
            limite: Number(limiteInput.value),
            mes: Number(mesInput.value),
            anio: Number(anioInput.value)
        }
        try {
            if (idInput.value) {
                await api(`/budgets/${idInput.value}`, { method: 'PUT', body })
                mostrarMensaje('Presupuesto actualizado.', 'success')
            } else {
                await api('/budgets', { method: 'POST', body })
                mostrarMensaje('Presupuesto creado.', 'success')
            }
            resetForm()
            cargar()
            cargarSeguimiento()
        } catch (error) {
            mostrarMensaje(errorTexto(error), 'error')
        }
    })

    seguimientoForm.addEventListener('submit', event => {
        event.preventDefault()
        cargarSeguimiento()
    })

    tbody.addEventListener('click', async event => {
        const editId = event.target.dataset.edit
        const delId = event.target.dataset.del
        if (editId) {
            const p = (tbody._datos || []).find(x => x._id === editId)
            if (!p) return
            idInput.value = p._id
            catInput.value = p.categoria?._id || p.categoria || ''
            limiteInput.value = p.limite
            mesInput.value = p.mes
            anioInput.value = p.anio
            submitBtn.textContent = 'Guardar cambios'
            cancelBtn.classList.remove('hidden')
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        if (delId) {
            if (!confirm('¿Eliminar este presupuesto?')) return
            try {
                await api(`/budgets/${delId}`, { method: 'DELETE' })
                mostrarMensaje('Presupuesto eliminado.', 'success')
                cargar()
                cargarSeguimiento()
            } catch (error) {
                mostrarMensaje(errorTexto(error), 'error')
            }
        }
    })

    cancelBtn.addEventListener('click', resetForm)
    document.addEventListener('token:changed', cargarTodo)
    if (getToken()) cargarTodo()
}

/* =========================================================================
 * ESTADÍSTICAS
 * ========================================================================= */
const initEstadisticas = () => {
    const form = document.getElementById('statsForm')
    if (!form) return

    const mesInput = document.getElementById('stMes')
    const anioInput = document.getElementById('stAnio')
    const mesesInput = document.getElementById('stMeses')
    const resumen = document.getElementById('statsResumen')
    const porCat = document.getElementById('statsCategoriasBody')
    const tendBody = document.getElementById('statsTendenciasBody')
    const tendTitulo = document.getElementById('tendenciaGeneral')

    const signoClase = n => (n > 0 ? 'pos' : n < 0 ? 'neg' : '')

    const cargar = async () => {
        const mes = mesInput.value
        const anio = anioInput.value
        const meses = mesesInput.value || 6
        try {
            const [mensual, categorias, tendencias] = await Promise.all([
                api(`/stats/monthly?mes=${mes}&anio=${anio}`),
                api(`/stats/categories?mes=${mes}&anio=${anio}`),
                api(`/stats/trends?meses=${meses}`)
            ])

            resumen.innerHTML = `
                <div class="stat-card"><div class="label">Ingresos</div><div class="value pos">${dinero(mensual.ingresos)}</div></div>
                <div class="stat-card"><div class="label">Gastos</div><div class="value neg">${dinero(mensual.gastos)}</div></div>
                <div class="stat-card"><div class="label">Balance</div><div class="value ${signoClase(mensual.balance)}">${dinero(mensual.balance)}</div></div>
                <div class="stat-card"><div class="label">% Ahorro</div><div class="value ${signoClase(mensual.porcentajeAhorro)}">${mensual.porcentajeAhorro}%</div></div>
                <div class="stat-card"><div class="label">Transacciones</div><div class="value">${mensual.cantidadTransacciones.total}</div></div>`

            porCat.innerHTML = categorias.categorias.length
                ? categorias.categorias.map(c => `
                    <tr>
                        <td>${escapar(c.nombre)}</td>
                        <td class="num">${dinero(c.total)}</td>
                        <td class="num">${c.cantidad}</td>
                        <td class="num">${c.porcentaje}%</td>
                    </tr>`).join('')
                : '<tr><td colspan="4" class="empty">Sin gastos en el período.</td></tr>'

            const variacion = v => (v == null ? '—' : `${v > 0 ? '+' : ''}${v}%`)
            tendBody.innerHTML = tendencias.meses.length
                ? tendencias.meses.map(m => `
                    <tr>
                        <td>${m.periodo}</td>
                        <td class="num">${dinero(m.ingresos)}</td>
                        <td class="num">${dinero(m.gastos)}</td>
                        <td class="num">${dinero(m.balance)}</td>
                        <td class="num">${variacion(m.variacionGastos)}</td>
                    </tr>`).join('')
                : '<tr><td colspan="5" class="empty">Sin datos de tendencia.</td></tr>'

            tendTitulo.textContent = `Tendencia (${tendencias.periodoAnalizado}): ${tendencias.tendenciaGeneral}`
            mostrarMensaje('Estadísticas actualizadas.', 'success')
        } catch (error) {
            mostrarMensaje(errorTexto(error), 'error')
        }
    }

    form.addEventListener('submit', event => {
        event.preventDefault()
        cargar()
    })
    document.addEventListener('token:changed', () => getToken() && cargar())
    if (getToken()) cargar()
}

/* =========================================================================
 * REPORTES
 * ========================================================================= */
const initReportes = () => {
    const form = document.getElementById('reporteForm')
    if (!form) return

    const emailInput = document.getElementById('rpEmail')
    const mesInput = document.getElementById('rpMes')
    const anioInput = document.getElementById('rpAnio')
    const resultado = document.getElementById('reporteResultado')

    form.addEventListener('submit', async event => {
        event.preventDefault()
        const body = {}
        const email = emailInput.value.trim()
        if (email) body.email = email
        if (mesInput.value && anioInput.value) {
            body.mes = Number(mesInput.value)
            body.anio = Number(anioInput.value)
        }

        resultado.classList.add('hidden')
        mostrarMensaje('Enviando reporte…', 'success')
        try {
            const data = await api('/reports/send', { method: 'POST', body })
            mostrarMensaje(`${data.mensaje} → ${data.enviadoA}`, 'success')
            if (data.previewURL) {
                resultado.innerHTML = `Vista previa del mail: <a href="${data.previewURL}" target="_blank" rel="noopener">abrir reporte</a>`
                resultado.classList.remove('hidden')
            }
        } catch (error) {
            mostrarMensaje(errorTexto(error), 'error')
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    initTokenBar()
    initCategorias()
    initTransacciones()
    initPresupuestos()
    initEstadisticas()
    initReportes()
})
