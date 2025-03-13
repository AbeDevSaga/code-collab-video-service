const B2 = require("backblaze-b2");
const fs = require("fs");

const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
  applicationKey: process.env.B2_APPLICATION_KEY,
});

// Initialize Backblaze B2
const initializeB2 = async () => {
  try {
    await b2.authorize();
    console.log("Backblaze B2 initialized successfully");
  } catch (error) {
    console.error("Error initializing Backblaze B2:", error);
    throw error;
  }
};

// Upload a file to Backblaze B2
const uploadToBackblaze = async (filePath, fileName) => {
  try {
    await initializeB2();

    // Get the upload URL
    const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID,
    });

    // Read the file
    const fileData = fs.readFileSync(filePath);

    // Upload the file
    const response = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName,
      data: fileData,
    });

    console.log("File uploaded successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading file to Backblaze B2:", error);
    throw error;
  }
};

// Download a file from Backblaze B2
const downloadFromBackblaze = async (fileName) => {
  try {
    await initializeB2();

    // Get the download URL
    const { data: { downloadUrl } } = await b2.getDownloadUrl({
      bucketName: process.env.B2_BUCKET_NAME,
      fileName,
    });

    // Download the file
    const response = await axios.get(downloadUrl, { responseType: "stream" });
    return response.data;
  } catch (error) {
    console.error("Error downloading file from Backblaze B2:", error);
    throw error;
  }
};

// Delete a file from Backblaze B2
const deleteFromBackblaze = async (fileName) => {
  try {
    await initializeB2();

    // Get the file ID
    const { data: { files } } = await b2.listFileNames({
      bucketId: process.env.B2_BUCKET_ID,
      startFileName: fileName,
      maxFileCount: 1,
    });

    if (files.length === 0) {
      throw new Error("File not found in Backblaze B2");
    }

    const fileId = files[0].fileId;

    // Delete the file
    const response = await b2.deleteFileVersion({
      fileId,
      fileName,
    });

    console.log("File deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting file from Backblaze B2:", error);
    throw error;
  }
};

module.exports = {
  uploadToBackblaze,
  downloadFromBackblaze,
  deleteFromBackblaze,
};