# Guide de déploiement

## Déploiement sur Vercel (recommandé)

1. **Préparer le projet :**
   ```bash
   npm run build
   ```

2. **Installer Vercel CLI :**
   ```bash
   npm i -g vercel
   ```

3. **Déployer :**
   ```bash
   vercel
   ```

4. **Configurer les variables d'environnement :**
   - Allez sur votre dashboard Vercel
   - Project Settings > Environment Variables
   - Ajoutez :
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE`

## Déploiement avec Docker

1. **Créer un Dockerfile :**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build et run :**
   ```bash
   docker build -t fliiinker-dashboard .
   docker run -p 3000:3000 --env-file .env.local fliiinker-dashboard
   ```

## Variables d'environnement requises

Pour tous les environnements de production :

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=your_service_role_key
```

## Vérifications avant déploiement

- [ ] Variables d'environnement configurées
- [ ] Accès Supabase fonctionnel
- [ ] Tests de l'API `/api/fliiinkers`
- [ ] Build sans erreurs
- [ ] Permissions de base de données correctes

## Sécurité

⚠️ **Important :**
- Ne jamais exposer la `SUPABASE_SERVICE_ROLE` côté client
- Utiliser HTTPS en production
- Vérifier les politiques RLS Supabase
- Limiter l'accès à l'interface d'administration

## Monitoring

Ajoutez des métriques pour surveiller :
- Temps de réponse de l'API
- Nombre d'erreurs Supabase
- Utilisation de la bande passante
- Performances des requêtes

## Optimisations

Pour de meilleures performances :
- Activer la compression gzip
- Utiliser un CDN pour les assets
- Mettre en cache les requêtes API
- Optimiser les requêtes Supabase avec des index 