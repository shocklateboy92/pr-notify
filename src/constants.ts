import os from "os";
import path from "path";

export const ORG_URL = "https://dev.azure.com/microsoft";

export const PAT_PATH = path.resolve(os.homedir(), "src/pat.txt");

export const STATE_FILE = path.resolve(os.homedir(), ".cache/pr-notify.json");
