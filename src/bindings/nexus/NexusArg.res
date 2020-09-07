
/*
    - defines argtype for resolve function

     let createdUser = await ctx.prisma.user->create({
            data: {
                name,
                orders, 
                crops: {
                    create: [{
                        name: crop
                    }],
                }
            },
            include : {
                crops: true
            }
        })
*/

type nameType = {
    name: string
}

type cropBoolType = {
    crops: bool
}

type cropCreateType = {
    create: array<nameType>
}    

type argsType = {
    name: string,
    orders: string,
    crops: cropCreateType
}

type dataArgsType = {
    data: argsType,
    @bs.as("include")
    _include: cropBoolType
}

type plainArgsType = {
    name: string,
    orders: string,
    crop: string
}
