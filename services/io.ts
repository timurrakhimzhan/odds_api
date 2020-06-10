import * as fs from 'fs';

export function getFile<T extends object> (filepath: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        fs.readFile(filepath, (err, data)=> {
            resolve(JSON.parse(data.toString()));
        });
    })
}

export function writeFile (filepath: string, data: object | string): Promise<string> {
    if(typeof data === 'object')
        data = JSON.stringify(data);
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, data, (err) => {
            if(err)
                reject(err);
            resolve(filepath);
        })
    })
}

export function appendToFile(filename: string, text: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        fs.appendFile(`${__dirname}/${filename}`, text, {}, (err) => {
            console.log('Appended.');
            resolve();
        });
    });
}

export function createDirectory(filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
        let filenameSplitted: Array<string> = filename.split("/");
        filenameSplitted.length--;
        filename = filenameSplitted.join("/");
        fs.mkdir(`${__dirname}/${filename}`, { recursive: true }, (err) => {
            if(err)
                reject(err);
            resolve()
        });
    })
}
