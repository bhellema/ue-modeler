# UE Modeler

A web-based tool for modeling and generating Markdown tables from JSON data. This application provides a user-friendly interface for creating and editing JSON models with real-time Markdown preview.

## Features

- Real-time JSON editing with syntax highlighting
- Live Markdown preview
- Pre-built model templates
- Modern, responsive UI
- GitHub Pages deployment

## Live Demo

Check out the live version at [https://bhellema.github.io/ue-modeler/](https://bhellema.github.io/ue-modeler/)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/bhellema/ue-modeler.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `src/` - Source files
  - `index.html` - Main HTML file
  - `index.js` - Main JavaScript file
  - `styles.css` - Styles
  - `samples/` - JSON model templates
- `dist/` - Build output
- `site/` - Production build for GitHub Pages

## Technologies Used

- Webpack
- CodeMirror
- Marked
- GitHub Actions
- GitHub Pages

## License

ISC
