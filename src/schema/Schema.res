open Nexus
open NexusResolver
open Prisma

type prismaInstance = {
    user: prismaModel
}

let createUser = mutationField("createUser", {
    types: "User",
    args: {
        name: stringArg("Input name"),
        orders: stringArg("Input orders"),
        crop: stringArg("Input crop")
    },
    resolve:  (_, args, ctx: ctxType<prismaInstance>, _) => {
        let createdUser = ctx.prisma.user->create({
            data: {
                name: args.name,
                orders: args.orders,
                crops: {
                    create: [{
                        name: args_.crop
                    }],
                }
            },
            _include : {
                crops: true
            }
        })
        createdUser;
    }
})



let schema = makeSchema({
    types: [nexusMakeSchemaType(createUser) ],
    plugins: [nexusSchemaPrisma()],
    outputs: {
        schema: Util.dirname ++ "/../schema.graphql"
    }
})