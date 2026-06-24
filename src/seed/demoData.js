import mongoose from 'mongoose'
import User from '../model/User.js'
import Categoria from '../model/Categoria.js'
import Transaccion from '../model/Transaccion.js'
import Presupuesto from '../model/Presupuesto.js'

const { ObjectId } = mongoose.Types

const DEMO_EMAIL = 'demo@gmail.com'
const DEMO_PASSWORD = 'Demo1234!'
const DEMO_PASSWORD_HASH = '$2b$10$AsxbdXtLIo1RsuN29yx5EOH9Alu3j.IZL7LLp5yIcJuDiTvFZsSLO'

const userId = new ObjectId('667900000000000000000001')

const categoryIds = {
    ingresos: new ObjectId('667900000000000000000101'),
    alquiler: new ObjectId('667900000000000000000102'),
    supermercado: new ObjectId('667900000000000000000103'),
    transporte: new ObjectId('667900000000000000000104'),
    servicios: new ObjectId('667900000000000000000105'),
    salud: new ObjectId('667900000000000000000106'),
    entretenimiento: new ObjectId('667900000000000000000107'),
    educacion: new ObjectId('667900000000000000000108'),
    ahorro: new ObjectId('667900000000000000000109'),
    mascotas: new ObjectId('667900000000000000000110')
}

const tx = (id, tipo, monto, descripcion, categoria, fecha) => ({
    _id: new ObjectId(id),
    tipo,
    monto,
    descripcion,
    categoria,
    fecha: new Date(fecha),
    user: userId
})

const budget = (id, categoria, limite, mes, anio) => ({
    _id: new ObjectId(id),
    categoria,
    limite,
    mes,
    anio,
    user: userId
})

