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

## Structure du projet
Le projet est sous forme de Single Page Application (SPA), c'est à dire qu'en réalité le projet tourne sur une seule et unique page `index.html`, bien que le projet en soit découpé sous forme de pages (deux pages) incluants les différents composants développés en React.

### Routing et pages

#### Pages et routes
Ces pages sont en réalités découpées uniquement dans le javascript. Un système de routage permet de naviguer entre elles côté client dans l'application.

Ces routes sont définies dans le fichier principal `App.tsx` . Le mode de routage principal par choix technique est `HashRouter`. Les différentes routes sont énumérées en children de ce composant. 

Les deux pages sont configurées par le composant `<Route />`, `'/'` et `'/technicalsheet/:guid'` .
`:guid` représente le **guid** d'un indicateur choisi, il s'agit d'une affectation dynamique au paramètre de la route. C'est une donnée récupérée depuis l'API identifiant les différents indicateurs disponibles.

Les deux pages principales, composants principaux dans React, sont répertoriés dans le dossier `views` .

#### Composants

Les différentes pages exploitent les différents composants développés en React pour la plupart réutilisables.
Ces composants sont répertoriés dans le dossier `components`.


### Services: Exploitation des APIs

Les APIs exploitées sont répertoriées sous forme de services dans l'application dans le dossier `services`. Elles sont réparties dans différents fichiers portant un nom significatif suivi de `*.service.ts`.

Ici nous exploitons en partie les APIs de **Geo2France** (geoweb), ainsi nous disposons d'un fichier `geoweb.service.ts`. Il dispose de plusieurs fonctions représentant un appel personnalisé en fonction d'une URL choisi. Ainsi ces fonctions sont réutilisables à la demande dans le projet, et retourne la réponse sous forme de requêtes asynchrones (Promises).

### Types

Le projet utilise **TypeScript** afin d'aider le développeur dans le développement de l'application.
Si quelque types sont parfois répertoriés dans les composants à "échelle plus petite", les types sont en général répertoriés dans le dossier `models`, comme les types de réponse des APIs par exemple.

Les types sont réparties ont des noms significatifs et sont répartis dans des fichiers au suffix `.types.ts`.

Exemple: Les APIs dans notre cas viennent en parti de Geo2France. Ainsi il existe un type parent dans le fichier `geo2France.types.ts`. qui exploitent d'autres types spécifiques dans d'autres fichiers `types.ts` .

### Fonctionnalités spécifiques

#### Cookies

Le projet exploite la librairie **js-cookie**. Elle facilite l'exploitation des cookies dans la navigation du projet.

Afin de simplifier son utilisation, les fonctions de lecture et d'écriture des cookies sont écrites dans un fichier `cookie.helper.ts` dans le dossier `helper`.
Elles peuvent par conséquent être importées dans n'importe quel fichier js. 

Ces fonctions exploitent toutes les deux un paramètre **selector** . Il s'agit d'un mot clé significatif de la donnée que vous allez traiter en cookie.
Dans notre exemple, un mot clé est 'territories' pour exploiter et lire la donnée des différents territoires sélectionnés.

#### Partage des données en URL

Afin de partager les sélections de données sur une page indicateur, il est possible de récupérer les informations depuis l'URL sur une page indicateur.

Une suite de fonctions existe dans le fichier `urlParams.helper.ts`. De la même manière que l'on exploite les données par cookie, il suffit d'utiliser un mot clé sur chacune des fonctions (exemple: 'territories'). Il est même possible de préciser une fonction de formattage de données pour exploiter correctement l'URL.

#### React Context

Parfois, certaines données doivent être accessibles et partageables n'importe où dans le projet. C'est pourquoi il existe un dossier `context`.
La liste des différents indicateurs pourrait par exemple au besoin être accessible depuis n'importe quel page/composant. Ainsi ces contextes sont importables dans n'importe quel fichier tsx, les composants enfants hériteront de la donnée.

Ils se divisent par fichiers significatifs dont la dénomination se termine en général par `Context`. Dans notre exemple `IndicatorsContext.tsx`.

Ils disposent d'une variable contenant la donnée via la fonction `createContext()` , et d'un composant `Provider` qui prendront en paramètre les composants enfants et qui accèderont à la valeur de cette variable.

#### Formatters

Au besoin de certain jeux de données, des formattages sont nécessaires.

Afin d'éviter les répétitions de code, ces fonctions sont centralisées dans un fichier `formatters.helper.ts` .
