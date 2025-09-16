# CodeHerring

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  

---

## Overview

**CodeHerring** is a web-based live code editor that allows users to write and edit **HTML, CSS, and JavaScript** with real-time preview. It supports:

- **Live preview** of your code
- **Predefined snippets** with drag-and-drop insertion
- **Resizable editor and preview panels**
- **Autocomplete and syntax highlighting** via CodeMirror

---

## Features

- **Multi-language editors**: HTML, CSS, JS
- **Live preview**: Updates automatically as you type
- **Snippets support**: Insert reusable code components
- **Resizable panels**: Adjust editor and preview width by dragging
- **CodeMirror enhancements**: Autocomplete, linting, bracket and tag closing

---

## Installation

To run CodeHerring locally:

1. **Clone the repository**:

```bash
git clone https://github.com/YourUsername/CodeHerring.git
cd CodeHerring
Start a local HTTP server (required for ES Modules):

bash
Code kopiëren
# Python 3
python -m http.server 5500
Open your browser at http://localhost:5500

File Structure
graphql
Code kopiëren
CodeHerring/
├── index.html          # Main HTML page
├── main.js             # Initializes editors and preview
├── editors.js          # Module for CodeMirror editor setup
├── snippets.js         # Module for predefined snippets
├── style.css           # Global styles
└── README.md           # Project README
Usage
Open the editor in your browser.

Type or paste HTML, CSS, and JS code into their respective editors.

Drag snippets from the sidebar into the editor to quickly insert prebuilt components.

Resize the editor and preview panel by dragging the vertical divider.

The live preview updates automatically.

Dependencies
CodeMirror 5 – Code editor with syntax highlighting

Modern browser with ES Modules support
