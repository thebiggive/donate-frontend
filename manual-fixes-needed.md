# Manual Fixes Needed After Automated Replacement

The automated scripts have replaced most instances of the optional chaining operator (`?.`) with pre-ES2020 equivalent code. However, some complex cases need manual attention. This document lists the files and patterns that need manual fixes.

## HTML Template Files

### Complex Nested Optional Chaining

Files with complex nested optional chaining that resulted in invalid syntax:

1. `/home/barney/projects/donate-frontend/src/app/my-payment-methods/my-payment-methods.component.html`
   - Lines 97-99: Invalid syntax with `.card.brand`
   - Lines 108-109: Invalid syntax with `.exp_month.toString()` and `.card.exp_year`
   - Lines 118-120: Similar issues with nested optional chaining

2. `/home/barney/projects/donate-frontend/src/app/change-regular-giving/change-regular-giving.component.html`
   - Check for similar patterns of nested optional chaining

3. `/home/barney/projects/donate-frontend/src/app/donation-start/donation-start-form/donation-start-form.component.html`
   - Check for complex form field validations using optional chaining

### Pattern to Fix

Replace patterns like:
```html
{{ obj && obj.prop?.subprop && .subprop.value }}
```

With:
```html
{{ obj && obj.prop && obj.prop.subprop && obj.prop.subprop.value }}
```

## TypeScript Files

### Complex Optional Chaining in TypeScript

Files with complex optional chaining patterns:

1. `/home/barney/projects/donate-frontend/src/app/donation-start/donation-start-form/donation-start-form.component.ts`
   - Large file with potentially complex optional chaining patterns

2. `/home/barney/projects/donate-frontend/src/app/my-payment-methods/my-payment-methods.component.ts`
   - Check for optional chaining in methods that handle payment methods

3. `/home/barney/projects/donate-frontend/src/app/campaign-details/campaign-details.component.ts`
   - Check for optional chaining in campaign data handling

### Pattern to Fix

Replace patterns like:
```typescript
obj?.prop?.method()
```

With:
```typescript
(obj && obj.prop && obj.prop.method())
```

## Testing

After making these manual fixes:

1. Compile the project to ensure there are no syntax errors
2. Test the application functionality to ensure the replacements work correctly
3. Pay special attention to error handling and null/undefined checks in the manually fixed areas

## Completion Checklist

- [ ] Fix complex nested optional chaining in HTML templates
- [ ] Fix complex optional chaining in TypeScript files
- [ ] Compile and test the application
- [ ] Update documentation if necessary
