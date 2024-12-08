import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: "AKIAVY2PGNBZYO2DYM4B", // Replace with your access key ID
    secretAccessKey: "U3JvLyVviPsMfzJ9/SkR5k0MTFRodiL4vqfI8uCz", // Replace with your secret access key
  },
});

export const uploadFileToS3 = async (file, fileName) => {
  const bucketName = "leetconnect-uploads";

  if (!bucketName) {
    throw new Error(
      "Bucket name is not defined. Please check your environment variables."
    );
  }

  try {
    // Prepare the upload parameters
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type, // Ensure the content type is set
      Acl: "public-read", // Enable public read access
    };

    // Use the PutObjectCommand to upload the file
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Construct the file URL
    const fileUrl = `https://${bucketName}.s3.${s3Client.config.region}.amazonaws.com/${fileName}`;
    return fileUrl;
  } catch (err) {
    console.error("Error uploading file to S3:", err);
    throw err;
  }
};
