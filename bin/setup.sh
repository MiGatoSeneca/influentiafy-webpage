#!/bin/bash
echo "";
echo "Install Script 1.0.0 - May 2021";
echo "";
echo "Bienvenido al sistema de instalación para deploy";
echo "Introduce el slug de la marca";
echo "";

echo "Subiendo últimos cambios";
git add --all;
git commit -m "Uploading changes before init deploy";
git push origin master;

echo "Haciendo instalación para deploy, clave: S1queloes";
pm2 deploy ecosystem.json production setup