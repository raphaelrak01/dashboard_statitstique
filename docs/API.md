# API Documentation

## Endpoints disponibles

### GET /api/fliiinkers

Récupère la liste des fliiinkers éligibles avec toutes leurs données associées.

**Paramètres de requête :**
- `stats` (optionnel) : Si `true`, retourne uniquement les statistiques

**Réponse success :**
```json
{
  "success": true,
  "data": [
    {
      "profile": {
        "id": "uuid",
        "created_at": "2024-01-01T00:00:00.000Z",
        "email": "fliiinker@example.com",
        "first_name": "Prénom",
        "last_name": "Nom",
        "is_fliiiinker": true,
        "avatar": "url",
        "gender": "other",
        "phone": "0600000000",
        "birthday": "1990-01-01"
      },
      "fliiinkerProfile": {
        "id": "uuid",
        "status": "active",
        "is_pro": true,
        "is_validated": true,
        "description": "Description",
        "tagline": "Expert en services"
      },
      "services": [...],
      "addresses": [...],
      "administrativeData": {...},
      "addressLocations": [...]
    }
  ],
  "count": 10
}
```

**Réponse error :**
```json
{
  "success": false,
  "error": "Message d'erreur",
  "details": "Détails supplémentaires"
}
```

**Exemples d'utilisation :**

```javascript
// Récupérer tous les fliiinkers
const response = await fetch('/api/fliiinkers');
const data = await response.json();

// Récupérer uniquement les statistiques
const statsResponse = await fetch('/api/fliiinkers?stats=true');
const stats = await statsResponse.json();
```

## Filtres appliqués automatiquement

### IDs exclus
Les profils avec les IDs suivants sont automatiquement exclus :
- 54328bd9-7e9b-40c9-9db8-f30605e61697
- 660a1a02-4947-49bf-9597-159f1fdde7aa
- [... liste complète dans le code]

### Critères d'éligibilité
- `is_fliiiinker = true` dans `public_profile`
- ID pas dans la liste d'exclusion

## Structure des données

### PublicProfile
- Informations de base de l'utilisateur
- Email, nom, prénom, téléphone
- Avatar et genre

### FliiinkerProfile  
- Profil spécifique fliiinker
- Statut, validation, type pro
- Description et tagline

### Services
- Services proposés par le fliiinker
- Tarifs horaires et descriptions
- Statut actif/inactif

### Adresses
- Localisations du fliiinker
- Coordonnées GPS
- Adresse par défaut

### AdministrativeData
- Données de vérification
- Statut des documents
- Informations entrepreneuriales

## Gestion des erreurs

L'API retourne des codes d'erreur HTTP appropriés :

- `200` : Succès
- `500` : Erreur serveur (problème Supabase, configuration, etc.)

Les messages d'erreur incluent :
- Le message principal
- Des détails pour le debugging
- Des suggestions de résolution 