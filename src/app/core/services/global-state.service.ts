import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PasswordGeneratorConfig } from "../entities/password-generator-config";

const STORAGE_PASSWORD_CONFIG = "password-generator/config";
const STORAGE_PASSWORD_HISTORY = "password-generator/history";

@Injectable({
    providedIn: "root"
})
export class GlobalStateService {
    passwordConfig$!: BehaviorSubject<PasswordGeneratorConfig>;
    passwordHistory$!: BehaviorSubject<string[]>;

    constructor() {
        this.loadPasswordConfig();
        this.loadPasswordHistory();
    }

    private loadPasswordConfig() {
        let config: PasswordGeneratorConfig;

        try {
            const data = localStorage.getItem(STORAGE_PASSWORD_CONFIG);
            if (!data) {
                throw new Error();
            }
            config = JSON.parse(data) as PasswordGeneratorConfig;
        } catch (e) {
            config = {
                length: 14,
                includeUppercase: true,
                includeLowercase: true,
                includeNumbers: true,
                includeSpecials: true,
            };
        }

        this.passwordConfig$ = new BehaviorSubject(config);
        this.passwordConfig$.subscribe({
            next: (config) => {
                localStorage.setItem(STORAGE_PASSWORD_CONFIG, JSON.stringify(config));
            }
        })
    }

    private loadPasswordHistory() {
        let history: string[] = [];

        try {
            const data = sessionStorage.getItem(STORAGE_PASSWORD_HISTORY);
            if (!data) {
                throw new Error();
            }
            history = JSON.parse(data) as string[];
        } catch (e) {
        }

        this.passwordHistory$ = new BehaviorSubject(history)
        this.passwordHistory$.subscribe({
            next: (history) => {
                sessionStorage.setItem(STORAGE_PASSWORD_HISTORY, JSON.stringify(history));
            }
        });
    }
}
