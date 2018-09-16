import * as jsonfile from 'jsonfile';

export interface IState {
    repoIds: {
        [key: string]: string;
    };
}

const STATE_FILE = './state.json';

export const getState = async (): Promise<IState> => {
    try {
        // stupid type definition didn't define the overload correctly
        return ((await jsonfile.readFile(STATE_FILE)) as any) as IState;
    } catch {
        console.log('Missing state file. Assuming initial state...');
        return {
            repoIds: {}
        };
    }
};

export const setState = (state: IState) =>
    jsonfile.writeFile(STATE_FILE, state, { spaces: 2 });
