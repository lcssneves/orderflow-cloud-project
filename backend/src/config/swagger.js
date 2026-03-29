import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OrderFlow API',
      version: '1.0.0',
      description: 'API para gestão de pedidos e produtos - Projeto Unifor',
    },
    servers: [
      {
        url: 'https://orderflow-cloud-project.onrender.com',
        description: 'Servidor de Produção (Render)',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local (Desenvolvimento)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'number' },
            category: { type: 'string' },
            imageUrl: { type: 'string' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { $ref: '#/components/schemas/Product' },
                  quantity: { type: 'number' },
                  unitPrice: { type: 'number' },
                },
              },
            },
            total: { type: 'number' },
            status: { type: 'string', enum: ['criado', 'pago', 'enviado', 'entregue', 'cancelado'] },
            paymentMethod: { type: 'string', enum: ['credit_card', 'debit_card', 'pix', 'bank_slip'] },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Caminho para encontrar os comentários JSDoc
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📖 Swagger UI disponível em http://localhost:3000/api-docs');
};
