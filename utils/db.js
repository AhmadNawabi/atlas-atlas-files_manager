import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';

        const url = `mongodb://${host}:${port}`;
        this.client = new MongoClient(url);
        this.dbName = database;
        this.connected = false;
        this.connecting = null; // Track connection promise

        this.connecting = this.connect(); // Start connection immediately
    }

    async connect() {
        if (this.connected) return; // Already connected
        try {
            await this.client.connect();
            this.connected = true;
            console.log(`Connected successfully to MongoDB at ${this.dbName}`);
        } catch (err) {
            this.connected = false;
            console.error('MongoDB connection error:', err);
        }
    }

    async isAlive() {
        // Wait for connection if it’s still in progress
        if (this.connecting) await this.connecting;
        return this.connected && this.client.topology?.isConnected();
    }

    async nbUsers() {
        if (!(await this.isAlive())) return 0;
        const db = this.client.db(this.dbName);
        return db.collection('users').countDocuments();
    }

    async nbFiles() {
        if (!(await this.isAlive())) return 0;
        const db = this.client.db(this.dbName);
        return db.collection('files').countDocuments();
    }

    async close() {
        if (this.connected) {
            await this.client.close();
            this.connected = false;
            console.log('MongoDB connection closed.');
        }
    }
}

// Export a single instance
const dbClient = new DBClient();
export default dbClient;
