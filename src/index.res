open Belt
open GraphQLServer


let config: config<GraphQLArg.schemaType, GraphQLArg.contextType> = {
    schema: nexusSchema,
    context: prismaContext
}

let server = graphQLServer(config);