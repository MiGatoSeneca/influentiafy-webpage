#!/bin/bash
echo "";
echo "Deploy Script 1.0.0 - May 2021";
echo "";
echo "Bienvenido al sistema de deploy";
echo "";

echo "Subiendo últimos cambios";
git add --all;
git commit -m "Uploading changes before Deploy";
git push origin main;

echo "Haciendo deploy, clave: S1queloes";
pm2 deploy ecosystem.json production exec 'git reset --hard origin/master'
echo "Cabecera git reiniciada a último estable";
pm2 deploy ecosystem.json production

