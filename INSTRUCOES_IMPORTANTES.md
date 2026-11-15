# VOAR É POSSÍVEL — integração paga (TESTE)

## Antes de publicar
1. No bucket privado `conteudos-voar` confirmar `days.json` e **carregar também `dia-18.mp3`**.
2. Na Vercel configurar `STRIPE_PRICE_ID` (preço teste), `STRIPE_SECRET_KEY` (sk_test), `SUPABASE_SECRET_KEY` (sb_secret), `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e, depois de criar webhook, `STRIPE_WEBHOOK_SECRET` (whsec...).
3. No Stripe Test Mode criar endpoint `https://voarepossivel.vercel.app/api/stripe-webhook` com eventos `checkout.session.completed` e `checkout.session.async_payment_succeeded`. Copiar signing secret `whsec_` para Vercel (Secret).
4. Na Supabase Authentication → URL Configuration, definir Site URL `https://voarepossivel.vercel.app` e Redirect URLs conforme necessário. Confirmar que Email sign-up está ativo.
5. Publicar no MESMO repositório GitHub, substituindo os ficheiros antigos. O `days.json` e `dia-18.mp3` deixam de estar no repositório.
6. Testar: utilizador sem compra NÃO pode abrir `/api/content`; pagamento teste deve ativar acesso; áudio privado deve funcionar. Não ativar pagamentos reais antes de validar.

## Atenção
- PWA não consegue impedir tecnicamente a instalação por terceiros; impede o acesso aos conteúdos privados.
- Conteúdos anteriormente publicados podem continuar em cópias/cache de utilizadores existentes.
- Esta versão mantém diário/progresso no armazenamento local do dispositivo; **não** sincroniza respostas entre dispositivos. Não limpar os dados do navegador durante a migração.
- Fotos e desenhos locais também não são sincronizados.
- A versão pública já tinha `days.json` e áudio disponíveis; a proteção só funciona para novos acessos após substituição e eliminação de caches antigas.
- O Stripe é de TESTE. Confirmar a chave e o preço do mesmo ambiente.
- Recomenda-se testar com uma publicação Preview e verificar a segurança antes de substituir a versão de produção.
