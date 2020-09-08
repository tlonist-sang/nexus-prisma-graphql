open Belt
open GraphQLServer


let config: config<GraphQLArg.schemaType, GraphQLArg.contextType> = {
    schema: GraphQLArg.nexusSchema,
    context: GraphQLArg.prismaContext
}

let server = graphQLServer(config);
server->start