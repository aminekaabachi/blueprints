/**
 * Collapsable Component JavaScript
 * Handles the interactive functionality for collapsible components
 */

class CollapsableComponent {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupCollapsables());
    } else {
      this.setupCollapsables();
    }
  }

  setupCollapsables() {
    const collapsables = document.querySelectorAll('[data-collapsable]');
    
    collapsables.forEach(collapsable => {
      const trigger = collapsable.querySelector('[data-collapsable-trigger]');
      const content = collapsable.querySelector('[data-collapsable-content]');
      
      if (trigger && content) {
        this.setupCollapsable(trigger, content);
      }
    });
  }

  setupCollapsable(trigger, content) {
    // Set initial state based on CSS class
    const isInitiallyOpen = content.classList.contains('is-open');
    this.updateAriaState(trigger, isInitiallyOpen);

    // Add click event listener
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleCollapsable(trigger, content);
    });

    // Add keyboard support
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleCollapsable(trigger, content);
      }
    });
  }

  toggleCollapsable(trigger, content) {
    const isOpen = content.classList.contains('is-open');
    
    if (isOpen) {
      this.closeCollapsable(trigger, content);
    } else {
      this.openCollapsable(trigger, content);
    }
  }

  openCollapsable(trigger, content) {
    content.classList.add('is-open');
    this.updateAriaState(trigger, true);
    
    // Dispatch custom event
    content.dispatchEvent(new CustomEvent('collapsable:opened', {
      bubbles: true,
      detail: { trigger, content }
    }));
  }

  closeCollapsable(trigger, content) {
    content.classList.remove('is-open');
    this.updateAriaState(trigger, false);
    
    // Dispatch custom event
    content.dispatchEvent(new CustomEvent('collapsable:closed', {
      bubbles: true,
      detail: { trigger, content }
    }));
  }

  updateAriaState(trigger, isOpen) {
    trigger.setAttribute('aria-expanded', isOpen.toString());
  }

  // Public API methods
  static openAll() {
    const collapsables = document.querySelectorAll('[data-collapsable-content]:not(.is-open)');
    collapsables.forEach(content => {
      const trigger = content.parentElement.querySelector('[data-collapsable-trigger]');
      if (trigger) {
        const instance = new CollapsableComponent();
        instance.openCollapsable(trigger, content);
      }
    });
  }

  static closeAll() {
    const collapsables = document.querySelectorAll('[data-collapsable-content].is-open');
    collapsables.forEach(content => {
      const trigger = content.parentElement.querySelector('[data-collapsable-trigger]');
      if (trigger) {
        const instance = new CollapsableComponent();
        instance.closeCollapsable(trigger, content);
      }
    });
  }
}

// Initialize the component
const collapsableComponent = new CollapsableComponent();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CollapsableComponent;
}

// Make available globally
window.CollapsableComponent = CollapsableComponent; 