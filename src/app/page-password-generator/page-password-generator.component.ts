import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PasswordGeneratorConfig, PasswordService } from './password.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Toast } from 'bootstrap';
import { GlobalStateService } from '../global-state.service';
import { filter, switchAll } from 'rxjs';

const atLeastOneChecked: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (
        control.get("includeUppercase")?.value !== true &&
        control.get("includeLowercase")?.value !== true &&
        control.get("includeNumbers")?.value !== true &&
        control.get("includeSpecials")?.value !== true
    ) {
        return { atLeastOne: true };
    }
    return null;
};

@Component({
    selector: 'app-page-password-generator',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './page-password-generator.component.html',
    styles: ``
})
export class PagePasswordGeneratorComponent implements OnInit {
    configForm!: FormGroup;
    passwordConfig!: PasswordGeneratorConfig;
    actualPassword?: string;
    passwordHistory!: string[];
    configFormEnabled: boolean = true;

    get length() { return this.configForm.get("length"); };
    get includeUppercase() { return this.configForm.get("includeUppercase"); };
    get includeLowercase() { return this.configForm.get("includeLowercase"); };
    get includeNumbers() { return this.configForm.get("includeNumbers"); };
    get includeSpecials() { return this.configForm.get("includeSpecials"); };

    @ViewChild('mainToast') private mainToast!: ElementRef;
    toastMessage: string = "";

    constructor(
        private formBuilder: FormBuilder,
        private passwordService: PasswordService,
        private globalState: GlobalStateService,
    ) {
        this.passwordConfig = this.globalState.passwordConfig$.getValue();
        this.passwordHistory = this.globalState.passwordHistory$.getValue();

        this.configForm = this.formBuilder.group({
            length: [this.passwordConfig.length, [Validators.required, Validators.min(8), Validators.max(48)]],
            includeUppercase: [this.passwordConfig.includeUppercase],
            includeLowercase: [this.passwordConfig.includeLowercase],
            includeNumbers: [this.passwordConfig.includeNumbers],
            includeSpecials: [this.passwordConfig.includeSpecials],
        }, {
            validators: [atLeastOneChecked],
        });

        this.configForm.statusChanges
            .pipe(
                filter(() => this.configForm.valid),
                switchAll(),
            )
            .subscribe(() => this.handleFormValid());
    }

    ngOnInit(): void {
    }

    onGenerate() {
        if (!this.configForm.valid) {
            return;
        }

        this.saveConfig();

        this.configFormEnabled = false;
        const password = this.passwordService.generate(this.passwordConfig);

        if (typeof password === "string") {
            this.actualPassword = password;
            this.pushPasswordHistory(password);
        }

        this.configFormEnabled = true;
    }

    copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        this.showToast("Password copied");
    }

    private pushPasswordHistory(password: string) {
        if (this.passwordHistory.length == 50) {
            this.passwordHistory.pop();
        }
        this.passwordHistory.unshift(password);
        this.globalState.passwordHistory$.next(this.passwordHistory);
    }

    private handleFormValid() {
        this.saveConfig();
    }

    private saveConfig(): void {
        this.passwordConfig = this.configForm.value;
        this.globalState.passwordConfig$.next(this.passwordConfig);
    }

    private showToast(message: string): void {
        this.toastMessage = message;
        const toast = Toast.getOrCreateInstance(this.mainToast.nativeElement);
        toast.show();
    }
}
