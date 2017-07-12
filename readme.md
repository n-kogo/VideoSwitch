
Notice: Lorsqu'il y a une * devant une ligne, il y a un onglet pour t'aider


Etapes pour bien travailler:

I - Créer l'architecture du projet:
- un fichier index.html à la racine
- un dossier "assets" pour les médias
- un fichier style.css
- un fichier index.ts


II - Base du fichier html:
* - Appeler le fichier css dans le <head> avec la balise <link>
* - Appeler le fichier js à la fin du body avec la balise <script>
- Pas de jQuery au final, on va tout faire en Javascript pur.
* - inclure 3 balises <video> avec leur sources, et un attribut ID (pour pouvoir les appeler plus tard avec le javascript)


II - Base du fichier JS:
* - Il va falloir apprendre la base de l'API pour manipuler le DOM ( le HTML).
* [document, video, element.classList], regarde getElementById, et l'API pour manipuler une vidéo.
- Essaye de lancer une vidéo au chargement de la page avec du code :)
- Tu vas avoir besoin de window.onload pour que ton code marche.
ex: window.onload = function(){
  *ton code ici*
}
ça permet d'attendre que tous les éléments de ta page soient chargés, et accessible par le JS.

- appeler l'audio, et le lancer
- boutons jouent les videos
-
