import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseConversionService } from './base-conversion.service';
import { BaseConversionResult } from './base-conversion-result';
import { CommonModule } from '@angular/common';
import { Toast } from 'bootstrap';

@Component({
    selector: 'app-page-base-converter',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './page-base-converter.component.html',
    styles: ``
})
export class PageBaseConverterComponent {
    decodeForm = this.formBuilder.group({
        codec: ['base64', [
            Validators.required,
            // TODO validate options
        ]],
        encodedText: ['', [
            Validators.required,
        ]],
    });

    get decodeCodec() { return this.decodeForm.get("codec"); }
    get encodedText() { return this.decodeForm.get("encodedText"); }
    get encodedTextValid() { return this.encodedText?.valid && this.decodeResult?.valid; }

    decodeFormSubmitted: boolean = false;
    decodeResult: BaseConversionResult | null = null;

    encodeForm = this.formBuilder.group({
        codec: ['base64', [
            Validators.required,
            // TODO validate options
        ]],
        text: ['', [
            Validators.required,
        ]],
    });

    get encodeCodec() { return this.encodeForm.get("codec"); }
    get text() { return this.encodeForm.get("text"); }
    get textValid() { return this.text?.valid && this.encodeResult?.valid; }

    encodeFormSubmitted: boolean = false;
    encodeResult: BaseConversionResult | null = null;

    @ViewChild('mainToast') private mainToast!: ElementRef;
    toastMessage: string = "";

    constructor(
        private formBuilder: FormBuilder,
        private conversionService: BaseConversionService,
    ) {
    }

    onSubmitDecodeForm() {
        const codec = this.decodeForm.value["codec"];
        if (!codec) {
            return;
        }

        const text = this.decodeForm.value["encodedText"];
        if (!text) {
            return;
        }

        this.decodeFormSubmitted = true;

        this.decodeResult = this.conversionService.decode(codec, text);
    }

    onSubmitEncodeForm() {
        const codec = this.encodeForm.value["codec"];
        if (!codec) {
            return;
        }

        const text = this.encodeForm.value["text"];
        if (!text) {
            return;
        }

        this.encodeFormSubmitted = true;

        this.encodeResult = this.conversionService.encode(codec, text);
    }

    copyToClipboard(text?: string) {
        if (!text) {
            return;
        }
        navigator.clipboard.writeText(text);
        this.showToast("Copied");
    }

    private showToast(message: string): void {
        this.toastMessage = message;
        const toast = Toast.getOrCreateInstance(this.mainToast.nativeElement);
        toast.show();
    }
}
