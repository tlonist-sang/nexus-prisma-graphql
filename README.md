# Prisma create(save) schema in database
- npx prisma migrate up --experimental
- npx prisma migrate save --experimental
- npx prisma generate

# Starting the project
- npm run start (auto reloading on change)

# Prisma Relations
## One to Many
- One to many: 유저는 많은 주문을 받알 수 있지만, 한 주문은 하나의 유저를 갖습니다.

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
- Many to many: 유저는 많은 작물을 가질 수 있고, 한 작물에는 많은 유저들이 있을 수 있습니다.
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


Retrieve deeply nested data by loading several levels of relations

const users = await prisma.user.findMany({
  include: {
    posts: {
      include: {
        categories: {
          include: {
            posts: true,
          },
        },
      },
    },
  },
})

# ReScript로 구동하기
- 본격적으로 ReScript로 다뤄볼 차례입니다. ReScript가 근거하고 있는 bucklescript를 사용할 수 있도록 bs-platform을 설치합시다. (간편하게 bsb-init을 해도 됩니다.)

- ReScript의 binding feature를 이용해서 Res에서 같은 기능을 할 수 있도록 해봅시다. 크게 보면 다음 단계들로 나눠져 있습니다. (순차적인것은 아닙니다)
1. GraphQL 서버 바인딩
2. Prisma 바인딩
3. Nexus 바인딩

## GraphQL 서버 바인딩
- GraphQL 서버를 실행시키기 위해선 다음이 실행되어야 합니다.
```javascript
const server = new GraphQLServer({
    schema,
    context: prisma
})
```
- 다음이 필요합니다.
1. GraphQLServer를 만들어내는 new 
2. schema (nexus 관련) 타입 정의
3. context (prisma 관련) 타입 정의
4. graphql argument에 대한 바인딩  
5. server.start()에 대한 바인딩

## Prisma 바인딩
- Prisma는 prisma client를 사용해 DB 쿼리를 하게 해줍니다. 아직 bs-prisma 바인딩이 없으므로 직접 모든 함수들을 바인딩시켜줘야합니다.
1. prisma client 생성
2. create, findOne, findMany 등등의 함수 바인딩
3. prisma object(t.model, t.string, t.int)안에서 꺼내는 값들에 대한 바인딩

## Nexus 바인딩
- Nexus는 schema.graphql을 생성하는 역할과 prisma object와 resolve를 동시에 declare하는 역할을 합니다. 
1. Nexus에서 사용하는 함수들에 대한 바인딩 (objectType, mutationField, etc..)
2. 1에서 사용하는 함수들의 argument에 대한 바인딩
3. NexusPlugin에 대한 바인딩 (prisma와 연동)
4. 


## Prisma 바인딩
- prisma 바인딩에선 다음이 이뤄져야 합니다. 

0. ORM 명령을 실행하는 prismaClient에 대한 바인딩
1. ctx.model.에서 써야하는 모든 함수에 대한 바인딩 (create, findMany 등등)
2. arg.model 로 빼내야 하는 모든 arg 타입에 대한 바인딩 
3. resolve에 해당하는 바인딩


