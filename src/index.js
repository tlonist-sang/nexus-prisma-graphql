const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const { makeSchema } = require('@nexus/schema');
const {nexusSchemaPrisma} = require('nexus-plugin-prisma/schema');
const types = require('./schema');
const { NexusSchemaExtension } = require('@nexus/schema/dist/extensions');

const schema = makeSchema({
    types,
    plugins:[nexusSchemaPrisma()],
    outputs: {
        schema: __dirname + "/../schema.graphql"
    }
})
 
const prisma = new PrismaClient();
const server = new GraphQLServer({
    schema,
    context: prisma
})

server.start(()=>console.log('Server is running~!'))