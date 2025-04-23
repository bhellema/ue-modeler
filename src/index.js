import './styles.css';
import { marked } from 'marked';
import { editor } from './ui.js';
import heroJson from './samples/hero.json';
import modalJson from './samples/modal.json';
import mixbagJson from './samples/mixbag.json';
import quoteJson from './samples/quote.json';
import searchJson from './samples/search.json';
import blockJson from './samples/block.json';
import blockWithClassesJson from './samples/block-with-classes.json';

// Create a mapping of model names to their JSON data
const modelData = {
  hero: heroJson,
  modal: modalJson,
  mixbag: mixbagJson,
  quote: quoteJson,
  search: searchJson,
  block: blockJson,
  'block-with-classes': blockWithClassesJson
};

// Handle description container collapse
const descriptionContainer = document.querySelector('.description-container');
const collapseButton = document.querySelector('.collapse-button');

function toggleDescription() {
  descriptionContainer.classList.toggle('collapsed');
}

descriptionContainer.addEventListener('click', toggleDescription);
descriptionContainer.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleDescription();
  }
});

// Handle resize bar functionality
const resizeBar = document.querySelector('.resize-bar');
const editorSection = document.querySelector('.editor-section');
const previewSection = document.querySelector('.preview-section');
let isResizing = false;
let startX;
let startWidth;

function initResize(e) {
  isResizing = true;
  startX = e.clientX;
  startWidth = editorSection.offsetWidth;
  document.body.style.cursor = 'col-resize';
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
}

function handleResize(e) {
  if (!isResizing) return;

  // Add resizing class only when we actually start moving
  if (!document.body.classList.contains('resizing')) {
    document.body.classList.add('resizing');
  }

  const width = startWidth + (e.clientX - startX);
  const containerWidth = editorSection.parentElement.offsetWidth;
  const minWidth = 200;
  const maxWidth = containerWidth - minWidth - resizeBar.offsetWidth;

  if (width >= minWidth && width <= maxWidth) {
    editorSection.style.width = `${width}px`;
    previewSection.style.width = `${containerWidth - width - resizeBar.offsetWidth}px`;
  }
}

function stopResize() {
  isResizing = false;
  document.body.style.cursor = '';
  document.body.classList.remove('resizing');
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
}

resizeBar.addEventListener('mousedown', initResize);
resizeBar.addEventListener('dblclick', centerSections);

// Handle help button click
const helpButton = document.querySelector('.help-button');
const documentationPanel = document.querySelector('.documentation-panel');
const closeButton = document.querySelector('.close-button');
const documentationContent = document.querySelector('.documentation-content');

async function loadDocumentation() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/bhellema/ue-modeler/main/docs/usage.md');
    const markdown = await response.text();
    documentationContent.innerHTML = marked.parse(markdown);
  } catch (error) {
    documentationContent.innerHTML = '<p>Error loading documentation. Please try again later.</p>';
  }
}

function toggleDocumentation() {
  documentationPanel.classList.toggle('open');
  if (documentationPanel.classList.contains('open')) {
    loadDocumentation();
  }
}

helpButton.addEventListener('click', toggleDocumentation);
closeButton.addEventListener('click', toggleDocumentation);

// Close documentation when clicking outside
document.addEventListener('click', (e) => {
  if (documentationPanel.classList.contains('open') &&
    !documentationPanel.contains(e.target) &&
    e.target !== helpButton) {
    toggleDocumentation();
  }
});

// Set initial content to hero model
editor.setValue(JSON.stringify(heroJson, null, 2));

// dynamically add a button for each model
Object.keys(modelData).forEach(model => {
  const button = document.createElement('button');
  button.classList.add('nav-button');
  button.setAttribute('data-model', model);
  // uppercase the first letter
  button.textContent = model.charAt(0).toUpperCase() + model.slice(1);

  // update to append the new button before the help button
  const helpButton = document.querySelector('.help-button');
  helpButton.parentNode.insertBefore(button, helpButton);
});

// Add click handlers for all model buttons
document.querySelectorAll('.nav-button').forEach(button => {
  button.addEventListener('click', () => {
    const model = button.getAttribute('data-model');
    const json = modelData[model];
    if (json) {
      editor.setValue(JSON.stringify(json, null, 2));
    }
  });
});

function centerSections() {
  const containerWidth = editorSection.parentElement.offsetWidth;
  const newWidth = (containerWidth - resizeBar.offsetWidth) / 2;
  editorSection.style.width = `${newWidth}px`;
  previewSection.style.width = `${newWidth}px`;
}