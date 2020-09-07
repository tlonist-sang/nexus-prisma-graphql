/*
- Get GraphQLServer arguments ready
eg) new GraphQLServer({
    schema, 
    context
})
*/

type schemaType = Nexus.nexusSchema
type contextType = {
    prisma: Prisma.prisma
}

let prisma = Prisma.prismaClient()
let prismaContext: contextType = {prisma: prisma}
let nexusSchema: schemaType = Schema.schema;