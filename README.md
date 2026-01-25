# Pizza App - Serverless Order Management System

Una aplicación serverless de gestión de pedidos para una pizzería, construida con AWS Lambda, SQS y Serverless Framework.

## 📋 Características

- **Crear pedidos**: API REST para crear nuevos pedidos
- **Consultar pedidos**: Recuperar información de pedidos por ID
- **Procesamiento asincrónico**: Uso de AWS SQS para encolar pedidos
- **Pipeline de preparación**: Flujo de trabajo con múltiples colas para procesar pedidos
- **Arquitectura serverless**: Escalado automático sin gestionar servidores

## 🏗️ Arquitectura

```
API Endpoints (HTTP)
    ↓
Lambda Functions
    ↓
SQS Queues (pending-orders-queue, prepare-orders-queue)
    ↓
Event Processors
```

### Funciones Lambda

| Función | Trigger | Descripción |
|---------|---------|-------------|
| `createOrder` | POST `/api/orders` | Crea un pedido y lo envía a la cola de pendientes |
| `getOrder` | GET `/api/orders/{id}` | Obtiene los detalles de un pedido |
| `preOrder` | SQS (pending-orders-queue) | Procesa pedidos pendientes |
| `prepareOrder` | SQS (prepare-orders-queue) | Prepara pedidos para envío |
| `sendOrder` | POST `/api/send-order` | Envía un pedido a la cola de preparación |

## 📦 Requisitos

- Node.js 22.x
- AWS CLI configurado
- Serverless Framework
- Cuenta AWS

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Configurar AWS profile
aws configure

# Desplegar a AWS
serverless deploy
```

## 📁 Estructura del Proyecto

```
├── services/
│   ├── create-order.cjs       # Handler para crear pedidos
│   ├── get-order.js           # Handler para obtener pedidos
│   ├── pre-order.js           # Procesador de cola pendiente
│   ├── prepare-order.js       # Procesador de cola de preparación
│   └── send-order.js          # Handler para enviar pedidos
├── utils/
│   └── send-queue-message.js  # Utilidad para enviar mensajes SQS
├── orders.json                # Base de datos de pedidos
├── package.json               # Dependencias
├── serverless.yml             # Configuración de Serverless Framework
└── README.md                  # Este archivo
```

## ⚙️ Configuración

### Variables de Entorno

Las siguientes variables se configuran automáticamente:

- `REGION`: Región AWS (us-east-1 por defecto)
- `PENDING_ORDER_QUEUE_URL`: URL de la cola de pedidos pendientes
- `PREPARE_ORDER_QUEUE_URL`: URL de la cola de preparación

### Permisos IAM

El rol de Lambda tiene permisos para:
- `sqs:SendMessage` en ambas colas SQS
- Acceso a variables de entorno

## 🧪 Pruebas

Usar el archivo `request.http` para probar los endpoints:

```bash
# Instalar REST Client extension en VS Code
# Luego hacer clic en "Send Request" en el archivo request.http
```

## 🛠️ Desarrollo

```bash
# Desplegar cambios
npm run deploy

# Ver logs en vivo
serverless logs -f createOrder --tail

# Eliminar stack
serverless remove
```

## 📄 Licencia

ISC

## 👤 Autor

gtrujilloca

---

**Última actualización**: Enero 2026
