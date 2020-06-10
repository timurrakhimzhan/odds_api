export function createMessage(message: string, obj?: any) {
    if(obj) {
        return JSON.stringify({message: message, ...obj});

    }
    return JSON.stringify({message: message});
}