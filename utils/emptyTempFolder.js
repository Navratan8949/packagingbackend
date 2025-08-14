const fs = require('fs/promises');
const path = require('path');

const emptyTempFolder = async () => {
    try {
        const folderPath = path.join(__dirname, '../temp')
        const files = await fs.readdir(folderPath); // Read the directory
        for (const file of files) {
            if (file !== ".gitkeep") {
                const filePath = path.join(folderPath, file);
                const stats = await fs.lstat(filePath);

                if (stats.isDirectory()) {
                    await emptyFolder(filePath); // Recursively empty subdirectories
                    await fs.rmdir(filePath); // Remove empty subdirectory
                } else {
                    await fs.unlink(filePath); // Remove file
                }
            }
        }
        console.log(`Successfully emptied folder: ${folderPath}`);
    } catch (error) {
        console.error(`Error emptying folder ${folderPath}:, error.message`);
    }
};

module.exports = emptyTempFolder;