import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { GOOGLE_CLOUD_VISION_API_KEY } from "../config/firebase";

const ImageUpload = {
  pickImage: async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.cancelled) {
        return result.uri;
      }
    } catch (error) {
      console.log("Error @pickImage: ", error.message);
    }
  },
  takeImage: async (camera) => {
    try {
      let uri = await camera.takePictureAsync().uri;
      return uri;
    } catch (error) {
      console.log("Error @takeImage: ", error.message);
    }
  },
  getMediaPermission: async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      return status;
    }
  },
  getCameraPermission: async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      return status;
    }
  },
  addPhoto: async () => {
    const status = await ImageUpload.getMediaPermission();
    if (status !== "granted") {
      alert("We need permission to access your photos for this to work.");
      return;
    }
    return ImageUpload.pickImage();
  },
  takePhoto: async (camera) => {
    const status = await ImageUpload.getCameraPermission();
    if (status !== "granted") {
      alert("We need permission to access your camera for this to work.");
      return;
    }
    return ImageUpload.takeImage(camera);
  },
  analyzeWithGCPVision: async (uri) => {
    try {
      let image = uri;
      let bodyVision = JSON.stringify({
        requests: [
          {
            features: [
              { type: "LABEL_DETECTION", maxResults: 10 },
              // { type: 'LANDMARK_DETECTION', maxResults: 5 },
              // { type: 'FACE_DETECTION', maxResults: 5 },
              // { type: 'LOGO_DETECTION', maxResults: 5 },
              // { type: 'TEXT_DETECTION', maxResults: 5 },
              // { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
              { type: "SAFE_SEARCH_DETECTION", maxResults: 5 },
              // { type: 'IMAGE_PROPERTIES', maxResults: 5 },
              // { type: 'CROP_HINTS', maxResults: 5 },
              // { type: 'WEB_DETECTION', maxResults: 5 }
            ],
            image: {
              source: {
                imageUri: image,
              },
            },
          },
        ],
      });
      let responseVision = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=" +
          GOOGLE_CLOUD_VISION_API_KEY,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: bodyVision,
        }
      );
      let responseVisionJson = await responseVision.json();
      console.log(responseVisionJson);
      return responseVisionJson;
    } catch (error) {
      console.log(error);
    }
  },
  analyzeWithGCPNLP: async (text) => {
    try {
      let bodyLang = JSON.stringify({
        document: {
          type: "PLAIN_TEXT",
          content:
            "Joanne Rowling, who writes under the pen names J. K. Rowling and Robert Galbraith, is a British novelist and screenwriter who wrote the Harry Potter fantasy series.",
        },
        encodingType: "UTF8",
      });
      let responseLang = await fetch(
        "https://language.googleapis.com/v1/documents:analyzeEntities?key=" +
          GOOGLE_CLOUD_VISION_API_KEY,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            encodingType: "UTF8",
            document: {
              type: "PLAIN_TEXT",
              content: text,
            },
          }),
        }
      );
      let responseLangJson = await responseLang.json();
      console.log(responseLangJson);
    } catch (error) {
      console.log(error);
    }
  },
};

export { ImageUpload };
