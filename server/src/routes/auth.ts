import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function authRoutes(fastify: FastifyInstance) {
    fastify.get('/me', {
        onRequest: [authenticate]
    }, async (request) => {
        return { user: request.user }
    })

    fastify.post('/users', async (request) => {
        const createUserBody = z.object({
            access_token: z.string({
                invalid_type_error: 'access_token must be a string'
            }),
        })

        const { access_token } = createUserBody.parse(request.body)

        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })

        const userData = await userResponse.json()

        const userInfoSchema = z.object({
            id: z.string({ invalid_type_error: 'id must be a string' }),
            email: z.string({ invalid_type_error: 'email must be a string' }).email({ message: 'Invalid email' }),
            name: z.string({ invalid_type_error: 'name must be a string' }),
            picture: z.string({ invalid_type_error: 'picture must be a string' }).url({ message: 'Invalid picture url' }),
        })

        const userInfo = userInfoSchema.parse(userData)

        let user = await prisma.user.findUnique({
            where: {
                googleId: userInfo.id,
            }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    googleId: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    avatarUrl: userInfo.picture,

                }
            })
        }

        const token = fastify.jwt.sign({
            name: user.name,
            avatarUrl: user.avatarUrl,
        }, {
            sub: user.id,
            expiresIn: 60 * 5,
        })

        return { token }
    })
}