import { TFile } from "obsidian";

/**
 * Get the path of the file without the actual file name.
 * @param file - The file to get the path from
 * @returns The path of the file
 */
export default function getFilePath(file: TFile): string {
    return file.path.substring(0, file.path.lastIndexOf("/") + 1)
}