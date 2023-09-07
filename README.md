# ODEMA-VIZ

## Lancement du projet

### Mode développement
##### Pré-requis

Avoir node installé sur le poste en mode développement
Installer Node 18 > afin d'assurer la prise en charge des dependencies

#### Installation des dépendances

Les dépendances sont répertoriés dans le fichier package.json

```bach
$ npm install
```

#### Lancement du projet

```bach
$ npm run dev
```

Le projet tourne en localhost sur un numéro de port décrit dans le terminal dans le cas où le lancement du projet s'est effectué avec succès.

Ouvrez une fenêtre de navigateur à l'adresse indiquée.

### Mise en Production

#### Compilation
Après avoir confirmé que l'application fonctionne en mode développement, vous pourrez lancer la commande de mise en production.

```bach
$ npm run build
```

La commande lit le point d'entrée principal de l'application, le fichier `App.tsx` qui contient la totalité du javascript de l'application.
Ce point d'entrée est défini dans le fichier `main.tsx` , il peut être redéfini (bien étudier le cas avant modification).

La compilation crée un dossier `.dist`  contenant le fichier index.html, incluant le fichier .js et .css dans le dossier `assets`.

Elle suit une directive `base` écrite dans le fichier `vite.config.ts` qui implique que chaque fois que cette compilation aura lieu, le fichier index.html pointera systématiquement sur le dossier assets peu importe l'endroit où seront placés ces fichiers sur le serveur.
En contrepartie, ils devront toujours être de paire.

#### Démarrage de l'application sur le serveur

Transférez la structure du dossier `.dist` avec votre protocole favoris (SFTP par exemple) vers votre serveur, ouvrez votre navigateur et interrogez le chemin du serveur sur lequel vous avez décidé de placer votre projet.

**Remarque**: la lecture du fichier index.html avec l'ensemble de son javascript et de son css nécessite à minima un serveur web pour le lire, il ne peut être lu directement par l'ouverture du fichier html sous peine de provoquer un CORS
