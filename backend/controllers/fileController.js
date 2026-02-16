import {
  openDownloadStream,
  findFileById,
  findFileByName,
  openDownloadStreamByName
} from '../utils/gridfs.js';

export const getFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await findFileById(id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.contentType) {
      res.set('Content-Type', file.contentType);
    }
    if (file.length) {
      res.set('Content-Length', String(file.length));
    }
    if (file.uploadDate) {
      res.set('Last-Modified', new Date(file.uploadDate).toUTCString());
    }
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.set('Accept-Ranges', 'bytes');

    const stream = openDownloadStream(id);
    stream.on('error', () => {
      res.status(404).json({ message: 'File not found' });
    });
    stream.pipe(res);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFileByName = async (req, res) => {
  try {
    const { filename } = req.params;
    const file = await findFileByName(filename);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.contentType) {
      res.set('Content-Type', file.contentType);
    }
    if (file.length) {
      res.set('Content-Length', String(file.length));
    }
    if (file.uploadDate) {
      res.set('Last-Modified', new Date(file.uploadDate).toUTCString());
    }
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.set('Accept-Ranges', 'bytes');

    const stream = openDownloadStreamByName(filename);
    stream.on('error', () => {
      res.status(404).json({ message: 'File not found' });
    });
    stream.pipe(res);
  } catch (error) {
    console.error('Error fetching file by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