const seedDemoData = async () => {
    const oldUser = await User.findOne({ email: DEMO_EMAIL }).lean()
    const userIdsToClean = [userId]

    if (oldUser && String(oldUser._id) !== String(userId)) {
        userIdsToClean.push(oldUser._id)
    }

    await Promise.all([
        Transaccion.deleteMany({ user: { $in: userIdsToClean } }),
        Presupuesto.deleteMany({ user: { $in: userIdsToClean } }),
        Categoria.deleteMany({ user: { $in: userIdsToClean } }),
        User.deleteMany({ _id: { $in: userIdsToClean } }),
        User.deleteMany({ email: DEMO_EMAIL })
    ])

    await User.create({
        _id: userId,
        name: 'Usuario Demo Profesor',
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD_HASH
    })

    await Categoria.insertMany([
        { _id: categoryIds.ingresos, name: 'Ingresos', description: 'Sueldo, trabajos freelance y entradas de dinero.', user: userId },
        { _id: categoryIds.alquiler, name: 'Alquiler', description: 'Alquiler mensual y expensas principales.', user: userId },
        { _id: categoryIds.supermercado, name: 'Supermercado', description: 'Compras de comida, limpieza y productos del hogar.', user: userId },
        { _id: categoryIds.transporte, name: 'Transporte', description: 'SUBE, combustible, taxis y movilidad diaria.', user: userId },
        { _id: categoryIds.servicios, name: 'Servicios', description: 'Luz, gas, internet, celular y suscripciones básicas.', user: userId },
        { _id: categoryIds.salud, name: 'Salud', description: 'Farmacia, consultas médicas y cuidado personal.', user: userId },
        { _id: categoryIds.entretenimiento, name: 'Entretenimiento', description: 'Salidas, cine, streaming y ocio.', user: userId },
        { _id: categoryIds.educacion, name: 'Educación', description: 'Cursos, libros y materiales de estudio.', user: userId },
        { _id: categoryIds.ahorro, name: 'Ahorro e inversiones', description: 'Ahorro mensual, fondos e inversiones personales.', user: userId },
        { _id: categoryIds.mascotas, name: 'Mascotas', description: 'Alimento, veterinaria y accesorios.', user: userId }
    ])

    await Transaccion.insertMany([
        tx('667900000000000000001001', 'ingreso', 930000, 'Sueldo enero', categoryIds.ingresos, '2026-01-01T12:00:00.000Z'),
        tx('667900000000000000001002', 'ingreso', 120000, 'Proyecto freelance landing page', categoryIds.ingresos, '2026-01-15T12:00:00.000Z'),
        tx('667900000000000000001003', 'gasto', 330000, 'Alquiler enero', categoryIds.alquiler, '2026-01-02T12:00:00.000Z'),
        tx('667900000000000000001004', 'gasto', 142300, 'Compra grande supermercado', categoryIds.supermercado, '2026-01-05T12:00:00.000Z'),
        tx('667900000000000000001005', 'gasto', 36500, 'SUBE y taxis', categoryIds.transporte, '2026-01-10T12:00:00.000Z'),
        tx('667900000000000000001006', 'gasto', 91800, 'Luz, gas e internet', categoryIds.servicios, '2026-01-12T12:00:00.000Z'),
        tx('667900000000000000001007', 'gasto', 27000, 'Farmacia', categoryIds.salud, '2026-01-18T12:00:00.000Z'),
        tx('667900000000000000001008', 'gasto', 45500, 'Cena y cine', categoryIds.entretenimiento, '2026-01-21T12:00:00.000Z'),
        tx('667900000000000000001009', 'gasto', 40000, 'Curso online', categoryIds.educacion, '2026-01-23T12:00:00.000Z'),
        tx('667900000000000000001010', 'gasto', 80000, 'Transferencia a fondo común', categoryIds.ahorro, '2026-01-28T12:00:00.000Z'),
        tx('667900000000000000001011', 'ingreso', 950000, 'Sueldo febrero', categoryIds.ingresos, '2026-02-01T12:00:00.000Z'),
        tx('667900000000000000001012', 'ingreso', 85000, 'Reintegro de gastos', categoryIds.ingresos, '2026-02-09T12:00:00.000Z'),
        tx('667900000000000000001013', 'gasto', 335000, 'Alquiler febrero', categoryIds.alquiler, '2026-02-02T12:00:00.000Z'),
        tx('667900000000000000001014', 'gasto', 151900, 'Supermercado mensual', categoryIds.supermercado, '2026-02-06T12:00:00.000Z'),
        tx('667900000000000000001015', 'gasto', 39200, 'Transporte mensual', categoryIds.transporte, '2026-02-11T12:00:00.000Z'),
        tx('667900000000000000001016', 'gasto', 95600, 'Servicios hogar', categoryIds.servicios, '2026-02-13T12:00:00.000Z'),
        tx('667900000000000000001017', 'gasto', 32000, 'Consulta médica', categoryIds.salud, '2026-02-17T12:00:00.000Z'),
        tx('667900000000000000001018', 'gasto', 48800, 'Salida fin de semana', categoryIds.entretenimiento, '2026-02-22T12:00:00.000Z'),
        tx('667900000000000000001019', 'gasto', 21500, 'Alimento mascotas', categoryIds.mascotas, '2026-02-24T12:00:00.000Z'),
        tx('667900000000000000001020', 'gasto', 90000, 'Ahorro programado', categoryIds.ahorro, '2026-02-27T12:00:00.000Z'),
        tx('667900000000000000001021', 'ingreso', 980000, 'Sueldo marzo', categoryIds.ingresos, '2026-03-01T12:00:00.000Z'),
        tx('667900000000000000001022', 'ingreso', 160000, 'Mantenimiento sistema freelance', categoryIds.ingresos, '2026-03-18T12:00:00.000Z'),
        tx('667900000000000000001023', 'gasto', 345000, 'Alquiler marzo', categoryIds.alquiler, '2026-03-02T12:00:00.000Z'),
        tx('667900000000000000001024', 'gasto', 168700, 'Supermercado y almacén', categoryIds.supermercado, '2026-03-07T12:00:00.000Z'),
        tx('667900000000000000001025', 'gasto', 42100, 'Transporte trabajo', categoryIds.transporte, '2026-03-10T12:00:00.000Z'),
        tx('667900000000000000001026', 'gasto', 104300, 'Servicios marzo', categoryIds.servicios, '2026-03-14T12:00:00.000Z'),
        tx('667900000000000000001027', 'gasto', 26500, 'Medicamentos', categoryIds.salud, '2026-03-20T12:00:00.000Z'),
        tx('667900000000000000001028', 'gasto', 72000, 'Recital', categoryIds.entretenimiento, '2026-03-23T12:00:00.000Z'),
        tx('667900000000000000001029', 'gasto', 55000, 'Libros facultad', categoryIds.educacion, '2026-03-25T12:00:00.000Z'),
        tx('667900000000000000001030', 'gasto', 110000, 'Ahorro mensual', categoryIds.ahorro, '2026-03-29T12:00:00.000Z'),
        tx('667900000000000000001031', 'ingreso', 1010000, 'Sueldo abril', categoryIds.ingresos, '2026-04-01T12:00:00.000Z'),
        tx('667900000000000000001032', 'ingreso', 90000, 'Venta notebook usada', categoryIds.ingresos, '2026-04-11T12:00:00.000Z'),
        tx('667900000000000000001033', 'gasto', 360000, 'Alquiler abril', categoryIds.alquiler, '2026-04-02T12:00:00.000Z'),
        tx('667900000000000000001034', 'gasto', 176200, 'Compra supermercado', categoryIds.supermercado, '2026-04-05T12:00:00.000Z'),
        tx('667900000000000000001035', 'gasto', 45300, 'Transporte y taxi lluvia', categoryIds.transporte, '2026-04-09T12:00:00.000Z'),
        tx('667900000000000000001036', 'gasto', 111700, 'Servicios abril', categoryIds.servicios, '2026-04-12T12:00:00.000Z'),
        tx('667900000000000000001037', 'gasto', 38500, 'Dentista', categoryIds.salud, '2026-04-17T12:00:00.000Z'),
        tx('667900000000000000001038', 'gasto', 52400, 'Streaming y salidas', categoryIds.entretenimiento, '2026-04-20T12:00:00.000Z'),
        tx('667900000000000000001039', 'gasto', 24800, 'Veterinaria vacuna', categoryIds.mascotas, '2026-04-22T12:00:00.000Z'),
        tx('667900000000000000001040', 'gasto', 120000, 'Ahorro abril', categoryIds.ahorro, '2026-04-28T12:00:00.000Z'),
        tx('667900000000000000001041', 'ingreso', 1040000, 'Sueldo mayo', categoryIds.ingresos, '2026-05-01T12:00:00.000Z'),
        tx('667900000000000000001042', 'ingreso', 140000, 'Freelance módulo reportes', categoryIds.ingresos, '2026-05-16T12:00:00.000Z'),
        tx('667900000000000000001043', 'gasto', 372000, 'Alquiler mayo', categoryIds.alquiler, '2026-05-02T12:00:00.000Z'),
        tx('667900000000000000001044', 'gasto', 184900, 'Supermercado mayo', categoryIds.supermercado, '2026-05-06T12:00:00.000Z'),
        tx('667900000000000000001045', 'gasto', 48700, 'Transporte mayo', categoryIds.transporte, '2026-05-10T12:00:00.000Z'),
        tx('667900000000000000001046', 'gasto', 119400, 'Servicios mayo', categoryIds.servicios, '2026-05-13T12:00:00.000Z'),
        tx('667900000000000000001047', 'gasto', 30200, 'Farmacia y vitaminas', categoryIds.salud, '2026-05-18T12:00:00.000Z'),
        tx('667900000000000000001048', 'gasto', 63500, 'Cumpleaños y salida', categoryIds.entretenimiento, '2026-05-21T12:00:00.000Z'),
        tx('667900000000000000001049', 'gasto', 61000, 'Curso JavaScript avanzado', categoryIds.educacion, '2026-05-24T12:00:00.000Z'),
        tx('667900000000000000001050', 'gasto', 130000, 'Ahorro mayo', categoryIds.ahorro, '2026-05-29T12:00:00.000Z'),
        tx('667900000000000000001051', 'ingreso', 1080000, 'Sueldo junio', categoryIds.ingresos, '2026-06-01T12:00:00.000Z'),
        tx('667900000000000000001052', 'ingreso', 220000, 'Freelance integración API', categoryIds.ingresos, '2026-06-12T12:00:00.000Z'),
        tx('667900000000000000001053', 'gasto', 385000, 'Alquiler junio', categoryIds.alquiler, '2026-06-02T12:00:00.000Z'),
        tx('667900000000000000001054', 'gasto', 193400, 'Supermercado primera quincena', categoryIds.supermercado, '2026-06-05T12:00:00.000Z'),
        tx('667900000000000000001055', 'gasto', 52200, 'Transporte junio', categoryIds.transporte, '2026-06-08T12:00:00.000Z'),
        tx('667900000000000000001056', 'gasto', 128600, 'Servicios junio', categoryIds.servicios, '2026-06-10T12:00:00.000Z'),
        tx('667900000000000000001057', 'gasto', 45000, 'Consulta clínica', categoryIds.salud, '2026-06-14T12:00:00.000Z'),
        tx('667900000000000000001058', 'gasto', 82300, 'Cena con amigos', categoryIds.entretenimiento, '2026-06-16T12:00:00.000Z'),
        tx('667900000000000000001059', 'gasto', 38000, 'Alimento mascotas', categoryIds.mascotas, '2026-06-18T12:00:00.000Z'),
        tx('667900000000000000001060', 'gasto', 70000, 'Material de estudio TP final', categoryIds.educacion, '2026-06-20T12:00:00.000Z'),
        tx('667900000000000000001061', 'gasto', 150000, 'Ahorro junio', categoryIds.ahorro, '2026-06-21T12:00:00.000Z'),
        tx('667900000000000000001062', 'gasto', 47200, 'Reposición supermercado', categoryIds.supermercado, '2026-06-22T12:00:00.000Z')
    ])

    await Presupuesto.insertMany([
        budget('667900000000000000002001', categoryIds.alquiler, 390000, 6, 2026),
        budget('667900000000000000002002', categoryIds.supermercado, 250000, 6, 2026),
        budget('667900000000000000002003', categoryIds.transporte, 65000, 6, 2026),
        budget('667900000000000000002004', categoryIds.servicios, 140000, 6, 2026),
        budget('667900000000000000002005', categoryIds.salud, 50000, 6, 2026),
        budget('667900000000000000002006', categoryIds.entretenimiento, 75000, 6, 2026),
        budget('667900000000000000002007', categoryIds.educacion, 80000, 6, 2026),
        budget('667900000000000000002008', categoryIds.mascotas, 45000, 6, 2026),
        budget('667900000000000000002009', categoryIds.ahorro, 160000, 6, 2026),
        budget('667900000000000000002010', categoryIds.supermercado, 230000, 5, 2026),
        budget('667900000000000000002011', categoryIds.transporte, 60000, 5, 2026),
        budget('667900000000000000002012', categoryIds.servicios, 130000, 5, 2026),
        budget('667900000000000000002013', categoryIds.entretenimiento, 70000, 5, 2026),
        budget('667900000000000000002014', categoryIds.educacion, 65000, 5, 2026),
        budget('667900000000000000002015', categoryIds.supermercado, 215000, 4, 2026),
        budget('667900000000000000002016', categoryIds.transporte, 55000, 4, 2026),
        budget('667900000000000000002017', categoryIds.servicios, 120000, 4, 2026),
        budget('667900000000000000002018', categoryIds.entretenimiento, 65000, 4, 2026)
    ])

    console.log(`Datos demo cargados: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
}

export default seedDemoData
