const {mutationField, inputObjectType, stringArg, intArg, arg, enumType} = require('@nexus/schema');
const {Order, User, Crop} = require('./Query');
const { transformDocument } = require('@prisma/client/runtime');

const createOrder = mutationField("createOrder", {
    type: "Order",
    args: {
        grade: stringArg({required: true}),
        quantity: intArg({required: true}),
        userId: intArg({required: false})
    }, 
    async resolve(parent, {grade, quantity, userId}, ctx, info){
        const createOrder = await ctx.order.create({
            data: {
                grade,
                quantity,
                user: {
                    connect:{
                        id: userId
                    }
                }
            }
        })
        return createOrder;
    }
})

const createCrop = mutationField("createCrop", {
    type: "Crop",
    args: {
        name: stringArg({required: true})
    },
    async resolve(parent, args, ctx, info) {
        const createdCrop = await ctx.crop.create({
            data: {
                name: args.name
            }
        })
        return createdCrop;
    }
})

const updateCrop = mutationField("updateCrop", {
    type: "Crop",
    args: {
        name: stringArg(),
        user: stringArg()
    },
    async resolve(parent, args, ctx, info) {
        const {users} = await ctx.crop.findOne({
            where: {
                name: args.name
            },
            include: {
                users: true,
            }
        })
        await ctx.crop.update({
            data: {
                users: [...users, args.user]
            }
        })
    }
})

const createUser = mutationField("createUser", {
    type: "User",
    args: {
        name: stringArg({ required: true }),
        crop: stringArg({ required: true }),
    },
    async resolve(parent, {name, orders, crop}, ctx, info) {
        const createdUser = await ctx.user.create({
            data: {
                name,
                orders, 
                crops: {
                    create: [{
                        name: crop
                    }]
                }
            }
        })
        return createdUser;
    }
})

const updateUser = mutationField("updateUser", {
    type: "User",
    args: {
        name: stringArg({ required: true}),
        crop: stringArg({ required: true}),
    },
    async resolve(parent, {name, crop}, ctx, info) {       
        const {id, cropUsers} = await ctx.crop.findOne({
            where: {
                name: crop
            }
        })
        return await ctx.user.update({
            where: {name},
            data: {
                crops: {
                    connect: [{id}]
                }
            }
        })
    }
})

module.exports = {
    createUser, createOrder, createCrop, updateCrop, updateUser
}