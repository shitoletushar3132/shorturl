import { v4 as uuidv4 } from "uuid";

function generateShortId() {
  // Generate a UUID and take the first 5 characters
  return uuidv4().replace(/-/g, "").substring(0, 5);
}

export default generateShortId;
