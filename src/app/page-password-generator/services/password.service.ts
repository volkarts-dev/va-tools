import { Injectable } from "@angular/core";
import { PasswordGeneratorConfig } from "../../core/entities/password-generator-config";
import { GeneratedPassword } from "../models/generated-password";

const CharacterTypes = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    specials: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
};

function makeRandomInt(min: number, max: number) {
    const randomBuffer = new Uint32Array(1);

    window.crypto.getRandomValues(randomBuffer);

    let randomNumber = randomBuffer[0] / (0xffffffff + 1);

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(randomNumber * (max - min + 1)) + min;
}

@Injectable({
    providedIn: "root",
})
export class PasswordService {

    generate(config: PasswordGeneratorConfig): GeneratedPassword | null {
        let alphabet = "";
        let password = "";

        if (config.includeLowercase) {
            alphabet += CharacterTypes.lowercase;
            password += this.generateRandomChars(CharacterTypes.lowercase, Math.ceil(config.length * 0.15));
        }
        if (config.includeUppercase) {
            alphabet += CharacterTypes.uppercase;
            password += this.generateRandomChars(CharacterTypes.uppercase, Math.ceil(config.length * 0.15));
        }
        if (config.includeNumbers) {
            alphabet += CharacterTypes.numbers;
            password += this.generateRandomChars(CharacterTypes.numbers, Math.ceil(config.length * 0.15));
        }
        if (config.includeSpecials) {
            alphabet += CharacterTypes.specials;
            password += this.generateRandomChars(CharacterTypes.specials, Math.ceil(config.length * 0.15));
        }

        if (alphabet.length == 0) {
            return null;
        }

        password += this.generateRandomChars(alphabet, config.length - password.length);

        password = this.shuffle(password);

        return {created: new Date(), password: password};
    }

    private generateRandomChars(alphabet: string, length: number): string {
        let randomChars = "";
        for (let i = 0; i < length; i++) {
            randomChars += alphabet[makeRandomInt(0, alphabet.length - 1)];
        }
        return randomChars;
    }

    private shuffle(pw: string): string {
        let pwArr = pw.split("");

        let m = pwArr.length;
        while (m) {
            const i = makeRandomInt(0, --m);

            const t = pwArr[m];
            pwArr[m] = pwArr[i];
            pwArr[i] = t;
        }
        return pwArr.join("");
    }
}
