import { READER_TYPES } from '../readers';

export class Symbologies {
    public static get All() {
        return [
            this.Code39,
            this.Code128,
            this.GS1128,
            ...this.GTINX,
            ...this.ITFX,
        ] as (keyof typeof READER_TYPES)[];
    }

    public static get GTINX(): string[] {
        return [this.GTIN8, this.GTIN12, this.GTIN13, this.GTIN14];
    }

    public static get ITFX(): string[] {
        return [this.ITF8, this.ITF12, this.ITF13, this.ITF14];
    }

    public static get Code39() {
        return 'code_39';
    }

    public static get GTIN8() {
        return 'gtin_8';
    }

    public static get GTIN12() {
        return 'gtin_12';
    }

    public static get GTIN13() {
        return 'gtin_13';
    }

    public static get GTIN14() {
        return 'gtin_14';
    }

    public static get ITF8() {
        return 'itf_8';
    }

    public static get ITF12() {
        return 'itf_12';
    }

    public static get ITF13() {
        return 'itf_13';
    }

    public static get ITF14() {
        return 'itf_14';
    }

    public static get GS1128() {
        return 'gs1_128';
    }

    public static get Code128() {
        return 'code_128';
    }
}
