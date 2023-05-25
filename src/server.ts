import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { Prisma, PrismaClient } from "@prisma/client";
import { ornitorrincos } from "@prisma/client";
import cors from '@fastify/cors';

const prisma = new PrismaClient();
const app = Fastify();
app.register(cors, {
    origin: "*",
});

app.post('/create', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, name, age, description, vaccinated } = request.body as ornitorrincos;
    const ornitorrincos = await prisma.ornitorrincos.create({
        data: {
            id,
            name,
            age,
            description,
            vaccinated
        },
    });
    reply.send('Ornitorrincos created')
});


app.get('/ornitorrincoss', async (request: FastifyRequest, reply: FastifyReply) => {
    const ornitorrincoss = await prisma.ornitorrincos.findMany();
    reply.send(ornitorrincoss)
})

app.get('/ornitorrincoss/search', async (request: FastifyRequest, reply: FastifyReply) => {
    const { query } = request.query as { query: string };
    try {
        const ornitorrincoss = await prisma.ornitorrincos.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
        });
        reply.send(ornitorrincoss);
    } catch (error) {
        console.error('Something went wrong:', error);
    }
});

app.put('/ornitorrincoss/:name', async (request: FastifyRequest, reply: FastifyReply) => {
    const { name } = request.params as { name: string };
    const ornitorrincosData = request.body as Prisma.ornitorrincosUpdateInput;;

    try {
        const updatedOrnitorrincos = await prisma.ornitorrincos.updateMany({
            where: { name: name },
            data: ornitorrincosData, 
        });

        reply.send('ornitorrincos updated!')
    } catch (error) {
        console.error('Something went wrong:', error);
    }
});

app.delete('/ornitorrincoss/:name', async (request: FastifyRequest, reply: FastifyReply) => {
    const { name } = request.params as { name: string };

    try {
        const deletedOrnitorrincos = await prisma.ornitorrincos.deleteMany({
            where: { name: name },
        });

        reply.send('ornitorrincos deleted.')

    } catch (error) {
        console.error('Something went wrong:', error);
    }
});

const start = async () => {
    try {
        await app.listen({ port: 3333 });
        console.log('Server listening at http://localhost:3333');
    } catch (error) {
        console.error('Something went wrong.');
        process.exit(1);
    }
};

start();