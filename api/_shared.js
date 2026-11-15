import {createClient} from '@supabase/supabase-js';
export const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
export const pub=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const admin=()=>createClient(url,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
export async function requireUser(req){const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');if(!token)throw Object.assign(new Error('Sessão necessária'),{status:401});const {data,error}=await admin().auth.getUser(token);if(error||!data.user)throw Object.assign(new Error('Sessão inválida'),{status:401});return data.user;}
export async function hasAccess(id){const {data,error}=await admin().from('acessos').select('acesso_ativo').eq('user_id',id).maybeSingle();if(error)throw error;return data?.acesso_ativo===true}
export function fail(res,e){res.status(e.status||500).json({error:e.status?e.message:'Erro no servidor'})}
