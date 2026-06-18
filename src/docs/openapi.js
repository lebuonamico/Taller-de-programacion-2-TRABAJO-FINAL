const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Finanzas Personales API',
        version: '1.0.0',
        description:
            'API REST para gestión de usuarios, categorías, transacciones, presupuestos, estadísticas y reportes financieros por correo.'
    },
    servers: [
        {
            url: 'http://localhost:8081',
            description: 'Servidor de desarrollo'
        }
    ],
    tags: [
        { name: 'Auth', description: 'Registro, login y perfil del usuario autenticado' },
        { name: 'Categories', description: 'Administración de categorías' },
        { name: 'Transactions', description: 'Registro y consulta de movimientos financieros' },
        { name: 'Budgets', description: 'Gestión de presupuestos por categoría y período' },
        { name: 'Stats', description: 'Indicadores y tendencias financieras' },
        { name: 'Reports', description: 'Generación y envío de reportes por email' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            ErrorResponse: {
                type: 'object',
                required: ['error'],
                properties: {
                    error: { type: 'string', example: 'Error de validación' },
                    detalles: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['"name" length must be at least 2 characters long']
                    }
                }
            },
            ConflictResponse: {
                type: 'object',
                properties: {
                    error: { type: 'string', example: 'Email already exists' }
                }
            },
            RegisterInput: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string', example: 'Usuario Demo' },
                    email: { type: 'string', format: 'email', example: 'demo@example.com' },
                    password: { type: 'string', example: 'Password123' }
                }
            },
            LoginInput: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'demo@example.com' },
                    password: { type: 'string', example: 'Password123' }
                }
            },
            UpdateUserInput: {
                type: 'object',
                minProperties: 1,
                properties: {
                    name: { type: 'string', example: 'Usuario Demo' },
                    password: { type: 'string', example: 'NewPassword123' }
                }
            },
            AuthTokenResponse: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                    }
                }
            },
            UserProfile: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d7e' },
                    name: { type: 'string', example: 'Usuario Demo' },
                    email: { type: 'string', format: 'email', example: 'demo@example.com' }
                }
            },
            CreatedUser: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                    name: { type: 'string', example: 'Usuario Demo' },
                    email: { type: 'string', format: 'email', example: 'demo@example.com' }
                }
            },
            CategoryInput: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string', example: 'Alimentación' },
                    description: { type: 'string', example: 'Compras del supermercado y comidas fuera de casa' }
                }
            },
            CategoryUpdateInput: {
                type: 'object',
                minProperties: 1,
                properties: {
                    name: { type: 'string', minLength: 2, maxLength: 50, example: 'Alimentación' },
                    description: { type: 'string', maxLength: 200, example: 'Descripción actualizada' }
                }
            },
            Category: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d70' },
                    name: { type: 'string', example: 'Alimentación' },
                    description: { type: 'string', example: 'Compras del supermercado y comidas fuera de casa' },
                    user: { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d7e' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            TransactionInput: {
                type: 'object',
                required: ['tipo', 'monto', 'categoria', 'fecha'],
                properties: {
                    tipo: { type: 'string', enum: ['ingreso', 'gasto'], example: 'gasto' },
                    monto: { type: 'number', example: 25000 },
                    descripcion: { type: 'string', example: 'Supermercado semanal' },
                    categoria: { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d70' },
                    fecha: { type: 'string', format: 'date-time', example: '2026-06-17T00:00:00.000Z' }
                }
            },
            TransactionUpdateInput: {
                type: 'object',
                minProperties: 1,
                properties: {
                    tipo: { type: 'string', enum: ['ingreso', 'gasto'] },
                    monto: { type: 'number', exclusiveMinimum: true, minimum: 0 },
                    descripcion: { type: 'string' },
                    categoria: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
                    fecha: { type: 'string', format: 'date-time' }
                }
            },
            Transaction: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d71' },
                    tipo: { type: 'string', example: 'gasto' },
                    monto: { type: 'number', example: 25000 },
                    descripcion: { type: 'string', example: 'Supermercado semanal' },
                    categoria: {
                        oneOf: [
                            { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d70' },
                            {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d70' },
                                    name: { type: 'string', example: 'Alimentación' }
                                }
                            }
                        ]
                    },
                    fecha: { type: 'string', format: 'date-time' },
                    user: { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d7e' }
                }
            },
            BudgetInput: {
                type: 'object',
                required: ['categoria', 'limite', 'mes', 'anio'],
                properties: {
                    categoria: { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d70' },
                    limite: { type: 'number', example: 150000 },
                    mes: { type: 'integer', minimum: 1, maximum: 12, example: 6 },
                    anio: { type: 'integer', minimum: 2000, example: 2026 }
                }
            },
            BudgetUpdateInput: {
                type: 'object',
                minProperties: 1,
                properties: {
                    categoria: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
                    limite: { type: 'number', exclusiveMinimum: true, minimum: 0 },
                    mes: { type: 'integer', minimum: 1, maximum: 12 },
                    anio: { type: 'integer', minimum: 2000 }
                }
            },
            Budget: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d72' },
                    categoria: {
                        oneOf: [
                            { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d70' },
                            {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string' },
                                    name: { type: 'string', example: 'Alimentación' }
                                }
                            }
                        ]
                    },
                    limite: { type: 'number', example: 150000 },
                    mes: { type: 'integer', example: 6 },
                    anio: { type: 'integer', example: 2026 },
                    user: { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d7e' }
                }
            },
            MonthlyStats: {
                type: 'object',
                properties: {
                    periodo: {
                        type: 'object',
                        properties: {
                            mes: { type: 'integer', example: 6 },
                            anio: { type: 'integer', example: 2026 }
                        }
                    },
                    ingresos: { type: 'number', example: 350000 },
                    gastos: { type: 'number', example: 220000 },
                    balance: { type: 'number', example: 130000 },
                    porcentajeAhorro: { type: 'number', example: 37.14 },
                    cantidadTransacciones: {
                        type: 'object',
                        properties: {
                            ingresos: { type: 'integer', example: 4 },
                            gastos: { type: 'integer', example: 8 },
                            total: { type: 'integer', example: 12 }
                        }
                    }
                }
            },
            CategoryStats: {
                type: 'object',
                properties: {
                    totalGastos: { type: 'number', example: 220000 },
                    categoriaConMayorGasto: {
                        nullable: true,
                        type: 'object',
                        properties: {
                            categoriaId: { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d70' },
                            nombre: { type: 'string', example: 'Alimentación' },
                            total: { type: 'number', example: 110000 },
                            cantidad: { type: 'integer', example: 5 },
                            promedio: { type: 'number', example: 22000 },
                            porcentaje: { type: 'number', example: 50 }
                        }
                    },
                    categorias: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                categoriaId: { type: 'string', example: '664d5d6d7f1d2f3a4b5c6d70' },
                                nombre: { type: 'string', example: 'Alimentación' },
                                total: { type: 'number', example: 110000 },
                                cantidad: { type: 'integer', example: 5 },
                                promedio: { type: 'number', example: 22000 },
                                porcentaje: { type: 'number', example: 50 }
                            }
                        }
                    }
                }
            },
            TrendsStats: {
                type: 'object',
                properties: {
                    periodoAnalizado: { type: 'string', example: 'últimos 6 meses' },
                    tendenciaGeneral: { type: 'string', example: 'gastos estables' },
                    meses: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                periodo: { type: 'string', example: '2026-06' },
                                anio: { type: 'integer', example: 2026 },
                                mes: { type: 'integer', example: 6 },
                                ingresos: { type: 'number', example: 350000 },
                                gastos: { type: 'number', example: 220000 },
                                balance: { type: 'number', example: 130000 },
                                variacionGastos: { type: 'number', nullable: true, example: 4.2 },
                                variacionIngresos: { type: 'number', nullable: true, example: 7.5 }
                            }
                        }
                    }
                }
            },
            ReportSendInput: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email', example: 'otro-destino@email.com' },
                    mes: { type: 'integer', minimum: 1, maximum: 12, example: 6 },
                    anio: { type: 'integer', minimum: 2000, example: 2026 }
                }
            },
            ReportSendResponse: {
                type: 'object',
                properties: {
                    mensaje: { type: 'string', example: 'Reporte enviado correctamente' },
                    enviadoA: { type: 'string', format: 'email', example: 'otro-destino@email.com' },
                    periodo: {
                        type: 'object',
                        properties: {
                            mes: { type: 'integer', example: 6 },
                            anio: { type: 'integer', example: 2026 }
                        }
                    },
                    messageId: { type: 'string', example: '<abc123@finanzas.com>' },
                    previewURL: { type: 'string', nullable: true, example: 'https://ethereal.email/message/abc123' }
                }
            }
        }
    },
    paths: {
        '/api/users/register': {
            post: {
                tags: ['Auth'],
                summary: 'Registrar usuario',
                description: 'Crea una cuenta nueva y almacena la contraseña hasheada.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegisterInput' },
                            example: {
                                name: 'Usuario Demo',
                                email: 'demo@example.com',
                                password: 'Password123'
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Usuario creado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/CreatedUser' }
                            }
                        }
                    },
                    400: { description: 'Error de validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    409: { description: 'Email ya registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ConflictResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/users/login': {
            post: {
                tags: ['Auth'],
                summary: 'Iniciar sesión',
                description: 'Valida credenciales y devuelve un JWT.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Token emitido',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthTokenResponse' }
                            }
                        }
                    },
                    400: { description: 'Error de validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Credenciales inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/users/profile': {
            get: {
                tags: ['Auth'],
                summary: 'Obtener perfil',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Perfil del usuario', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfile' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    404: { description: 'Usuario no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            },
            put: {
                tags: ['Auth'],
                summary: 'Actualizar perfil',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/UpdateUserInput' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Perfil actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfile' } } } },
                    400: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    404: { description: 'Usuario no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            },
            delete: {
                tags: ['Auth'],
                summary: 'Eliminar cuenta',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Cuenta eliminada',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { message: { type: 'string', example: 'User deleted successfully' } }
                                }
                            }
                        }
                    },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    404: { description: 'Usuario no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/categories': {
            get: {
                tags: ['Categories'],
                summary: 'Listar categorías',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Lista de categorías del usuario',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } }
                            }
                        }
                    },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            },
            post: {
                tags: ['Categories'],
                summary: 'Crear categoría',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CategoryInput' }
                        }
                    }
                },
                responses: {
                    201: { description: 'Categoría creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
                    400: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/categories/{id}': {
            put: {
                tags: ['Categories'],
                summary: 'Actualizar categoría',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' }, description: 'ID de la categoría' }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CategoryUpdateInput' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Categoría actualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
                    400: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    404: { description: 'Categoría no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            },
            delete: {
                tags: ['Categories'],
                summary: 'Eliminar categoría',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' }, description: 'ID de la categoría' }
                ],
                responses: {
                    200: {
                        description: 'Categoría eliminada',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { mensaje: { type: 'string', example: 'Categoría eliminada correctamente' } }
                                }
                            }
                        }
                    },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    400: { description: 'ID de categoría inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    404: { description: 'Categoría no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/transactions': {
            get: {
                tags: ['Transactions'],
                summary: 'Listar transacciones',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'tipo', in: 'query', schema: { type: 'string', enum: ['ingreso', 'gasto'] }, description: 'Filtrar por tipo' },
                    { name: 'categoria', in: 'query', schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' }, description: 'Filtrar por ID de categoría' },
                    { name: 'mes', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 12 }, description: 'Mes del período a consultar. Debe enviarse junto con anio.' },
                    { name: 'anio', in: 'query', schema: { type: 'integer', minimum: 2000 }, description: 'Año del período a consultar. Debe enviarse junto con mes.' },
                    { name: 'orden', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] }, description: 'Orden por fecha' }
                ],
                responses: {
                    200: {
                        description: 'Lista de transacciones',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Transaction' } }
                            }
                        }
                    },
                    400: { description: 'Parámetros de consulta inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            },
            post: {
                tags: ['Transactions'],
                summary: 'Crear transacción',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/TransactionInput' }
                        }
                    }
                },
                responses: {
                    201: { description: 'Transacción creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Transaction' } } } },
                    400: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    404: { description: 'Categoría no encontrada o no pertenece al usuario', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/transactions/{id}': {
            get: {
                tags: ['Transactions'],
                summary: 'Obtener una transacción',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' }, description: 'ID de la transacción' }
                ],
                responses: {
                    200: { description: 'Transacción encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Transaction' } } } },
                    400: { description: 'ID de transacción inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    404: { description: 'Transacción no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            },
            put: {
                tags: ['Transactions'],
                summary: 'Actualizar transacción',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' }, description: 'ID de la transacción' }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/TransactionUpdateInput' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Transacción actualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Transaction' } } } },
                    400: { description: 'ID de transacción o datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    404: { description: 'Transacción o categoría no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            },
            delete: {
                tags: ['Transactions'],
                summary: 'Eliminar transacción',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' }, description: 'ID de la transacción' }
                ],
                responses: {
                    200: {
                        description: 'Transacción eliminada',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { mensaje: { type: 'string', example: 'Transacción eliminada correctamente' } }
                                }
                            }
                        }
                    },
                    400: { description: 'ID de transacción inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    404: { description: 'Transacción no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/budgets': {
            get: {
                tags: ['Budgets'],
                summary: 'Listar presupuestos',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'categoria', in: 'query', schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' }, description: 'Filtrar por categoría' },
                    { name: 'mes', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 12 }, description: 'Filtrar por mes' },
                    { name: 'anio', in: 'query', schema: { type: 'integer', minimum: 2000 }, description: 'Filtrar por año' }
                ],
                responses: {
                    200: {
                        description: 'Lista de presupuestos',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Budget' } }
                            }
                        }
                    },
                    400: { description: 'Parámetros de consulta inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            },
            post: {
                tags: ['Budgets'],
                summary: 'Crear presupuesto',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/BudgetInput' }
                        }
                    }
                },
                responses: {
                    201: { description: 'Presupuesto creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Budget' } } } },
                    400: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    404: { description: 'Categoría no encontrada o no pertenece al usuario', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/budgets/{id}': {
            put: {
                tags: ['Budgets'],
                summary: 'Actualizar presupuesto',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' }, description: 'ID del presupuesto' }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/BudgetUpdateInput' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Presupuesto actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Budget' } } } },
                    400: { description: 'ID de presupuesto o datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    404: { description: 'Presupuesto o categoría no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            },
            delete: {
                tags: ['Budgets'],
                summary: 'Eliminar presupuesto',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' }, description: 'ID del presupuesto' }
                ],
                responses: {
                    200: {
                        description: 'Presupuesto eliminado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { mensaje: { type: 'string', example: 'Presupuesto eliminado correctamente' } }
                                }
                            }
                        }
                    },
                    400: { description: 'ID de presupuesto inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    404: { description: 'Presupuesto no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/stats/monthly': {
            get: {
                tags: ['Stats'],
                summary: 'Estadísticas mensuales',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'mes', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 12 }, description: 'Mes a consultar. Si se omite, usa el actual.' },
                    { name: 'anio', in: 'query', schema: { type: 'integer', minimum: 2000 }, description: 'Año a consultar. Si se omite, usa el actual.' }
                ],
                responses: {
                    200: { description: 'Indicadores del período', content: { 'application/json': { schema: { $ref: '#/components/schemas/MonthlyStats' } } } },
                    400: { description: 'Parámetros de mes o año inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/stats/categories': {
            get: {
                tags: ['Stats'],
                summary: 'Gastos por categoría',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'mes', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 12 }, description: 'Mes opcional; debe enviarse junto con anio' },
                    { name: 'anio', in: 'query', schema: { type: 'integer', minimum: 2000 }, description: 'Año opcional; debe enviarse junto con mes' }
                ],
                responses: {
                    200: { description: 'Resumen por categoría', content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryStats' } } } },
                    400: { description: 'Parámetros de mes o año inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/stats/trends': {
            get: {
                tags: ['Stats'],
                summary: 'Tendencias financieras',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'meses', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 24 }, description: 'Cantidad de meses a analizar. Por defecto 6, máximo 24.' }
                ],
                responses: {
                    200: { description: 'Evolución temporal', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrendsStats' } } } },
                    400: { description: 'Cantidad de meses inválida', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/reports/send': {
            post: {
                tags: ['Reports'],
                summary: 'Enviar reporte financiero por correo',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: false,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ReportSendInput' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Reporte enviado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ReportSendResponse' } } } },
                    400: { description: 'Datos inválidos o sin destinatario', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Token faltante o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    502: { description: 'No fue posible enviar el reporte', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        }
    }
}

export default swaggerSpec
