# Jegybazar

Jegybazár alkalmazásunkat frissítettük Angular 5-re (majdnem teljesen)

# lépések amik kellettek
* https://github.com/angular/angular-cli
* https://angular-update-guide.firebaseapp.com/

## Globális Angular cli frissítése 1.5-re 
(ezeket a parancsokat a terminalban kell kiadni)

``` bash
npm uninstall -g @angular/cli
npm install -g @angular/cli@latest
```

## lokális frissítés

```bash
rm -rf node_modules dist package-lock.json
npm install
```

# Todo:
 
* stream-eket átírni lettable verzióra, de így is működik
* preservewhitespace-t beállítani
