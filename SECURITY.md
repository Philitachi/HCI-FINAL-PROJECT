# Security Policy

## Overview

The Fire Safety Inspection System (FSIS) takes security and data privacy very seriously, as we handle sensitive business and personal information regarding fire safety compliance.

## Supported Versions

Currently, we only provide security updates for the latest major version of the application. 

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Model & Architecture

This application employs several layers of security to protect user data:

1. **Authentication & Authorization**: Handled securely via Firebase Authentication. We do not store plain-text passwords on our servers.
2. **Client-Side Encryption**: We utilize `CryptoJS` (via `src/utils/crypto.js`) to perform token encryption and decryption for sensitive session data before storing it in the browser's `localStorage` or `sessionStorage`.
3. **Database Security**: Firebase Firestore rules are implemented to restrict database reads and writes exclusively to authenticated users and authorized document owners.
4. **Environment Security**: Firebase configuration variables (API keys, App IDs) are strictly compartmentalized from the raw source code.

## Reporting a Vulnerability

We prioritize the rapid patching of security vulnerabilities. If you discover a vulnerability in the Fire Safety Inspection System, we ask that you report it to us privately rather than creating a public issue.

**Steps to Report:**
1. Please communicate the vulnerability privately to the project administrators.
2. Provide a detailed description of the flaw, including steps to reproduce the issue.
3. Include information on the environment (e.g., Browser version) where the vulnerability was found.

**What to expect:**
- You should receive an acknowledgment of your report within 48 hours.
- We will work to verify the vulnerability and prioritize a patch. Once a patch is developed and verified, it will be rolled out as a hotfix.

**Please do not open public GitHub issues for critical security vulnerabilities.**
