type server
type config<'schema, 'context> = {
    schema: 'schema
    context: 'context
}

@bs.new @bs.module("graphql-yoga")
external graphQLServer: config<'schema, 'context> => server = "GraphQLServer"

@bs.send
external start: server => () = "start"

/**
const server = new GraphQLServer({
    schema,
    context: prisma
})
**/