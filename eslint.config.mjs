import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
    { ignores: ['lib/**'] },
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['*.mjs'],
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['**/*.js'],
        extends: [tseslint.configs.disableTypeChecked],
    }
);
