import {requireUser,hasAccess,fail} from './_shared.js';
export default async function handler(req,res){try{if(req.method!=='GET')return res.status(405).json({error:'Método não permitido'});const u=await requireUser(req);res.setHeader('Cache-Control','no-store, private');res.status(200).json({active:await hasAccess(u.id)})}catch(e){fail(res,e)}}
