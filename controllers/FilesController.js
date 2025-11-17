import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class FilesController {
    static async postUpload(req, res) {
        const token = req.header('X-Token');
        const key = `auth_${token}`;
        const userId = await redisClient.get(key);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await dbClient.dbName.collection('users').findOne({ _id: new ObjectId(userId) });

         if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { name, type, parentId = 0, isPublic = false, data } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) return res.status(400).json({ error: 'Missing data' });

    if (parentId !== 0) {
      const parentFile = await dbClient.db.collection('files').findOne({ _id: new ObjectId(parentId) });
      if (!parentFile) return res.status(400).json({ error: 'Parent not found' });
      if (parentFile.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
    }

    const fileDoc = {
      userId: new ObjectId(userId),
      name,
      type,
      isPublic,
      parentId: parentId === 0 ? 0 : new ObjectId(parentId),
    };

    if (type === 'folder') {
      const result = await dbClient.db.collection('files').insertOne(fileDoc);
      return res.status(201).json({
        id: result.insertedId,
        userId,
        name,
        type,
        isPublic,
        parentId,
      });
    }

    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    await fs.mkdir(folderPath, { recursive: true });

    const localPath = path.join(folderPath, uuidv4());
    const fileData = Buffer.from(data, 'base64');
    await fs.writeFile(localPath, fileData);
    fileDoc.localPath = localPath;

    const result = await dbClient.db.collection('files').insertOne(fileDoc);
    return res.status(201).json({
        id: result.insertedId,
        userId,
        name,
        type,
        isPublic,
        parentId,
    });
    }

    static async getShow(req, res) {
        const token = req.header('X-Token');
        const key = `auth_${token}`;
        const userId = await redisClient.get(key);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const fileId = req.params.id;

        const file = await dbClient.db.collection('files').findOne({
            _id: new ObjectId(fileId),
            userId: new ObjectId(userId),
        });


        if (!file) return res.status(404).json({ error: 'Not found' });

        return res.json({
            id: file._id,
            userId: file.userId,
            name: file.name,
            type: file.type,
            isPublic: file.isPublic,
            parentId: file.parentId,
        });

    }

    static async getIndex(req, res) {
        const token = req.header('X-Token');
        const key = `auth_${token}`;
        const userId = await redisClient.get(key);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const parentId = req.query.parentId || 0;
        const page = parseInt(req.query.page) || 0;

        const matchQuery =
            parentId === '0' || parentId === 0
                ? { userId: new ObjectId(userId), parentId: 0 }
                : { userId: new ObjectId(userId), parentId: new ObjectId(parentId) };

        const files = await dbClient.db.collection('files').aggregate([
            { $match: matchQuery },
            { $skip: page * 20 },
            { $limit: 20 },
        ]).toArray();

         const formatted = files.map((file) => ({
            id: file._id,
            userId: file.userId,
            name: file.name,
            type: file.type,
            isPublic: file.isPublic,
            parentId: file.parentId,
        }));

        return res.json(formatted);
    }

    static async putPublish(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const fileId = req.params.id;

    const file = await dbClient.db.collection('files').findOne({
        _id: new ObjectId(fileId),
        userId: new ObjectId(userId),
    });

    if (!file) return res.status(404).json({ error: 'Not found' });

    await dbClient.db.collection('files').updateOne(
        { _id: new ObjectId(fileId) },
        { $set: { isPublic: true } }
    );

    return res.status(200).json({
        id: file._id,
        userId: file.userId,
        name: file.name,
        type: file.type,
        isPublic: true,
        parentId: file.parentId,
    });
}

    static async putUnpublish(req, res) {
        const token = req.header('X-Token');
        const key = `auth_${token}`;
        const userId = await redisClient.get(key);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const fileId = req.params.id;

        const file = await dbClient.db.collection('files').findOne({
            _id: new ObjectId(fileId),
            userId: new ObjectId(userId),
        });

        if (!file) return res.status(404).json({ error: 'Not found' });

        await dbClient.db.collection('files').updateOne(
            { _id: new ObjectId(fileId) },
            { $set: { isPublic: false } }
        );

        return res.status(200).json({
            id: file._id,
            userId: file.userId,
            name: file.name,
            type: file.type,
            isPublic: false,
            parentId: file.parentId,
        });
    }

    static async getFile(req, res) {
        const { id } = req.params;

        const file = await dbClient.db.collection('files').findOne({ _id: new ObjectId(id) });
        if (!file) return res.status(404).json({ error: 'Not found' });

        const token = req.header('X-Token');
        let userId = null;

        if (token) {
            const key = `auth_${token}`;
            userId = await redisClient.get(key);
        }

        if (!file.isPublic) {
            if (userId || userId/this.toString() !== file.userId.toString()) {
                return res.status(404).json({ error: 'Not found' })
            }
        }

        if (file.type === 'folder') {
            return res.status(404).json({ error: "A folder doesn't have content" });
        }

        try {
            const data = await fs.readFile(file.localPath);
            const mimeType = mime.contentType(file.name) || 'application/octet-stream';

            res.setHeader('Content-Type', mimeType);
            return res.status(200).send(data);
        } catch (err) {
            return res.status(404).json({ error: 'Not found' });
        }
    }
}

export default FilesController;
