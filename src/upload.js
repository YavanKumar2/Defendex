








const s3Client = new AWS.S3({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
});

const uploadFile = async (filePath, bucketName, fileUploadInput) => {
  const fileName = filePath.name;
  const fileStream = filePath;

  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileStream,
  };

  try {
    const response = await s3Client.putObject(uploadParams).promise();
    console.log('File uploaded successfully');
  } catch (err) {
    console.log('Error', err);
  } 
};



module.exports = { uploadFile };



