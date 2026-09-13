# 📝 To-Do List Application

Une application de gestion de tâches moderne avec stockage local, construite avec HTML, CSS et JavaScript vanilla.

## ✨ Fonctionnalités

- ✅ **Ajout de tâches** - Ajoutez facilement de nouvelles tâches
- ✅ **Marquer comme complété** - Cochez les tâches terminées
- ✅ **Suppression** - Supprimez les tâches individuelles
- ✅ **Niveaux de priorité** - Définissez haute, moyenne ou basse priorité
- ✅ **Filtrage** - Filtrez par tous, actifs ou complétés
- ✅ **Statistiques** - Suivez le total, complétés et restants
- ✅ **Stockage local** - Les données persistent dans le navigateur
- ✅ **Exportation** - Téléchargez vos tâches en JSON
- ✅ **Design moderne** - Interface sombre et élégante
- ✅ **Responsive** - Fonctionne sur tous les appareils

## 🚀 Démarrage rapide

### 1. Clonez le dépôt
```bash
git clone https://github.com/cr0issant11/todo-list-app.git
cd todo-list-app
```

### 2. Ouvrez l'application
```bash
# Simplement ouvrez index.html dans votre navigateur
open index.html
```

Ou utilisez un serveur local :
```bash
python -m http.server 8000
# Puis allez à http://localhost:8000
```

## 📖 Utilisation

### Ajouter une tâche
1. Tapez votre tâche dans le champ de texte
2. Appuyez sur Entrée ou cliquez sur le bouton +

### Marquer comme complétée
- Cliquez sur la case à cocher à gauche de la tâche

### Changer la priorité
- Cliquez sur le bouton drapeau pour cycler entre Basse → Moyenne → Haute

### Filtrer les tâches
- Utilisez les boutons de filtre : Tous, Actifs, Complétés

### Supprimer une tâche
- Cliquez sur l'icône corbeille

### Actions de masse
- **Effacer les complétés** : Supprime toutes les tâches marquées comme complétées
- **Effacer tout** : Supprime TOUTES les tâches (confirmation requise)
- **Exporter** : Télécharge vos tâches au format JSON

## 🎨 Thème et Personnalisation

Le fichier `styles.css` contient les variables de couleur CSS que vous pouvez personnaliser :

```css
:root {
    --primary-color: #6366f1;      /* Couleur principale (indigo) */
    --secondary-color: #8b5cf6;    /* Couleur secondaire (violet) */
    --danger-color: #ef4444;        /* Couleur danger (rouge) */
    --success-color: #10b981;       /* Couleur succès (vert) */
    --bg-color: #0f172a;            /* Arrière-plan */
    --card-bg: #1e293b;             /* Couleur des cartes */
    /* ... plus de couleurs ... */
}
```

## 💾 Stockage Local

L'application utilise `localStorage` pour persister les données :
- Les tâches sont sauvegardées automatiquement
- Les données restent même après fermer le navigateur
- Chaque tâche stocke : ID, texte, état complétée, priorité, dates

## 📦 Structure du projet

```
todo-list-app/
├── index.html      # Structure HTML
├── styles.css      # Styles et thème
├── app.js          # Logique principale de l'app
├── storage.js      # Module de gestion du stockage
└── README.md       # Documentation
```

## 🔧 Architecture

### TodoStorage (storage.js)
Gère tout le stockage local :
- `getTodos()` - Récupère toutes les tâches
- `addTodo(text, priority)` - Ajoute une nouvelle tâche
- `deleteTodo(id)` - Supprime une tâche
- `toggleTodo(id)` - Bascule l'état
- `exportToJSON()` - Exporte au format JSON
- Et plus...

### TodoApp (app.js)
Gère l'interface utilisateur :
- Événements utilisateur
- Rendu de l'interface
- Filtrage et statistiques
- Notifications et dialogues

## 🌐 Compatibilité

- Chrome/Chromium ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Chrome Mobile ✅

## 📱 Responsive

- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1919px)
- ✅ Mobile (< 768px)

## 🎯 Fonctionnalités à venir

- [ ] Catégories/Tags
- [ ] Dates d'échéance
- [ ] Rappels et notifications
- [ ] Mode clair/sombre toggle
- [ ] Sync cloud (Firebase, etc.)
- [ ] Partage de listes
- [ ] Application mobile native

## 🤝 Contribution

Les contributions sont bienvenues ! N'hésitez pas à :
1. Forker le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'Add amazing feature'`)
4. Pousser la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

cr0issant11

## 💬 Support

Pour toute question ou problème, créez une issue sur le dépôt GitHub.

---

**Dernière mise à jour** : 2026-09-13

**Profitez et restez productif !** 🚀📝
