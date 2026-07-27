# GuessIt

GuessIt organise une partie locale de déduction sociale jouée à plusieurs sur un appareil
partagé.

## Language

**Partie**:
Session qui conserve les joueurs et leurs scores pendant plusieurs manches.
_Avoid_: Session, tournoi

**Joueur**:
Participant nommé d’une partie avec un score cumulé; un joueur ajouté commence à zéro. Un joueur
retiré quitte la partie et perd son score.
_Avoid_: Profil, compte

**Manche**:
Cycle de jeu autour d’un mot secret, depuis la distribution des rôles jusqu’au résultat.
_Avoid_: Partie, tour

**Manche annulée**:
Manche interrompue par un retour au menu principal; elle ne modifie aucun score et ne compte pas
dans la numérotation des manches terminées.
_Avoid_: Abandon, défaite

**Échec du Complice**:
Fin de manche où le mot secret reste introuvable à l’expiration du temps ou après un abandon; le
Complice perd un point, même si son score devient négatif.
_Avoid_: Manche annulée

**Menu principal**:
Espace permettant de modifier les joueurs et les réglages sans terminer la partie.
_Avoid_: Accueil, configuration
