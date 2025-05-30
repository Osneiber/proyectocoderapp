import { Platform } from 'react-native';
import { webStorage } from './webStorage';

// Importar SQLite solo en plataformas móviles
let SQLite;
if (Platform.OS !== 'web') {
    SQLite = require('expo-sqlite');
}

// Clase para manejar sesiones en web usando localStorage
class WebSessionManager {
    constructor() {
        this.STORAGE_KEY = 'user_session';
    }

    async initDB() {
        return true;
    }

    async insertSession({ localId, email, token }) {
        try {
            const session = { localId, email, token };
            return webStorage.setItem(this.STORAGE_KEY, session);
        } catch (error) {
            return { success: false, error };
        }
    }

    async getSession() {
        try {
            return webStorage.getItem(this.STORAGE_KEY);
        } catch (error) {
            return null;
        }
    }

    async truncateSessionTable() {
        try {
            return webStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            return { success: false, error };
        }
    }
}

// Clase para manejar sesiones en móvil usando SQLite
class MobileSessionManager {
    constructor() {
        this.db = null;
    }

    async openDatabase() {
        if (!this.db) {
            this.db = await SQLite.openDatabaseAsync("sessions.db");
        }
        return this.db;
    }

    async initDB() {
        const db = await this.openDatabase();
        const sql = `CREATE TABLE IF NOT EXISTS sessions (localId TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL, token TEXT NOT NULL);`;
        await db.execAsync(sql);
        return true;
    }

    async insertSession({ localId, email, token }) {
        const db = await this.openDatabase();
        const sql = `INSERT INTO sessions (localId, email, token) VALUES (?, ?, ?)`;
        const args = [localId, email, token];
        const res = await db.runAsync(sql, args);
        return res;
    }

    async getSession() {
        const db = await this.openDatabase();
        const sql = `SELECT * FROM sessions`;
        const firstRow = await db.getFirstAsync(sql);
        return firstRow;
    }

    async truncateSessionTable() {
        const db = await this.openDatabase();
        const sql = `DELETE FROM sessions`;
        const res = await db.execAsync(sql);
        return res;
    }
}

// Hook principal que selecciona el manager apropiado según la plataforma
export const useSession = () => {
    const sessionManager = Platform.OS === 'web' 
        ? new WebSessionManager() 
        : new MobileSessionManager();

    return {
        initDB: () => sessionManager.initDB(),
        insertSession: (session) => sessionManager.insertSession(session),
        getSession: () => sessionManager.getSession(),
        truncateSessionTable: () => sessionManager.truncateSessionTable(),
    };
};
