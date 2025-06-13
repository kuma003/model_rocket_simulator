  import type { Config } from "@react-router/dev/config";

import { copyFile } from "node:fs/promises";
import path from "node:path";

export default {
  basename: import.meta.env.PROD ? "/model_rocket_simulator/" : "/",
  ssr: false,
} satisfies Config;
