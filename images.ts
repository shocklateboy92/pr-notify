import * as fs from 'fs';
import * as os from 'os';
import * as http from 'https';
import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces';

const IMAGE_CACHE_PATH = `${os.tmpdir()}/pr-notify-image-cache/`;

export function fetchImages(prList: GitPullRequest[]) {
    // Rather expensive way of doing Set.Distinct()
    const uniqueAuthors = prList
        .filter(
            (pr, index) =>
                prList.findIndex(pri => pri.createdBy.id == pr.createdBy.id) ===
                index
        )
        .map(pr => pr.createdBy);

    console.log(`Found ${uniqueAuthors.length} authors. Downloading images...`);

    // CBF make this async. 
    fs.mkdirSync(IMAGE_CACHE_PATH);

    return Promise.all(
        uniqueAuthors.map(author =>
            download(author.imageUrl, IMAGE_CACHE_PATH + author.id)
        )
    );
}

/**
 * Utility function that will download a file to a given path.
 * @param url url of the resource to fetch (source)
 * @param dest full path of the file to write to (dest)
 */
const download = (url: string, dest: string) =>
    new Promise<void>((resolve, reject) => {
        const file = fs.createWriteStream(dest, { flags: 'wx' });
        const request = http
            .get(url, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    file.close(); // close() is async
                    resolve();
                });
            })
            .on('error', function(err) {
                // Delete the file async. (But we don't check the result)
                fs.unlink(dest, _ => null);
                reject(err);
            });
    });
