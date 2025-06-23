import { useState } from 'react';
import { Alert } from 'react-native';
import {useAuth} from "@/context/AuthContext";
import { uploadData } from 'aws-amplify/storage';

interface UploadResult {
  key: string;
  url: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const { user } = useAuth();
  const [progress, setProgress] = useState<number>(0);

  const uploadImage = async (route: string, image: { uri: string; type: string; name: string }): Promise<void> => {
    setUploading(true);
    setUploadError(null);
    setUploadResult(null);
    setProgress(0);

    try {
      const { uri, type, name } = image;

      const response: Response = await fetch(uri);

      const blob = await response.blob();
      const fileName = `${Date.now()}-${name}`;

      const s3Key = `${user}/${route}/${fileName}`;
      const bucketPath = `public/${s3Key}`;

      const operation = await uploadData({
        path: bucketPath,
        data: blob,
        options: {
          contentType: type,
          onProgress: (progressEvent: { loaded: number, total: number }) => {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setProgress(percent);
          }
        },
      });

      const operationResult = await operation.result
      console.log("Finished uploading!");
      setUploadResult({ key: `${user} - ${route}: ${fileName}`, url: operationResult.path });
    }
    catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
      Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
    }
    finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, uploadError, uploadResult, progress };
};
