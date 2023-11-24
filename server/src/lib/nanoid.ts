import { v4 as uuid } from "uuid";

const nanoid = (size: number = 10) => {
  return uuid().replace(/-/g, "").slice(0, size);
};

export default nanoid;
