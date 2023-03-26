import * as readline from 'readline';

export async function prompt({ message }: { message: string }) {
    console.log(message);
    const answer = await question({ question: '> ' });
    return answer.trim();
}

async function question({ question }: { question: string }): Promise<string> {
    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise<string>((resolve) => {
        readlineInterface.question(question, (answer) => {
            resolve(answer);
            readlineInterface.close();
        });
    });
};