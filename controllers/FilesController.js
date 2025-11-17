import { v4 as uuidv4 } from 'uuid';
import { pormises as fs } from 'fs';
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

}

export default FilesController;
