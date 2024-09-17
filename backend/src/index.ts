import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode,sign,verify} from 'hono/jwt'
import { jwt } from 'hono/jwt';
// Create the main Hono app
const app = new Hono();

app.post('/api/v1/signup', async (c) => {
	const prisma = new PrismaClient({
		//@ts-ignore
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate())
	const body=await c.req.json();
	const user=await prisma.user.create({
		data:{
			email: body.email,
			password: body.password,
		},
	})
	//@ts-ignore
	const token=await sign({id:user.id},c.env.JWT_SECRET)
	return c.json({
		jwt: token
	})
})

app.post('/api/v1/signin', (c) => {
	return c.text('signin route')
})

app.get('/api/v1/blog/:id', (c) => {
	const id = c.req.param('id')
	console.log(id);
	return c.text('get blog route')
})

app.post('/api/v1/blog', (c) => {
	return c.text('signin route')
})

app.put('/api/v1/blog', (c) => {
	return c.text('signin route')
})

app.use('/message/*',async(c,next)=>{
	await next()
})


export default app;
