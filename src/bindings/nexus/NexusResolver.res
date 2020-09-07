

type infoType
type parentType
type returnType
type ctxType<'instance> = {
  prisma: 'instance
}

type mutationResolver<'instance> = {
    @bs.as("type")
    types: string, 
    @bs.as("args")
    args_: NexusArg.plainArgsType,
    resolve: parentType => NexusArg.argsType => ctxType<'instance> => infoType => Js.Promise.t<returnType>
}
