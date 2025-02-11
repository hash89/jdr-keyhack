# jdr-keyhack
Key hack app for life-size role-playing game

# Installation
```sh
az webapp up --name hack-key --runtime "PYTHON:3.9" --sku F1
```

```sh
az webapp deployment github-actions add --repo "hash89/jdr-keyhack" --resource-group hadrien.puissant_asp_3049 --branch master --name hack-key --login-with-github
```