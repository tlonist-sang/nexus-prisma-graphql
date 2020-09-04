# Prisma create(save) schema in database
- npx prisma migrate up --experimental
- npx prisma migrate save --experimental
- npx prisma generate

# Starting the project
- npm run start (auto reloading on change)

# Prisma Relations
## One to Many
- One to many: One user can have many orders, and each order has exactly one user.

```javascript
model User {
    id Int @id @default(autoincrement())
    name String @unique
    orders Order[]
}

model Order {
    id Int @id @default(autoincrement())
    user User? @relation(fields: [userId], references: [id])
    userId Int?
}
```
- **Many** side annotated with @relation(fields: [_userid], references: [_id])
- **Many** side has userId as a foregin key

### prisma syntax for 'one to many'
```javascript
const {users} = await ctx
    .crop
    .findOne({
        where: 
        {
            name: args.name
        },
        include: 
        {
            users: true,
        }
    })
```
- where: conditional search
- include: eager loading (can be neseted)
- select: selective loading (out of many keys)

## Many to Many
```javascript
model User {
    id Int @id @default(autoincrement())
    name String @unique
    crops Crop[] @relation(references: [id])
}

model Crop {
    id Int @id @default(autoincrement())
    name String? @unique
    users User[] @relation(references: [id])
}
```
- Many to many: User can have many crops, and one crop has many users cultivating it.
### Update user's crop information (adding or deleting crops one cultivates)

```javascript
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
```
- **connect** used to connect existing crop to a user. (add "banana" to "farmer1". "banana" has to be predefined)
- **sub-field** : { create, connect, include } can do on-the-flight executions like eager creating, linking and loading

```javascript
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
                    }],
                }
            },
            include : {
                crops: true
            }
        })
        return createdUser;
    }
```
- Above 'creates' a user **with** crops, and returns a user **contaning** crops. A graphQL query for above is,

```graphQL
mutation{
  createUser(
    name: "Terry"
    crop: "Melon"
  ){
    name
    crops{
      name
    }
  }
}

<!-- {
  "data": {
    "createUser": {
      "name": "유경숙",
      "crops": [
        {
          "name": "참외"
        }
      ]
    }
  }
} -->
```



