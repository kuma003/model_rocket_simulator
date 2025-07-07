# Claude Code Configuration

This file contains configuration and instructions for Claude Code when working on this project.

## Project Structure

- Frontend: React-based application in `/frontend` directory
- Uses SCSS for styling with modular CSS approach

## Development Workflow

- Main branch: `main`
- Development branch: `develop`
- Always work on the `develop` branch for new features
- **MANDATORY**: After any code changes, ALWAYS run debugging/testing commands before committing
- **MANDATORY**: Only commit if tests/build pass successfully
- Check for linting and type errors with available scripts

## Styling Guidelines

- Primary font: BIZ UDPGothic (Japanese-friendly Google Font)
- Uses CSS modules with `.module.scss` files
- Maintains consistent color scheme with gradient effects

## Code Documentation Guidelines

- **MANDATORY**: Always write docstrings in English to prevent character encoding issues
- Use JSDoc format for TypeScript/JavaScript files
- Include parameter descriptions, return types, and usage examples where appropriate

## Commit Guidelines

- **MANDATORY**: Use Semantic Commit Messages format
- Keep commits focused and atomic
- No need to add Claude attribution in commit messages
- **MANDATORY**: Always push to remote repository after successful commit
- Use `git push origin develop` to push changes to the remote branch

### Semantic Commit Messages Format

Format: `<type>(<scope>): <subject>`

Where `<scope>` is optional.

**Example:**

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

**Types:**

- `feat`: new feature for the user (not a new feature for build script)
- `fix`: bug fix for the user (not a fix to a build script)
- `docs`: changes to the documentation
- `style`: formatting, missing semi colons, etc; no production code change
- `refactor`: refactoring production code, eg. renaming a variable
- `test`: adding missing tests, refactoring tests; no production code change
- `chore`: updating grunt tasks etc; no production code change

## Allowed Commands and Tools

Claude is permitted to use the following commands and tools:

### File Operations

- `rm` commands for cleanup
- `mv` commands for file/directory operations
- `find` commands for file searching
- `sudo rm` commands when needed (with caution)

### NPM and Build Commands

- `npm install` and `npm install <package>`
- `npm ci` for clean installs
- `npm update` for dependency updates
- `npm uninstall <package>` for removing packages
- `npm ls` for listing packages
- `npm run build` and related build commands
- `npm run typecheck` for TypeScript checking
- `npm run lint` for code linting
- `npm run dev` for development server
- `npx tsc` for TypeScript compilation
- `npx vite build` for Vite builds

### Git Commands

- `git add` for staging changes
- `git commit` for creating commits
- `git push` for pushing to remote
- `git config` for configuration
- `git remote set-url` for remote management

### Search and Analysis Tools

- `rg` (ripgrep) for fast text searching
- Specialized searches for dependencies and imports
