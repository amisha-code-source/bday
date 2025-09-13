// Enhanced Database class with more features
class BirthdayWishesDB {
    constructor() {
        this.storageKey = 'birthdayWishes';
        this.init();
    }

    init() {
        // Initialize database if it doesn't exist
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    // Add a new wish to the database
    addWish(name, wish, email = null) {
        const wishes = this.getAllWishes();
        const newWish = {
            id: this.generateId(),
            name: name.trim(),
            wish: wish.trim(),
            email: email ? email.trim() : null,
            date: new Date().toISOString(),
            timestamp: Date.now(),
            likes: 0,
            likedBy: []
        };
        
        wishes.unshift(newWish); // Add to beginning of array
        localStorage.setItem(this.storageKey, JSON.stringify(wishes));
        return newWish;
    }

    // Get all wishes from the database
    getAllWishes() {
        const wishes = localStorage.getItem(this.storageKey);
        return wishes ? JSON.parse(wishes) : [];
    }

    // Get a specific wish by ID
    getWishById(id) {
        const wishes = this.getAllWishes();
        return wishes.find(wish => wish.id === id);
    }

    // Update a wish
    updateWish(id, updates) {
        const wishes = this.getAllWishes();
        const index = wishes.findIndex(wish => wish.id === id);
        
        if (index !== -1) {
            wishes[index] = { ...wishes[index], ...updates };
            localStorage.setItem(this.storageKey, JSON.stringify(wishes));
            return wishes[index];
        }
        return null;
    }

    // Delete a wish by ID
    deleteWish(id) {
        const wishes = this.getAllWishes();
        const filteredWishes = wishes.filter(wish => wish.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredWishes));
        return filteredWishes;
    }

    // Like a wish
    likeWish(id, userId = 'anonymous') {
        const wish = this.getWishById(id);
        if (!wish) return null;
        
        const isLiked = wish.likedBy.includes(userId);
        
        if (isLiked) {
            // Unlike
            wish.likedBy = wish.likedBy.filter(uid => uid !== userId);
            wish.likes = Math.max(0, wish.likes - 1);
        } else {
            // Like
            wish.likedBy.push(userId);
            wish.likes += 1;
        }
        
        return this.updateWish(id, { likes: wish.likes, likedBy: wish.likedBy });
    }

    // Search wishes by name or content
    searchWishes(query) {
        const wishes = this.getAllWishes();
        const lowercaseQuery = query.toLowerCase();
        
        return wishes.filter(wish => 
            wish.name.toLowerCase().includes(lowercaseQuery) ||
            wish.wish.toLowerCase().includes(lowercaseQuery)
        );
    }

    // Get wishes by date range
    getWishesByDateRange(startDate, endDate) {
        const wishes = this.getAllWishes();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return wishes.filter(wish => {
            const wishDate = new Date(wish.date);
            return wishDate >= start && wishDate <= end;
        });
    }

    // Get statistics
    getStats() {
        const wishes = this.getAllWishes();
        const totalWishes = wishes.length;
        const totalLikes = wishes.reduce((sum, wish) => sum + wish.likes, 0);
        const uniqueAuthors = new Set(wishes.map(wish => wish.name)).size;
        
        // Get most liked wish
        const mostLiked = wishes.reduce((max, wish) => 
            wish.likes > max.likes ? wish : max, { likes: 0 }
        );
        
        return {
            totalWishes,
            totalLikes,
            uniqueAuthors,
            mostLiked,
            averageLikes: totalWishes > 0 ? (totalLikes / totalWishes).toFixed(2) : 0
        };
    }

    // Export data
    exportData() {
        const wishes = this.getAllWishes();
        const dataStr = JSON.stringify(wishes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `birthday-wishes-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Import data
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedWishes = JSON.parse(e.target.result);
                    if (Array.isArray(importedWishes)) {
                        localStorage.setItem(this.storageKey, JSON.stringify(importedWishes));
                        resolve(importedWishes);
                    } else {
                        reject(new Error('Invalid data format'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    }

    // Clear all wishes
    clearAllWishes() {
        localStorage.setItem(this.storageKey, JSON.stringify([]));
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Backup data to a more persistent storage (if available)
    backupData() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            // Use IndexedDB for more persistent storage
            this.backupToIndexedDB();
        }
    }

    // Restore from backup
    restoreFromBackup() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            return this.restoreFromIndexedDB();
        }
        return Promise.resolve(false);
    }

    // IndexedDB backup methods (simplified)
    backupToIndexedDB() {
        // Implementation would go here for IndexedDB backup
        console.log('Backup functionality would be implemented here');
    }

    restoreFromIndexedDB() {
        // Implementation would go here for IndexedDB restore
        console.log('Restore functionality would be implemented here');
        return Promise.resolve(false);
    }
}

// Make it available globally
window.BirthdayWishesDB = BirthdayWishesDB;
