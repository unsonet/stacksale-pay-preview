# Stacksale Pay Preview

A library for generating and managing interactive promotion preview forms from a JSON configuration. It dynamically renders a form based on promotion data, handles user inputs, validates answers, and calculates costs.

## Installation

```bash
npm install @unsonet/stacksale-pay-preview
```

## Usage

Create a new preview instance by passing a configuration object. The preview will be rendered inside the specified DOM element.

```javascript
import { PreviewComponent } from '@unsonet/stacksale-pay-preview';
// or use global variable: window.StacksalePayPreview

const preview = new PreviewComponent({
  promotionData,       // Promotion configuration object
  previewElement: '#promotion',  // CSS selector or Element
  previewTemplate: '...',        // Optional custom HTML template string
  morphing: true,                // Use morphdom for DOM updates (preserves state)
  saveInputStates: true          // Preserve input states during updates
});
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `promotionData` | `object` | **Required.** The promotion configuration (see structure below). |
| `previewElement` | `string \| Element` | **Required.** CSS selector or DOM element where the preview will be inserted. |
| `previewTemplate` | `string` | Optional custom HTML template. If not provided, the element's existing HTML is used. |
| `morphing` | `boolean` | If `true`, uses `morphdom` to update the DOM efficiently while preserving input states (default `false`). |
| `saveInputStates` | `boolean` | If `true`, preserves user input values, focus, and selections during updates (default `false`). |

## API

### Methods

#### `updateData(data?)`
Updates the preview with new promotion data. If `data` is omitted, the current `promotionData` is used.

```javascript
preview.updateData(newPromotionData);
```

#### `updatePreviewOptionsHtml()`
Manually refreshes the internal options HTML. Usually called automatically, but can be invoked if needed.

#### `validationTouchAll()`
Marks all form fields as "touched", triggering validation UI (e.g., error highlighting). Useful before form submission.

```javascript
preview.validationTouchAll();
```

#### `updatePreview()`
Forces a re-render of the preview template. Called automatically on data changes, but can be invoked manually.

### Properties

| Property | Description |
|----------|-------------|
| `preview.nativeElement` | The root DOM element of the preview. |
| `promotionData` | The current promotion data object. |
| `previewAnswersValidation` | Validation state object (see structure below). |
| `editors` | Array of internal form editor instances (advanced use). |
| `errors` | Array of any errors encountered during rendering. |

### Events

The preview element (`preview.nativeElement`) dispatches custom events:

| Event | Description |
|-------|-------------|
| `template-ready` | Fired when the template has been fully initialized and is interactive. |
| `template-updated` | Fired after the template HTML has been updated (e.g., after data changes). |
| `template-submit` | Fired when a submit button (`.payPreAuthButton`) is clicked. The event detail contains `promotionDetail` with formatted promotion data, validation, and answers. |

Example of listening to events:

```javascript
preview.preview.nativeElement.addEventListener('template-updated', (e) => {
  console.log('Preview updated');
});

preview.preview.nativeElement.addEventListener('template-submit', (e) => {
  const { promotion, validation, answers } = e.detail;
  // Handle form submission
});
```

## Example

The following example demonstrates creating a preview, handling the accept terms checkbox, and managing the pay button.

```javascript
import { PreviewComponent } from '@unsonet/stacksale-pay-preview';

const promotionData = { ... }; // Your promotion JSON

document.addEventListener('DOMContentLoaded', () => {
  const preview = new PreviewComponent({
    promotionData,
    previewElement: '#promotion',
    morphing: true,
    saveInputStates: true
  });

  let acceptChecked = false;

  preview.preview.nativeElement.addEventListener('template-updated', () => {
    const accept = preview.preview.nativeElement.querySelector('[name="acceptT&C"]');
    if (accept) {
      accept.checked = acceptChecked;
      accept.addEventListener('change', (event) => {
        acceptChecked = event.target.checked;
        preview.updateData(); // refresh preview to update button states
      });
    }

    const payButtons = preview.preview.nativeElement.querySelectorAll('.payPreAuthButton');
    const isValid = preview.previewAnswersValidation.valid && acceptChecked;
    payButtons.forEach(btn => btn.classList.toggle('disabled', !isValid));

    payButtons.forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        if (!isValid) {
          preview.validationTouchAll();
          preview.updateData();
        }
        // Submit logic...
      });
    });
  });
});
```

## Promotion Data Structure

The `promotionData` object defines the entire promotion form, including categories, questions, pricing, and validation. Refer to the type definitions in `@unsonet/stacksale-pay-types` for a complete schema.

Key sections:
- `categories[]` – Each category contains `questions[]`.
- Question types: `multiChoiceQuestion`, `dateQuestion`, `shortTextQuestion`, `longTextQuestion`.
- Each question includes properties like `title`, `description`, `mandatory`, `pricing`, `taxes`, etc.

## Notes

- The library uses [@rmanaf/json-form](https://github.com/AntonPolyakin/json-form) for data binding and `morphdom` for DOM updates.
- Custom CSS and JS can be injected via `promotionData.customCSS` and `promotionData.customJS`.
- The preview automatically handles date pickers, select dropdowns, and validation.

For more details, consult the source code or internal documentation.