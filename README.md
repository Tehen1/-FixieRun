# Gestion des domaines via cPanel et Cloudflare

Ce projet permet de gérer l'ajout d'un domaine sur cPanel et la création d'un enregistrement DNS chez Cloudflare
en utilisant un code structuré, la configuration via un fichier .env et une architecture modulaire.

## Structure du projet
.
├── README.md
├── requirements.txt
├── .env.example
├── src/
│   ├── __init__.py
│   ├── config.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── cpanel.py
│   │   └── cloudflare.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── domain.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── logger.py
│   │   └── validators.py
│   └── main.py
└── tests/
    ├── __init__.py
    └── test_domain_management.py

