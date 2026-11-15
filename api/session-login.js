import {requireAuthenticatedUser,admin,fail} from './_shared.js';
export default async function handler(req,res){
 try{
  if(req.method!=='POST')return res.status(405).json({error:'Método não permitido'});
  const {user,sessionId}=await requireAuthenticatedUser(req);
  // Requires a UNIQUE or PRIMARY KEY constraint on sessoes_ativas.user_id.
  const {error}=await admin().from('sessoes_ativas').upsert({user_id:user.id,session_id:sessionId,updated_at:new Date().toISOString()},{onConflict:'user_id'});
  if(error)throw error;
  res.setHeader('Cache-Control','no-store, private');res.status(200).json({ok:true});
 }catch(e){fail(res,e)}
}
