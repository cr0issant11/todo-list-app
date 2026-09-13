/**
 * Application de gestion de tâches avec stockage local
 */

class TodoApp {
    constructor() {
        this.storage = new TodoStorage();
        this.currentFilter = 'all';
        this.todos = [];
        this.init();
    }

    init() {
        this.todos = this.storage.getTodos();
        this.setupEventListeners();
        this.updateDate();
        this.render();
        
        // Mettre à jour la date chaque minute
        setInterval(() => this.updateDate(), 60000);
    }

    /**
     * Configure tous les événements
     */
    setupEventListeners() {
        // Input et bouton ajouter
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());

        // Filtres
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.closest('.filter-btn')));
        });

        // Boutons d'action
        document.getElementById('clearCompletedBtn').addEventListener('click', () => this.showConfirmDialog('Êtes-vous sûr de vouloir supprimer toutes les tâches complétées ?', () => this.clearCompleted()));
        document.getElementById('clearAllBtn').addEventListener('click', () => this.showConfirmDialog('Êtes-vous sûr de vouloir supprimer TOUTES les tâches ? Cette action est irréversible !', () => this.clearAll()));
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTodos());

        // Modal
        document.getElementById('confirmBtn').addEventListener('click', () => this.confirmAction());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
    }

    /**
     * Ajoute une nouvelle tâche
     */
    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (!text) {
            this.showNotification('Veuillez entrer une tâche', 'error');
            return;
        }

        if (text.length > 200) {
            this.showNotification('La tâche est trop longue (max 200 caractères)', 'error');
            return;
        }

        this.storage.addTodo(text);
        this.todos = this.storage.getTodos();
        input.value = '';
        input.focus();
        this.render();
        this.showNotification('Tâche ajoutée avec succès!');
    }

    /**
     * Supprime une tâche
     */
    deleteTodo(id) {
        this.storage.deleteTodo(id);
        this.todos = this.storage.getTodos();
        this.render();
        this.showNotification('Tâche supprimée');
    }

    /**
     * Bascule l'état d'une tâche
     */
    toggleTodo(id) {
        this.storage.toggleTodo(id);
        this.todos = this.storage.getTodos();
        this.render();
    }

    /**
     * Change la priorité d'une tâche
     */
    changePriority(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        const priorities = ['low', 'medium', 'high'];
        const currentIndex = priorities.indexOf(todo.priority);
        const nextPriority = priorities[(currentIndex + 1) % priorities.length];

        this.storage.updateTodo(id, { priority: nextPriority });
        this.todos = this.storage.getTodos();
        this.render();
    }

    /**
     * Définit le filtre actif
     */
    setFilter(btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.render();
    }

    /**
     * Filtre les tâches selon le filtre actif
     */
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    /**
     * Rend l'interface
     */
    render() {
        const filteredTodos = this.getFilteredTodos();
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');

        // Affichage/masquage de l'état vide
        if (filteredTodos.length === 0) {
            todoList.innerHTML = '';
            emptyState.classList.add('show');
        } else {
            emptyState.classList.remove('show');
            todoList.innerHTML = filteredTodos.map(todo => this.createTodoElement(todo)).join('');

            // Ajouter les événements aux éléments
            todoList.querySelectorAll('.checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => this.toggleTodo(parseInt(e.target.dataset.id)));
            });

            todoList.querySelectorAll('.delete').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteTodo(parseInt(e.target.closest('.todo-btn').dataset.id)));
            });

            todoList.querySelectorAll('.priority-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.changePriority(parseInt(e.target.closest('.todo-btn').dataset.id)));
            });
        }

        this.updateStats();
    }

    /**
     * Crée un élément HTML pour une tâche
     */
    createTodoElement(todo) {
        const date = new Date(todo.createdAt).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });

        const priorityLabels = {
            'high': 'Haute',
            'medium': 'Moyenne',
            'low': 'Basse'
        };

        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    data-id="${todo.id}"
                >
                <div class="todo-content">
                    <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span class="todo-date">📅 ${date}</span>
                        <span class="todo-priority ${todo.priority}">${priorityLabels[todo.priority]}</span>
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="todo-btn priority-btn" data-id="${todo.id}" title="Changer la priorité">
                        <i class="fas fa-flag"></i>
                    </button>
                    <button class="todo-btn delete" data-id="${todo.id}" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Met à jour les statistiques
     */
    updateStats() {
        const stats = this.storage.getStats();
        document.getElementById('totalCount').textContent = stats.total;
        document.getElementById('completedCount').textContent = stats.completed;
        document.getElementById('remainingCount').textContent = stats.remaining;
    }

    /**
     * Met à jour la date affichée
     */
    updateDate() {
        const date = new Date();
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        document.getElementById('date').textContent = date.toLocaleDateString('fr-FR', options);
    }

    /**
     * Supprime toutes les tâches complétées
     */
    clearCompleted() {
        const count = this.storage.deleteCompleted();
        this.todos = this.storage.getTodos();
        this.render();
        this.showNotification(`${count} tâche(s) complétée(s) supprimée(s)`);
    }

    /**
     * Supprime toutes les tâches
     */
    clearAll() {
        const count = this.storage.deleteAll();
        this.todos = [];
        this.render();
        this.showNotification(`${count} tâche(s) supprimée(s)`);
    }

    /**
     * Exporte les tâches en JSON
     */
    exportTodos() {
        const jsonData = this.storage.exportToJSON();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('Tâches exportées avec succès!');
    }

    /**
     * Affiche une notification
     */
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    /**
     * Affiche le dialogue de confirmation
     */
    showConfirmDialog(message, callback) {
        this.confirmCallback = callback;
        document.getElementById('confirmMessage').textContent = message;
        document.getElementById('confirmModal').classList.add('show');
    }

    /**
     * Confirme l'action
     */
    confirmAction() {
        if (this.confirmCallback) {
            this.confirmCallback();
            this.confirmCallback = null;
        }
        this.closeModal();
    }

    /**
     * Ferme le modal
     */
    closeModal() {
        document.getElementById('confirmModal').classList.remove('show');
    }

    /**
     * Échappe les caractères HTML dangereux
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialiser l'app au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
