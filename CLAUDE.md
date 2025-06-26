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

## Commit Guidelines
- Use conventional commit format (feat:, fix:, chore:, etc.)
- Keep commits focused and atomic
- No need to add Claude attribution in commit messages
- **MANDATORY**: Always push to remote repository after successful commit
- Use `git push origin develop` to push changes to the remote branch