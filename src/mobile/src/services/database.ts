// SQLite Database Service for offline photo storage

import * as SQLite from 'expo-sqlite';
import { Photo, PhotoMetadata, Project, SyncStatus } from '../types/photo';

const DB_NAME = 'photoreport.db';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
    db = await SQLite.openDatabaseAsync(DB_NAME);

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      createdAt TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      localUri TEXT NOT NULL,
      localUriWithOverlay TEXT,
      thumbnail TEXT,
      latitude REAL,
      longitude REAL,
      altitude REAL,
      accuracy REAL,
      timestamp TEXT,
      direction REAL,
      caption TEXT DEFAULT '',
      projectId TEXT,
      createdAt TEXT NOT NULL,
      syncStatus TEXT DEFAULT 'pending',
      syncedAt TEXT,
      remoteId TEXT,
      FOREIGN KEY (projectId) REFERENCES projects(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_photos_sync ON photos(syncStatus);
    CREATE INDEX IF NOT EXISTS idx_photos_project ON photos(projectId);
  `);

    console.log('📦 Database initialized');
}

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!db) {
        await initDatabase();
    }
    return db!;
}

// Project functions
export async function createProject(project: Project): Promise<void> {
    const database = await getDb();
    await database.runAsync(
        'INSERT INTO projects (id, name, description, createdAt) VALUES (?, ?, ?, ?)',
        [project.id, project.name, project.description, project.createdAt]
    );
}

export async function getProjects(): Promise<Project[]> {
    const database = await getDb();
    return await database.getAllAsync<Project>('SELECT * FROM projects ORDER BY createdAt DESC');
}

export async function getDefaultProject(): Promise<Project> {
    const database = await getDb();
    let project = await database.getFirstAsync<Project>('SELECT * FROM projects LIMIT 1');

    if (!project) {
        project = {
            id: 'default',
            name: 'Projeto Padrão',
            description: 'Fotos sem projeto específico',
            createdAt: new Date().toISOString()
        };
        await createProject(project);
    }

    return project;
}

// Photo functions
export async function savePhoto(photo: Photo): Promise<void> {
    const database = await getDb();
    await database.runAsync(
        `INSERT INTO photos (
      id, localUri, localUriWithOverlay, thumbnail, latitude, longitude, altitude, accuracy,
      timestamp, direction, caption, projectId, createdAt, syncStatus, syncedAt, remoteId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            photo.id,
            photo.localUri,
            photo.localUriWithOverlay || null,
            photo.thumbnail || null,
            photo.metadata.latitude,
            photo.metadata.longitude,
            photo.metadata.altitude,
            photo.metadata.accuracy,
            photo.metadata.timestamp,
            photo.metadata.direction,
            photo.caption,
            photo.projectId,
            photo.createdAt,
            photo.syncStatus,
            photo.syncedAt,
            photo.remoteId
        ]
    );
}

export async function getPhotos(projectId?: string): Promise<Photo[]> {
    const database = await getDb();

    const query = projectId
        ? 'SELECT * FROM photos WHERE projectId = ? ORDER BY createdAt DESC'
        : 'SELECT * FROM photos ORDER BY createdAt DESC';

    const rows = projectId
        ? await database.getAllAsync<any>(query, [projectId])
        : await database.getAllAsync<any>(query);

    return rows.map(row => ({
        id: row.id,
        localUri: row.localUri,
        localUriWithOverlay: row.localUriWithOverlay,
        thumbnail: row.thumbnail,
        metadata: {
            latitude: row.latitude,
            longitude: row.longitude,
            altitude: row.altitude,
            accuracy: row.accuracy,
            timestamp: row.timestamp,
            direction: row.direction
        },
        caption: row.caption,
        projectId: row.projectId,
        createdAt: row.createdAt,
        syncStatus: row.syncStatus,
        syncedAt: row.syncedAt,
        remoteId: row.remoteId
    }));
}

export async function getPendingPhotos(): Promise<Photo[]> {
    const database = await getDb();
    const rows = await database.getAllAsync<any>(
        "SELECT * FROM photos WHERE syncStatus = 'pending' OR syncStatus = 'error' ORDER BY createdAt ASC"
    );

    return rows.map(row => ({
        id: row.id,
        localUri: row.localUri,
        localUriWithOverlay: row.localUriWithOverlay,
        thumbnail: row.thumbnail,
        metadata: {
            latitude: row.latitude,
            longitude: row.longitude,
            altitude: row.altitude,
            accuracy: row.accuracy,
            timestamp: row.timestamp,
            direction: row.direction
        },
        caption: row.caption,
        projectId: row.projectId,
        createdAt: row.createdAt,
        syncStatus: row.syncStatus,
        syncedAt: row.syncedAt,
        remoteId: row.remoteId
    }));
}

export async function updatePhotoCaption(id: string, caption: string): Promise<void> {
    const database = await getDb();
    await database.runAsync('UPDATE photos SET caption = ? WHERE id = ?', [caption, id]);
}

export async function updatePhotoSyncStatus(
    id: string,
    status: Photo['syncStatus'],
    remoteId?: string
): Promise<void> {
    const database = await getDb();
    const syncedAt = status === 'synced' ? new Date().toISOString() : null;
    await database.runAsync(
        'UPDATE photos SET syncStatus = ?, syncedAt = ?, remoteId = ? WHERE id = ?',
        [status, syncedAt, remoteId || null, id]
    );
}

export async function deletePhoto(id: string): Promise<void> {
    const database = await getDb();
    await database.runAsync('DELETE FROM photos WHERE id = ?', [id]);
}

export async function getSyncStatus(): Promise<SyncStatus> {
    const database = await getDb();

    const pending = await database.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM photos WHERE syncStatus = 'pending'"
    );
    const synced = await database.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM photos WHERE syncStatus = 'synced'"
    );
    const error = await database.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM photos WHERE syncStatus = 'error'"
    );
    const lastSync = await database.getFirstAsync<{ syncedAt: string }>(
        "SELECT syncedAt FROM photos WHERE syncedAt IS NOT NULL ORDER BY syncedAt DESC LIMIT 1"
    );

    return {
        pending: pending?.count || 0,
        synced: synced?.count || 0,
        error: error?.count || 0,
        lastSyncAt: lastSync?.syncedAt || null,
        isOnline: true // Will be updated by network check
    };
}
