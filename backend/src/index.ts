import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode,sign,verify} from 'hono/jwt'
import { jwt } from 'hono/jwt';
// Create the main Hono app
const app = new Hono();
app.use('/api/v1/blog/*',async(c,next)=>{
	//get the header
	//verify the header
	//if the header is correct,we need can proceed
	//if not,we return the user a 403 status code
	const header=c.req.header("authorization")||"";
	const token=header.split(" ")[1]
	//@ts-ignore
	const response=await verify(header,c.env.JWT_SECRET)
	if(response.id){
		next()
	}else{
		c.status(403)
		return c.json({error:"unauthorized"})
	}
})
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
