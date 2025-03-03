import { Injectable } from "@angular/core";
import { base32, base32crockford, base58, base64, base64url, base64urlnopad } from "@scure/base";
import { BaseConversionResult } from "../entities/base-conversion-result";

function toHex(b: number) {
    let hex = b.toString(16);
    if (hex.length % 2 == 1) {
        hex = '0' + hex;
    }
    return hex;
}

function fromUTF8(data: Uint8Array): string {
    const extraByteMap = [1, 1, 1, 1, 2, 2, 3, 0];
    var count = data.length;
    var str = "";

    for (var index = 0; index < count;) {
        var ch = data[index++];

        if (ch & 0x80) {
            var extra = extraByteMap[(ch >> 3) & 0x07];
            if (!(ch & 0x40) || !extra || ((index + extra) > count)) {
                str += '\\x' + toHex(ch);
                continue;
            }

            ch = ch & (0x3F >> extra);
            let invalid = false;
            for (; extra > 0; extra -= 1) {
                var chx = data[index++];
                if ((chx & 0xC0) != 0x80) {
                    str += '\\x' + toHex(ch);
                    invalid = true;
                    break;
                }

                ch = (ch << 6) | (chx & 0x3F);
            }

            if (invalid)
                continue;
        }

        str += String.fromCharCode(ch);
    }

    return str;
}

function pad(bits: number, str: string, chr: string = "="): string {
    while ((str.length * bits) % 8) {
        str += chr;
    }
    return str;
}

function base64Decode(codec: string, text: string) {
    let blocks = text.split(".");
    const decoded = blocks.map((t) => {
        let out = new Uint8Array();
        if (text.indexOf("-") != -1 || text.indexOf("_") != -1) {
            out = base64url.decode(pad(6, t));
        } else {
            out = base64.decode(pad(6, t));
        }
        const displayableText = fromUTF8(out);

        const trimmedDisplayableText = displayableText.trim();
        if ((trimmedDisplayableText.startsWith('[') && trimmedDisplayableText.endsWith(']')) ||
            (trimmedDisplayableText.startsWith('{') && trimmedDisplayableText.endsWith('}'))) {
            try {
                const val = JSON.parse(displayableText);
                return JSON.stringify(val, null, 2);
            } catch {
                // no json (or json with errors), fall through and output normal text
            }
        }

        return displayableText;
    });
    return decoded.join("\n.\n");
}

@Injectable({
    providedIn: "root"
})
export class BaseConversionService {
    decode(codec: string, text: string): BaseConversionResult {
        text = text.trim();
        try {
            if (codec === "base32") {
                const resultText = base32.decode(pad(5, text));
                return { valid: true, resultText: fromUTF8(resultText) };
            } else if (codec === "base32crockford") {
                const resultText = base32crockford.decode(text);
                return { valid: true, resultText: fromUTF8(resultText) };
            } else if (codec === "base58") {
                const resultText = base58.decode(pad(5, text));
                return { valid: true, resultText: fromUTF8(resultText) };
            } else if (codec.startsWith("base64")) {
                return { valid: true, resultText: base64Decode(codec, text) };
            } else {
                throw new Error("Invalid codec");
            }
        } catch (e) {
            return { valid: false, errorText: (e as Error).message };
        }
    }

    encode(codec: string, text: string): BaseConversionResult {
        text = text.trim();
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
