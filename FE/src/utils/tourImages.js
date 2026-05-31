const BACKEND_URL = "http://localhost:8080";
const IMAGE_PATH = "/ltweb/images/tour/";
export const DEFAULT_TOUR_IMAGE = "/assets/images/destinations/tour1.jpg";

export const getTourImageSrc = (images) => {
  const imageUrl = Array.isArray(images)
    ? images.find((image) => image?.imageURL)?.imageURL
    : null;

  if (!imageUrl) {
    return DEFAULT_TOUR_IMAGE;
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:") ||
    imageUrl.startsWith("blob:")
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${BACKEND_URL}${imageUrl}`;
  }

  return `${BACKEND_URL}${IMAGE_PATH}${imageUrl}`;
};
