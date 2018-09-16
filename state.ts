import * as fs from 'fs';

export interface IState {
    repoIds: {
        [key: string]: string
    }
}

const STATE_FILE = './state.json';

export const getState = () => new Promise<IState>(resolve => {
    if (!fs.existsSync(STATE_FILE)) {
        console.warn('State file does not exist. Assuming blank state...');
        resolve({
            repoIds: {}
        })
    }

    // fs.readFile(STATE_FILE, (error, file) => JSON.parse(file.))
})

// export const setState = () => new Promise<void>(resolve => {
//     fs.writeFile()
// })