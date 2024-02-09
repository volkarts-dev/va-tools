import { Injectable } from "@angular/core";
import { BaseConversionResult } from "./base-conversion-result";
import { base32, base32crockford, base58, base64, base64url, base64urlnopad } from "@scure/base";

function escapeBytes(bytes: Uint8Array): string {
    const decoder = new TextDecoder("utf-8", { fatal: false, ignoreBOM: true });
    return decoder.decode(bytes);
}

function pad(bits: number, str: string, chr: string = "="): string {
    while ((str.length * bits) % 8) {
        str += chr;
    }
    return str;
}

function stripPadding(str: string, chr: string = "="): string {
    return str.replace(new RegExp(chr + "+$"), "");
}

@Injectable({
    providedIn: "root"
})
export class BaseConversionService {
    decode(codec: string, text: string): BaseConversionResult {
        try {
            if (codec === "base32") {
                const resultText = base32.decode(pad(5, text));
                return { valid: true, resultText: escapeBytes(resultText) };
            } else if (codec === "base32crockford") {
                const resultText = base32crockford.decode(text);
                return { valid: true, resultText: escapeBytes(resultText) };
            } else if (codec === "base58") {
                const resultText = base58.decode(pad(5, text));
                return { valid: true, resultText: escapeBytes(resultText) };
            } else if (codec === "base64") {
                const resultText = base64.decode(pad(6, text));
                return { valid: true, resultText: escapeBytes(resultText) };
            } else if (codec === "base64url") {
                const resultText = base64url.decode(pad(6, text));
                return { valid: true, resultText: escapeBytes(resultText) };
            } else if (codec === "base64urlnopad") {
                const resultText = base64urlnopad.decode(stripPadding(text));
                return { valid: true, resultText: escapeBytes(resultText) };
            } else {
                throw new Error("Invalid codec");
            }
        } catch (e) {
            return { valid: false, errorText: (e as Error).message };
        }
    }

    encode(codec: string, text: string): BaseConversionResult {
        try {
            const bytes = new TextEncoder().encode(text);
            if (codec === "base32") {
                const resultText = base32.encode(bytes);
                return { valid: true, resultText: resultText };
            } else if (codec === "base32crockford") {
                const resultText = base32crockford.encode(bytes);
                return { valid: true, resultText: resultText };
            } else if (codec === "base58") {
                const resultText = base58.encode(bytes);
                return { valid: true, resultText: resultText };
            } else if (codec === "base64") {
                const resultText = base64.encode(bytes);
                return { valid: true, resultText: resultText };
            } else if (codec === "base64url") {
                const resultText = base64url.encode(bytes);
                return { valid: true, resultText: resultText };
            } else if (codec === "base64urlnopad") {
                const resultText = base64urlnopad.encode(bytes);
                return { valid: true, resultText: resultText };
            } else {
                throw new Error("Invalid codec");
            }
        } catch (e) {
            return { valid: false, errorText: (e as Error).message };
        }
    }
}
