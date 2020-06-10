import * as readline from 'readline';
import {ReadLine} from "readline";


export function questionPrompt(question: string): Promise<string> {
    const rl: ReadLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.setPrompt(question + "\n");
    rl.prompt();
    return new Promise<string>((resolve, reject) => {
        rl.on('line', (userInput) => {
            rl.close();
            resolve(userInput);
        });
    })
}