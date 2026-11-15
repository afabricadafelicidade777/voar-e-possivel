import Stripe from 'stripe';import {admin} from './_shared.js';
export const config={api:{bodyParser:false}};
async function rawBody(req){const chunks=[];for await(const c of req)chunks.push(c);return Buffer.concat(chunks)}
export default async function handler(req,res){if(req.method!=='POST')return res.status(405).end();const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);let event;try{event=stripe.webhooks.constructEvent(await rawBody(req),req.headers['stripe-signature'],process.env.STRIPE_WEBHOOK_SECRET)}catch(e){return res.status(400).send('Invalid signature')}
if(event.type==='checkout.session.completed'||event.type==='checkout.session.async_payment_succeeded'){const s=event.data.object;if(s.payment_status==='paid'&&s.metadata?.user_id){const {error}=await admin().from('acessos').upsert({user_id:s.metadata.user_id,stripe_customer_id:typeof s.customer==='string'?s.customer:null,stripe_checkout_session_id:s.id,acesso_ativo:true,data_compra:new Date().toISOString()},{onConflict:'user_id'});if(error){console.error('Webhook DB error',error);return res.status(500).end()}}}
res.status(200).json({received:true})}
