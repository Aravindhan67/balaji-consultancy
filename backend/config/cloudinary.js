import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

let configured = false;

/**
 * Configures Cloudinary lazily from environment variables and returns true if active.
 */
export const isCloudinaryConfigured = () => {
  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

  const hasExplicitCreds =
    cloudName &&
    apiKey &&
    apiSecret &&
    !cloudName.startsWith('your_') &&
    !apiKey.startsWith('your_') &&
    !apiSecret.startsWith('your_');

  const hasCloudinaryUrl =
    Boolean(process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.startsWith('cloudinary://'));

  if (!hasExplicitCreds && !hasCloudinaryUrl) {
    return false;
  }

  if (!configured) {
    if (hasExplicitCreds) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
      });
    } else {
      cloudinary.config({ secure: true });
    }
    configured = true;
  }

  return true;
};

/**
 * Uploads an in-memory file buffer to Cloudinary and returns its secure URL & metadata.
 */
export const uploadBufferToCloudinary = (buffer, options = {}) => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured');
  }

  const baseFolder = (process.env.CLOUDINARY_FOLDER || 'balaji-consultancy').trim();
  const folder = options.folder ? `${baseFolder}/${options.folder}` : baseFolder;
  const resourceType = options.resourceType || 'image';

  const ext = options.originalname ? path.extname(options.originalname) : '';
  const safeBase = options.originalname
    ? path.basename(options.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()
    : 'asset';
  const publicId = `${safeBase}-${Date.now()}-${Math.round(Math.random() * 1e6)}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        overwrite: false
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          bytes: result.bytes
        });
      }
    );
    stream.end(buffer);
  });
};

/**
 * Extracts Cloudinary public_id and resource_type from a res.cloudinary.com URL and deletes it.
 */
export const deleteFromCloudinaryByUrl = async (assetUrl) => {
  if (!isCloudinaryConfigured() || !assetUrl || typeof assetUrl !== 'string') return false;
  if (!assetUrl.includes('res.cloudinary.com')) return false;

  try {
    const parsed = new URL(assetUrl);
    // Pattern: /<cloud_name>/<resource_type>/upload/(v12345/)?<public_id>.<ext>
    const match = parsed.pathname.match(/\/[^/]+\/(image|video|raw)\/upload\/(?:v\d+\/)?(.+)$/i);
    if (!match) return false;

    const resourceType = match[1].toLowerCase();
    let publicIdWithExt = decodeURIComponent(match[2]);
    // For image and video, Cloudinary public_id omits the file extension
    const publicId =
      resourceType === 'raw'
        ? publicIdWithExt
        : publicIdWithExt.replace(/\.[^/.]+$/, '');

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result?.result === 'ok' || result?.result === 'not found';
  } catch (err) {
    console.error('Failed to delete Cloudinary asset:', err.message);
    return false;
  }
};
