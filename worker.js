import Queue from 'bull';
import dbClient from './utils/db.js';
import imageThumbnail from 'image-thumbnail';
import fs from 'fs';

const fileQueue = new Queue('fileQueue');

fileQueue.process(async (job) => {
    const { userId, fileId } = job.data;

    if (!fileId) throw new Error('Missing fileId');
    if (!userId) throw new Error('Missing userId');

    const files = dbClient.db.collection('files');

    const file = await files.findOne({
        _id: new dbClient.ObjectId(fileId),
        userId: new dbClient.ObjectId(userId)
    });

    if (!file) throw new Error('File not found');

    const originalPath = file.localPath;

    // Generate three sizes
    const sizes = [500, 250, 100];

    for (const size of sizes) {
        const thumbnail = await imageThumbnail(originalPath, { width: size });

        const pathOut = `${originalPath}_${size}`;

        fs.writeFileSync(pathOut, thumbnail);
    }
});
