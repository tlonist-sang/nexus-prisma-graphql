const {objectType, queryType, stringArg} = require('@nexus/schema')

const User = objectType({
    name: "User",
    definition(t) {
        t.model.id()
        t.model.created()
        t.model.crops()
        t.string("name", {nullable: false})
        t.list.field("orders", {type:"Order"})
    },
})

const Order = objectType({
    name: "Order",
    definition(t) {
        t.model.id()
        t.model.grade()
        t.field("farmer", {type:"User"})
        t.int("farmerId", {nullable: false})
        t.int("quantity", {nullable: true})
    }
})


const Query = queryType({
    definition(t) {
        t.field("userByName", {
            type: User,
            args: {
                 name: stringArg()
            },
            async resolve(parent, args, ctx, info) {
                const foundUser = await ctx.user
                .findOne({
                    where: {
                        name: args.name
                    },
                })
            
                return foundUser;
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
        })
    }
})
module.exports = {
    User, Order, Query
}