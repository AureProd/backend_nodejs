# Template de Backend en nodejs

Template pour faire des backend en nodejs (express)

## Prérequis

Exécuté cette commande dans le dossier du projet

```bash
$ sh setup.sh
```

## Exécution du projet

### Commandes pour la production

Pour créer le container

```bash
$ docker-compose --project-name backend_template_prod --env-file .env -f docker-compose.prod.yml up --build -d
```

Pour démarer le container

```bash
$ docker-compose --project-name backend_template_prod --env-file .env -f docker-compose.prod.yml start
```

Pour arrêter le container

```bash
$ docker-compose --project-name backend_template_prod --env-file .env -f docker-compose.prod.yml stop
```

Pour détruire le container

```bash
$ docker-compose --project-name backend_template_prod --env-file .env -f docker-compose.prod.yml down
```

### Commandes pour le développement

Pour créer le container

```bash
$ docker-compose --project-name backend_template_dev --env-file .env -f docker-compose.dev.yml up --build -d
```

Pour démarer le container

```bash
$ docker-compose --project-name backend_template_dev --env-file .env -f docker-compose.dev.yml start
```

Pour arrêter le container

```bash
$ docker-compose --project-name backend_template_dev --env-file .env -f docker-compose.dev.yml stop
```

Pour détruire le container

```bash
$ docker-compose --project-name backend_template_dev --env-file .env -f docker-compose.dev.yml down
```