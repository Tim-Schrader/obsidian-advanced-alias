import { TFile } from "obsidian";

/**
 * Finds a file in a list of files by its name.
 *
 * @param files - The list of files to search
 * @param fileName - The name of the file to find
 * @returns The TFile object if the file is found, or null if not
 */
export default function getFileFromList(files: TFile[], fileName: string): TFile | null {
    for (const file of files) {
        if (file.basename === fileName) {
            return file;
        }
    }

    return null;
}