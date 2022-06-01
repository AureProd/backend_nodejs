
# Tests Unitaires MEP Connect

Ensembles des scripts pour les tests unitaires, pour vérifier la mise en prod de Connect

## Exécution du script

### Pour le développement

```bash
$ docker-compose --env-file .env -f docker-compose.dev.yml up --build -d
```

### Pour la production

```bash
$ docker-compose --env-file .env -f docker-compose.prod.yml up --build -d
```
