import type { Stem } from "../../project/types";
import type { AudioStemFile } from "../types";

interface CreateStemOptions {
  createId?: () => string;
}

const defaultCreateId = () => crypto.randomUUID();
