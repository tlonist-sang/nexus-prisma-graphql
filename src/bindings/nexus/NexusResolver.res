

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
    args: NexusArg.plainArgsType,
    resolve: parentType => NexusArg.plainArgsType => ctxType<'instance> => infoType => Js.Promise.t<returnType>
}
