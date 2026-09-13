/**
 * Module de gestion du stockage local
 * Gère la persistance des tâches dans le localStorage
 */

class TodoStorage {
    constructor(storageName = 'todos') {
        this.storageName = storageName;
    }

    /**
     * Récupère toutes les tâches
     */
    getTodos() {
        try {
            const todos = localStorage.getItem(this.storageName);
            return todos ? JSON.parse(todos) : [];
        } catch (error) {
            console.error('Erreur lors de la lecture du stockage:', error);
            return [];
        }
    }

    /**
     * Sauvegarde toutes les tâches
     */
    saveTodos(todos) {
        try {
            localStorage.setItem(this.storageName, JSON.stringify(todos));
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            return false;
        }
    }

    /**
     * Ajoute une nouvelle tâche
     */
    addTodo(text, priority = 'medium') {
        const todos = this.getTodos();
        const newTodo = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            priority: priority,
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        todos.unshift(newTodo);
        this.saveTodos(todos);
        return newTodo;
    }

    /**
     * Supprime une tâche par ID
     */
    deleteTodo(id) {
        const todos = this.getTodos();
        const filteredTodos = todos.filter(todo => todo.id !== id);
        this.saveTodos(filteredTodos);
        return filteredTodos.length < todos.length;
    }

    /**
     * Met à jour une tâche
     */
    updateTodo(id, updates) {
        const todos = this.getTodos();
        const todoIndex = todos.findIndex(todo => todo.id === id);
        
        if (todoIndex !== -1) {
            todos[todoIndex] = { ...todos[todoIndex], ...updates };
            if (updates.completed && !todos[todoIndex].completedAt) {
                todos[todoIndex].completedAt = new Date().toISOString();
            }
            this.saveTodos(todos);
            return todos[todoIndex];
        }
        return null;
    }

    /**
     * Marque une tâche comme complétée/non complétée
     */
    toggleTodo(id) {
        const todos = this.getTodos();
        const todo = todos.find(t => t.id === id);
        
        if (todo) {
            todo.completed = !todo.completed;
            if (todo.completed && !todo.completedAt) {
                todo.completedAt = new Date().toISOString();
            }
            this.saveTodos(todos);
            return todo;
        }
        return null;
    }

    /**
     * Supprime toutes les tâches complétées
     */
    deleteCompleted() {
        const todos = this.getTodos();
        const filtered = todos.filter(todo => !todo.completed);
        const deletedCount = todos.length - filtered.length;
        this.saveTodos(filtered);
        return deletedCount;
    }

    /**
     * Supprime toutes les tâches
     */
    deleteAll() {
        const todos = this.getTodos();
        const count = todos.length;
        this.saveTodos([]);
        return count;
    }

    /**
     * Obtient les statistiques
     */
    getStats() {
        const todos = this.getTodos();
        return {
            total: todos.length,
            completed: todos.filter(t => t.completed).length,
            remaining: todos.filter(t => !t.completed).length
        };
    }

    /**
     * Exporte les tâches en JSON
     */
    exportToJSON() {
        const todos = this.getTodos();
        const data = {
            exported: new Date().toISOString(),
            stats: this.getStats(),
            todos: todos
        };
        return JSON.stringify(data, null, 2);
    }

    /**
     * Importe les tâches depuis un JSON
     */
    importFromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (Array.isArray(data)) {
                this.saveTodos(data);
                return data;
            } else if (data.todos && Array.isArray(data.todos)) {
                this.saveTodos(data.todos);
                return data.todos;
            }
            throw new Error('Format invalide');
        } catch (error) {
            console.error('Erreur lors de l\'importation:', error);
            return null;
        }
    }

    /**
     * Efface tout le stockage
     */
    clear() {
        localStorage.removeItem(this.storageName);
    }
}

// Export du module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TodoStorage;
}
