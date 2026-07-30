import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// 1. Criamos a conexão com o banco usando a variável de ambiente
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// 2. Criamos o adaptador do Prisma
const adapter = new PrismaPg(pool);

// 3. Inicializamos o Prisma com o adaptador
const prisma = new PrismaClient({ adapter });


const app = Fastify({
    logger: true
});


app.get('/', async (request, reply) => {
  return { 
    status: 'ok', 
    message: 'Servidor SaaS operando com sucesso!' 
  };
});

app.post('/lead',async (request,reply) => {
    const { name, email, empresa } = request.body as { name: string; email: string; empresa?: string };

    const novoLead = await prisma.lead.create({
        data: {
            name,
            email,
            empresa: empresa || null
        }
    });
    return reply.status(201).send(novoLead);

})

app.get('/leads', async (request, reply) => {
  const leads = await prisma.lead.findMany();
  return leads;
});

const start = async () => {
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Servidor rodando na porta 3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();