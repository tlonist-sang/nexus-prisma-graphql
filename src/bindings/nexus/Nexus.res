/*
- Bind nexus related functionalities
const schema = makeSchema({
    types,
    plugins:[nexusSchemaPrisma()],
    outputs: {
        schema: __dirname + "/../schema.graphql"
    }
})
*/

type nexusSchema
/*
    mutationField, objectType, stringArg, intArg etc..
*/
type objectType;
type mutationField;

type nexusMakeSchemaType = 
| NexusObjectType(objectType)
| NexusMutationField(mutationField)

type nexusSchemaPlugin
type nexusSchemaPath = {
    schema: string
}

type nexusSchemaOptions = {
    types: array<nexusMakeSchemaType>,
    plugins: array<nexusSchemaPlugin>,
    outputs: nexusSchemaPath,
}

@bs.module("@nexus/schema")
external makeSchema: nexusSchemaOptions => nexusSchema = "makeSchema"


/**
Takes nexusObjectOptions, returns nexusObjectType
https://nexus.js.org/docs/api-objecttype 

const User = objectType({
  name: "User",
  definition(t) {
    t.int("id", { description: "Id of the user" });
    t.string("fullName", { description: "Full name of the user" });
    t.field("status", { type: "StatusEnum" });
    t.list.field("posts", {
      type: Post, // or "Post"
      resolve(root, args, ctx) {
        return ctx.getUser(root.id).posts();
      },
    });
  },
});
**/
type nexusObjectTypeOptions = {
    name: string
    definition: Prisma.prismaObject => unit
}
type nexusObjectType
@bs.module("@nexus/schema")
external objectType: nexusObjectTypeOptions => nexusObjectType = "objectType"

/**
Takes nexusMutationFieldOptions, returns mutationField
const createOrder = mutationField("createOrder", {
    type: "Order",
    args: {}, 
    async resolve(parent, {grade, quantity, userId}, ctx, info){}
})
**/
@bs.module("@nexus/schema")
external mutationField: (~name: string, NexusResolver.mutationResolver<'instance>) => mutationField = "mutationField"

@bs.module("nexus-plugin-prisma/schema'")
external nexusSchemaPrisma: unit => nexusSchemaPlugin = "nexusSchemaPlugin"

@bs.module("@nexus/schema")
external stringArg: string=>string = "stringArg"

