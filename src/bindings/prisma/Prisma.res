/*
- Bind prisma client
- Bind prisma methods
*/

/**
    https://nexus.js.org/docs/api-objecttype
    int, string, field, list, model .. etc (can be added later)
**/
type prisma
type prismaField
type prismaList
type prismaModel

type prismaObject = {
    @bs.as("int")
    _int: string,
    @bs.as("string")
    _string: string,
    field: prismaField,
    list: prismaList,
    model: prismaModel,
}

/*
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
*/
@bs.new @bs.module("@prisma/client")
external prismaClient: unit => prisma = "PrismaClient"

@bs.send
external create: prismaModel => NexusArg.dataArgsType => Js.Promise.t<NexusResolver.returnType> = "create"
