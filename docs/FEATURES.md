# Guide des fonctionnalités

## 🗂️ Vue d'ensemble

### Interface principale
- **Cartes fliiinker** : Aperçu compact avec informations essentielles
- **Filtres avancés** : Recherche par critères multiples
- **Statistiques** : Métriques en temps réel
- **Actions rapides** : Boutons de décision directement sur les cartes

## 👁️ Vue détaillée des fliiinkers

### Accès
Cliquez sur le bouton **"Voir les détails"** sur n'importe quelle carte fliiinker.

### Informations affichées

#### Colonne gauche - Profil personnel
- **Statuts** : Profil, type (Pro/Particulier), validation
- **Contact** : Email, téléphone, date de naissance
- **Vérifications** : Identité, sécurité sociale, permis, véhicule, statut entrepreneur

#### Colonne centrale - Services et descriptions
- **Description du profil** : Présentation générale du fliiinker
- **Services proposés** : Liste détaillée avec :
  - Nom du service (depuis la table `service`)
  - Tarif horaire
  - Description officielle du service
  - Description personnalisée du fliiinker
  - Description Plum (si disponible)
  - Tags et mots-clés

#### Colonne droite - Géolocalisation
- **Carte interactive** : Utilise OpenStreetMap
- **Marqueurs** : Positions des adresses du fliiinker
- **Zones de service** : Cercles bleus représentant les rayons d'intervention
- **Popups informatifs** : Détails au clic sur marqueurs et zones

## 🗺️ Fonctionnalités de la carte

### Éléments affichés
- **Marqueurs rouges** : Adresses principales et secondaires
- **Cercles bleus** : Zones de service avec rayon d'intervention
- **Popups** : Informations détaillées au clic

### Informations dans les popups

#### Sur les marqueurs d'adresse
- Nom de l'adresse
- Adresse complète
- Indication si c'est l'adresse principale

#### Sur les zones de service
- Nom du service
- Rayon d'intervention (en km)
- Tarif horaire
- Tarif avec frais (si applicable)

### Navigation
- **Zoom** : Molette de la souris ou boutons +/-
- **Déplacement** : Clic-glisser sur la carte
- **Reset** : Double-clic pour recentrer

## 🎯 Système de filtrage

### Filtres disponibles
1. **Statut du profil** : created, pending, active
2. **Validation** : validé/non validé
3. **Statut Pro** : professionnel/particulier
4. **Vérification d'identité** : vérifié, en attente, rejeté

### Utilisation
- Les filtres sont cumulatifs
- Mise à jour en temps réel
- Bouton "Réinitialiser" pour effacer tous les filtres
- Indicateurs visuels des filtres actifs

## ⚡ Actions et décisions

### Types de décisions
- **Approuver** ✅ : Le profil est validé
- **Rejeter** ❌ : Le profil est refusé
- **À revoir** ⚠️ : Nécessite une révision
- **En attente** ⏱️ : Remis en file d'attente

### Indicateurs visuels
- Contour coloré autour des cartes selon la décision
- Badge de statut dans la vue détaillée
- Mise à jour des statistiques en temps réel

## 📊 Statistiques

### Métriques affichées
- **Total** : Nombre total de fliiinkers éligibles
- **Approuvés** : Profils validés avec pourcentage
- **Rejetés** : Profils refusés avec pourcentage
- **En attente** : Profils sans décision avec pourcentage

### Barres de progression
- Visualisation en temps réel des proportions
- Couleurs distinctives par type de décision
- Pourcentages calculés automatiquement

## 🔍 Données affichées

### Sources de données
- **public_profile** : Informations de base
- **fliiinker_profile** : Profil détaillé fliiinker
- **service** : Catalogue des services disponibles
- **fliiinker_service_mtm** : Services proposés par le fliiinker
- **address** : Adresses et coordonnées GPS
- **administrative_data** : Vérifications et statuts
- **address_location** : Zones de service avec rayons

### Descriptions multiples
1. **Description du profil** : Présentation générale (table fliiinker_profile)
2. **Description du service** : Description officielle (table service)
3. **Description personnalisée** : Adaptation par le fliiinker (table fliiinker_service_mtm)
4. **Description Plum** : Description spécifique Plum (table service)

## 💡 Conseils d'utilisation

### Performance
- La carte se charge après le modal pour optimiser les performances
- Les filtres s'appliquent instantanément
- Les données sont mises en cache côté client

### Navigation
- Utilisez les filtres pour cibler des profils spécifiques
- La vue détaillée permet une évaluation complète
- Les décisions peuvent être prises depuis la vue principale ou détaillée

### Analyse
- Combinez les informations de localisation et de services
- Vérifiez les rayons d'intervention sur la carte
- Consultez toutes les descriptions pour une évaluation complète 