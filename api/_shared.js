import {createClient} from '@supabase/supabase-js';
export const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
export const pub=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const admin=()=>createClient(url,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const err=(message,status=403,code='ACCESS_DENIED')=>Object.assign(new Error(message),{status,code});
function sessionIdFromVerifiedToken(token,user){
  const part=token.split('.')[1];
  if(!part)throw err('Token inválido',401,'INVALID_TOKEN');
  let claims;
  try{claims=JSON.parse(Buffer.from(part,'base64url').toString('utf8'))}catch{throw err('Token inválido',401,'INVALID_TOKEN')}
  // Claims are read only AFTER auth.getUser(token) has validated the JWT with Supabase.
  if(claims.sub!==user.id||typeof claims.session_id!=='string'||!/^[0-9a-f-]{36}$/i.test(claims.session_id))throw err('Sessão sem identificador válido',401,'INVALID_SESSION');
  return claims.session_id;
}
export async function requireAuthenticatedUser(req){
  const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
  if(!token)throw err('Sessão necessária',401,'LOGIN_REQUIRED');
  const {data,error}=await admin().auth.getUser(token);
  if(error||!data.user)throw err('Sessão inválida',401,'INVALID_TOKEN');
  return {user:data.user,sessionId:sessionIdFromVerifiedToken(token,data.user)};
}
export async function requireUser(req){
  const {user,sessionId}=await requireAuthenticatedUser(req);
  const {data,error}=await admin().from('sessoes_ativas').select('session_id').eq('user_id',user.id).maybeSingle();
  if(error)throw error;
  if(!data)throw err('Inicia sessão novamente para autorizar este dispositivo.',403,'SESSION_NOT_REGISTERED');
  if(data.session_id!==sessionId)throw err('A tua conta foi iniciada noutro dispositivo.',403,'SESSION_REPLACED');
  return user;
}
export async function hasAccess(id){const {data,error}=await admin().from('acessos').select('acesso_ativo').eq('user_id',id).maybeSingle();if(error)throw error;return data?.acesso_ativo===true}
export function fail(res,e){res.setHeader('Cache-Control','no-store');res.status(e.status||500).json({error:e.status?e.message:'Erro no servidor',...(e.code?{code:e.code}:{})})}
