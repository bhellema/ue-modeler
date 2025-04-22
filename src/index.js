import './styles.css';
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

// Set initial content to hero model
editor.setValue(JSON.stringify(blockJson, null, 2));

// dynamically add a button for each model
Object.keys(modelData).forEach(model => {
  const button = document.createElement('button');
  button.classList.add('nav-button');
  button.setAttribute('data-model', model);
  // uppercase the first letter
  button.textContent = model.charAt(0).toUpperCase() + model.slice(1);
  document.querySelector('.nav-content').appendChild(button);
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