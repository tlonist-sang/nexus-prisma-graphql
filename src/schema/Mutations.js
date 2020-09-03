const {mutationField, inputObjectType, stringArg, intArg, arg, enumType} = require('@nexus/schema');
const {User} = require('./Query')

const createOrder = mutationField("createOrder", {
    type: "Order",
    args: {
        grade: stringArg({required: true}),
        quantity: intArg({required: true}),
        farmerId: intArg({required: false})
    }, 
    async resolve(parent, {grade, quantity, farmId}, ctx, info){
        const createOrder = await ctx.order.create({
            data: {
                grade,
                quantity,
                farmer: {
                    connect:{
                        id: farmerId
                    }
                }
            }
        })
        return createOrder;
    }
})

const createUser = mutationField("createUser", {
    type: "User",
    args: {
        name: stringArg({ required: true }),
        crops: stringArg({ required: true })
    },
    async resolve(parent, args, ctx, info) {
        const createdUser = await ctx.user.create({
            data: {
                name: args.name,
                crops: args.crops,
                orders: args.orders
            }
        })
        return createdUser;
    }
})

module.exports = {
    createUser, createOrder
}