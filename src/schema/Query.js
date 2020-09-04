const {objectType, queryType, stringArg} = require('@nexus/schema')

const User = objectType({
    name: "User",
    definition(t) {
        t.model.id()
        t.model.created()
        t.string("name", {nullable: false})
        t.list.field("crops", {type:"Crop"})
        t.list.field("orders", {type:"Order"})
    },
})

const Order = objectType({
    name: "Order",
    definition(t) {
        t.model.id()
        t.model.grade()
        t.field("user", {type:"User"})
        t.int("userId", {nullable: false})
        t.int("quantity", {nullable: true})
    }
})

const Crop = objectType({
    name: "Crop",
    definition(t) {
        t.model.id()
        t.string("name", {nullable: false})
        t.list.field("users", {type: "User"})
    }
})


const Query = queryType({
    definition(t) {
        t.field("userByName", {
            type: User,
            args: {
                 name: stringArg(),
            },
            async resolve(parent, {name}, ctx, info) {
                const foundUser = await ctx.user
                .findOne({
                    where: {
                        name
                    },
                    include: {
                        crops: true,
                        orders: true
                    }
                })
            
                return foundUser;
            }
        });
        t.field("cropByName", {
            type: Crop,
            args: {
                name: stringArg(),
            },
            async resolve(parent, {name}, ctx, info) {
                const foundCrop = await ctx.crop
                .findOne({
                    where: {
                        name
                    },
                    include: {
                        users: true
                    }
                })
                return foundCrop;
            }
        });
        t.list.field("users", {
            type: User,
            resolve: (_, args, ctx) => {
                return ctx.user.findMany()
                }
            }
        );
        t.list.field("orders", {
            type: Order,
            resolve: (_, args, ctx) => {
                return ctx.order.findMany()
            }
        }),
        t.list.field("crops", {
            type: Crop,
            resolve: (_, args, ctx) => {
                return ctx.crop.findMany()
            }
        })
    }
})
module.exports = {
    User, Order, Query, Crop
}