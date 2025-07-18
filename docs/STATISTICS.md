# Guide des Statistiques Avancées et Carte Globale

## 🎯 Vue d'ensemble

Le dashboard Fliiinker dispose maintenant de trois onglets principaux :
1. **Liste des Fliiinkers** : Vue existante avec cartes individuelles
2. **Statistiques avancées** : Analyses détaillées des prix et services
3. **Carte globale** : Visualisation géographique avec densités

## 📊 Statistiques Avancées

### Métriques Globales

**Cartes de statistiques rapides :**
- **Prix moyen global** : Moyenne de tous les tarifs horaires
- **Rayon moyen** : Moyenne des rayons d'intervention
- **Services actifs** : Nombre de services différents proposés
- **Total Fliiinkers** : Nombre total de prestataires

### Tableau des Services

**Colonnes affichées :**
- **Service** : Nom du service
- **Fliiinkers** : Nombre de prestataires pour ce service
- **Prix moyen** : Tarif horaire moyen
- **Prix max** : Tarif le plus élevé
- **Prix min** : Tarif le plus bas
- **Rayon moyen** : Rayon d'intervention moyen
- **Prix le plus élevé** : Nom du fliiinker avec le tarif maximum

### Top 3 par Service

**Podium des prix :**
- 🥇 **1er place** : Badge doré
- 🥈 **2ème place** : Badge argenté  
- 🥉 **3ème place** : Badge bronze

**Informations affichées :**
- Nom du fliiinker
- Prix horaire exact
- Classement visuel par couleur

### Répartitions par Tranches

#### Prix
- **0-25€** : Services économiques
- **25-50€** : Services standards
- **50-75€** : Services premium
- **75-100€** : Services haut de gamme
- **100€+** : Services luxury

#### Rayons
- **0-5km** : Service local
- **5-10km** : Service de proximité
- **10-20km** : Service étendu
- **20-50km** : Service régional
- **50km+** : Service national

## 🗺️ Carte Globale

### Fonctionnalités Principales

#### Visualisation des Densités
- **Cercles simples** : Zone de service individuelle (opacité 30%)
- **Chevauchement léger** : Zones qui se croisent (opacité 60%)
- **Forte densité** : Zones très concentrées (opacité 80%)

#### Calcul d'Intensité
```javascript
// Algorithme de chevauchement
const getOverlapIntensity = (lat, lng, radius) => {
  let intensity = 1
  // Pour chaque autre zone
  serviceZones.forEach(zone => {
    const distance = calculateDistance(lat, lng, zone.lat, zone.lng)
    const combinedRadius = (radius + zone.radius) / 1000
    
    // Si les zones se chevauchent
    if (distance < combinedRadius) {
      const overlapRatio = 1 - (distance / combinedRadius)
      intensity += overlapRatio * 0.5
    }
  })
  
  return Math.min(intensity, 3) // Maximum 3x
}
```

### Contrôles Interactifs

#### Filtres
- **Service** : Afficher uniquement un service spécifique
- **Tous les services** : Vue complète

#### Toggles
- **👁️ Densité** : Afficher/masquer les cercles de service
- **👁️ Marqueurs** : Afficher/masquer les positions des fliiinkers

### Couleurs par Service

**Palette de 8 couleurs :**
1. 🔵 Bleu (#3b82f6)
2. 🟢 Vert (#10b981) 
3. 🟠 Orange (#f59e0b)
4. 🔴 Rouge (#ef4444)
5. 🟣 Violet (#8b5cf6)
6. 🩵 Cyan (#06b6d4)
7. 🟤 Orange foncé (#f97316)
8. 🟡 Lime (#84cc16)

### Popups Informatifs

#### Sur les Marqueurs
- Photo du fliiinker
- Nom complet
- Email
- Nombre de services
- Type (Pro/Particulier)
- Statut de validation

#### Sur les Zones
- Nom du service
- Nom du prestataire
- Rayon d'intervention (km)
- Tarif horaire
- Intensité de chevauchement

### Statistiques de Vue

**Métriques en temps réel :**
- **Zones affichées** : Nombre de cercles visibles
- **Prix moyen/h** : Moyenne des tarifs de la vue actuelle
- **Rayon moyen** : Moyenne des rayons de la vue actuelle
- **Fliiinkers uniques** : Nombre de prestataires distincts

## 🔧 Utilisation Pratique

### Analyse des Prix par Service

1. **Aller à l'onglet "Statistiques"**
2. **Consulter le tableau** pour voir les moyennes
3. **Regarder le Top 3** pour identifier les leaders
4. **Analyser les répartitions** pour comprendre le marché

### Analyse Géographique

1. **Aller à l'onglet "Carte globale"**
2. **Observer les zones de densité** (couleurs foncées)
3. **Filtrer par service** pour voir la répartition
4. **Cliquer sur les zones** pour les détails

### Détection des Opportunités

#### Zones Sous-Desservies
- Peu de marqueurs
- Cercles clairsemés
- Faible intensité de couleur

#### Zones Saturées
- Beaucoup de chevauchements
- Couleurs très foncées
- Intensité > 2x

#### Écarts de Prix
- Comparer les prix min/max par service
- Identifier les services premium
- Repérer les opportunités tarifaires

## 💡 Insights Business

### Optimisation Tarifaire
- **Services sous-évalués** : Prix moyen bas vs demande
- **Services premium** : Tarifs élevés soutenus par la qualité
- **Écarts importants** : Opportunités d'harmonisation

### Expansion Géographique
- **Zones blanches** : Pas de couverture
- **Zones saturées** : Forte concurrence
- **Zones optimales** : Couverture modérée, demande présente

### Stratégie de Services
- **Services populaires** : Beaucoup de prestataires
- **Niches rentables** : Peu de concurrence, prix élevés
- **Tendances émergentes** : Nouveaux services à fort potentiel

## 📈 Métriques Clés

### KPIs de Performance
- **Taux de couverture géographique**
- **Densité moyenne par zone**
- **Écart-type des prix par service**
- **Ratio prestataires Pro/Particulier**

### Indicateurs de Marché
- **Prix médian vs prix moyen**
- **Coefficient de variation des tarifs**
- **Index de concentration géographique**
- **Taux de saturation par zone** 