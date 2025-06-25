import './styles.css';
import { marked } from 'marked';
import { editor, dataEditor } from './ui.js';
import heroModelJson from './samples/hero-model.json';
import heroDataJson from './samples/hero-data.json';
import modalModelJson from './samples/modal-model.json';
import modalDataJson from './samples/modal-data.json';
import mixbagModelJson from './samples/mixbag-model.json';
import mixbagDataJson from './samples/mixbag-data.json';
import quoteModelJson from './samples/quote-model.json';
import quoteDataJson from './samples/quote-data.json';
import searchModelJson from './samples/search-model.json';
import searchDataJson from './samples/search-data.json';
import blockModelJson from './samples/block-model.json';
import blockDataJson from './samples/block-data.json';
import blockWithClassesModelJson from './samples/block-with-classes-model.json';
import blockWithClassesDataJson from './samples/block-with-classes-data.json';

// Create a mapping of model names to their model and data
const modelData = {
  hero: { model: heroModelJson, data: heroDataJson },
  modal: { model: modalModelJson, data: modalDataJson },
  mixbag: { model: mixbagModelJson, data: mixbagDataJson },
  quote: { model: quoteModelJson, data: quoteDataJson },
  search: { model: searchModelJson, data: searchDataJson },
  block: { model: blockModelJson, data: blockDataJson },
  'block-with-classes': { model: blockWithClassesModelJson, data: blockWithClassesDataJson }
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
const resizeBar1 = document.querySelector('.resize-bar-1');
const resizeBar2 = document.querySelector('.resize-bar-2');
const editorSection = document.querySelector('.editor-section');
const dataSection = document.querySelector('.data-section');
const previewSection = document.querySelector('.preview-section');
let isResizing = false;
let isResizingBar1 = false;
let isResizingBar2 = false;
let startX;
let startWidth;

function initResize(e, barNumber) {
  isResizing = true;
  if (barNumber === 1) {
    isResizingBar1 = true;
    startX = e.clientX;
    startWidth = editorSection.offsetWidth;
  } else {
    isResizingBar2 = true;
    startX = e.clientX;
    startWidth = dataSection.offsetWidth;
  }
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

  const containerWidth = editorSection.parentElement.offsetWidth;
  const minWidth = 200;
  const resizeBarWidth = 8;

  if (isResizingBar1) {
    const width = startWidth + (e.clientX - startX);
    const previewWidth = previewSection.offsetWidth;
    const maxWidth = containerWidth - minWidth - previewWidth - resizeBarWidth * 2;

    if (width >= minWidth && width <= maxWidth) {
      const dataWidth = containerWidth - width - previewWidth - resizeBarWidth * 2;
      const main = editorSection.parentElement;
      main.style.gridTemplateColumns = `${width}px ${resizeBarWidth}px ${dataWidth}px ${resizeBarWidth}px ${previewWidth}px`;
    }
  } else if (isResizingBar2) {
    const width = startWidth + (e.clientX - startX);
    const editorWidth = editorSection.offsetWidth;
    const maxWidth = containerWidth - editorWidth - minWidth - resizeBarWidth * 2;

    if (width >= minWidth && width <= maxWidth) {
      const previewWidth = containerWidth - editorWidth - width - resizeBarWidth * 2;
      const main = editorSection.parentElement;
      main.style.gridTemplateColumns = `${editorWidth}px ${resizeBarWidth}px ${width}px ${resizeBarWidth}px ${previewWidth}px`;
    }
  }
}

function stopResize() {
  isResizing = false;
  isResizingBar1 = false;
  isResizingBar2 = false;
  document.body.style.cursor = '';
  document.body.classList.remove('resizing');
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
}

resizeBar1.addEventListener('mousedown', (e) => initResize(e, 1));
resizeBar2.addEventListener('mousedown', (e) => initResize(e, 2));
resizeBar1.addEventListener('dblclick', centerSections);
resizeBar2.addEventListener('dblclick', centerSections);

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

// Set initial content to hero model and data
editor.setValue(JSON.stringify(heroModelJson, null, 2));
dataEditor.setValue(JSON.stringify(heroDataJson, null, 2));

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
    const modelDataItem = modelData[model];
    if (modelDataItem) {
      editor.setValue(JSON.stringify(modelDataItem.model, null, 2));
      dataEditor.setValue(JSON.stringify(modelDataItem.data, null, 2));
    }
  });
});

function centerSections() {
  const containerWidth = editorSection.parentElement.offsetWidth;
  const resizeBarWidth = 8;
  const newWidth = (containerWidth - resizeBarWidth * 2) / 3;
  const main = editorSection.parentElement;
  main.style.gridTemplateColumns = `${newWidth}px ${resizeBarWidth}px ${newWidth}px ${resizeBarWidth}px ${newWidth}px`;
}