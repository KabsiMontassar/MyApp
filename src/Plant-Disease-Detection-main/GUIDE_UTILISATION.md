# Guide d'Utilisation du Détecteur de Maladies des Plantes

Ce document explique comment utiliser le détecteur de maladies des plantes dans votre application.

> **IMPORTANT:** L'application fonctionne maintenant en mode démo par défaut, ce qui vous permet de l'utiliser sans démarrer le serveur Python.

## Modes de Fonctionnement

### 1. Mode Démo (Par Défaut)

Le détecteur fonctionne dans votre navigateur sans avoir besoin de serveur Python. L'analyse est simplifiée mais fournit des résultats réalistes.

**Avantages:**
- Fonctionne immédiatement sans configuration
- Aucune dépendance externe
- Analyse basique des images pour détecter si c'est une plante ou non

### 2. Mode Complet (Avec Serveur IA)

Pour une analyse plus précise, vous pouvez utiliser le véritable modèle d'IA en démarrant le serveur Python.

#### Prérequis
1. **Python** - Assurez-vous que Python est installé sur votre ordinateur
2. **Bibliothèques Python** - Les bibliothèques nécessaires sont installées automatiquement lorsque vous lancez le serveur

## Configuration du Mode

Le mode démo est activé par défaut. Pour utiliser le mode complet:

1. Démarrer le serveur d'IA en suivant les instructions ci-dessous
2. *Optionnel:* Dans le fichier `src/app/front-office/components/plant-disease-detection/plant-disease-detection.component.ts`, changez `useDemoMode = true` à `useDemoMode = false` si vous souhaitez que l'application utilise uniquement le serveur.

## Démarrer le serveur d'IA (Mode Complet)

Avant d'utiliser la fonctionnalité de détection de maladies des plantes, vous devez démarrer le serveur d'API Flask qui héberge le modèle d'IA.

### Méthode simplifiée (recommandée)

1. Double-cliquez sur le fichier `start_api_server.bat` dans le dossier `src/Plant-Disease-Detection-main`
2. Une fenêtre console s'ouvrira et démarrera le serveur
3. Laissez cette fenêtre ouverte pendant que vous utilisez l'application

### Méthode manuelle (alternative)

Si vous préférez lancer le serveur manuellement:

1. Ouvrez une invite de commande ou un terminal
2. Naviguez vers le répertoire du projet:
   ```
   cd src/Plant-Disease-Detection-main
   ```
3. Lancez le serveur API:
   ```
   python api_server.py
   ```
4. Laissez cette fenêtre ouverte pendant que vous utilisez l'application

## Utiliser le Détecteur de Maladies des Plantes dans l'Application

Une fois le serveur d'IA démarré, vous pouvez utiliser la fonctionnalité de détection de maladies des plantes dans l'application web:

1. Allez sur la page d'accueil de l'application
2. Cherchez le bouton "Détecter des Maladies de Plantes"
3. Cliquez sur ce bouton pour ouvrir la fenêtre de détection
4. Téléchargez une image d'une feuille de plante en cliquant sur la zone de dépôt
5. Cliquez sur le bouton "Détecter la Maladie"
6. Les résultats s'afficheront avec:
   - Le diagnostic de la maladie
   - Le niveau de confiance de la prédiction
   - Un traitement recommandé

## Résolution des Problèmes

Si vous rencontrez des problèmes:

### L'indicateur affiche "Serveur IA Hors Ligne"

- Vérifiez que vous avez lancé le serveur API comme expliqué ci-dessus
- Assurez-vous que le terminal où le serveur est lancé ne montre pas d'erreurs
- Vérifiez qu'aucun pare-feu ne bloque la communication sur le port 5000

### Message d'erreur lors de l'analyse d'image

- Assurez-vous que l'image est une photo claire d'une feuille de plante
- Essayez avec une image différente
- Vérifiez que le format de l'image est supporté (JPG, JPEG ou PNG)
- Assurez-vous que la taille de l'image n'est pas trop grande (moins de 10 Mo)

### Le serveur ne démarre pas

- Vérifiez que Python est correctement installé
- Vérifiez que tous les fichiers nécessaires sont présents dans le dossier (`PDD_completemodel.h5`, `class_labels.json`, etc.)

## Arrêter le Serveur

Lorsque vous avez terminé d'utiliser l'application:

1. Retournez à la fenêtre du terminal où le serveur est en cours d'exécution
2. Appuyez sur `Ctrl+C` pour arrêter le serveur
3. Fermez la fenêtre du terminal

## Fonctionnalités du Détecteur de Maladies

Le détecteur peut identifier 39 classes différentes comprenant:
- Diverses maladies sur les pommiers, tomates, raisins, maïs, et autres plantes
- Distinction entre les plantes saines et malades
- Fournit des recommandations de traitement personnalisées

## Notes Techniques Importantes

- Le serveur d'API fonctionne sur le port 5000 localement
- La première analyse peut prendre un peu plus de temps car le modèle se charge en mémoire
- Les prédictions sont faites localement sur votre ordinateur, les images ne sont pas envoyées à des serveurs externes
