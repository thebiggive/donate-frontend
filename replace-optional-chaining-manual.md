# Manual Replacement Guide for Optional Chaining

The automatic script has some limitations when handling complex optional chaining patterns. This guide provides patterns for manual replacement.

## Common Patterns and Their Replacements

### 1. Simple Property Access

**Original:**
```typescript
obj?.property
```

**Replacement:**
```typescript
(obj && obj.property)
```

### 2. Nested Property Access

**Original:**
```typescript
obj?.prop1?.prop2
```

**Replacement:**
```typescript
(obj && obj.prop1 && obj.prop1.prop2)
```

### 3. Method Calls

**Original:**
```typescript
obj?.method()
```

**Replacement:**
```typescript
(obj && obj.method())
```

### 4. Array Access

**Original:**
```typescript
arr?.[index]
```

**Replacement:**
```typescript
(arr && arr[index])
```

### 5. Optional Chaining with Nullish Coalescing

**Original:**
```typescript
obj?.prop ?? defaultValue
```

**Replacement:**
```typescript
((obj && obj.prop) || defaultValue)
```

Note: This is not exactly equivalent if `obj.prop` could be `0` or `''`. In those cases, use:

```typescript
((obj && obj.prop !== undefined && obj.prop !== null) ? obj.prop : defaultValue)
```

### 6. Optional Chaining in Template Expressions

In Angular templates, replace:

```html
{{ obj?.prop }}
```

with:

```html
{{ obj && obj.prop }}
```

## Files to Check Manually

The following files may need manual review and correction:

1. Complex components with many optional chaining usages:
   - donation-start-form.component.ts
   - my-payment-methods.component.ts
   - campaign-details.component.ts

2. HTML templates with optional chaining:
   - All .html files identified in the search results

## Testing

After making replacements:

1. Compile the project to ensure there are no syntax errors
2. Test the application functionality to ensure the replacements work correctly
3. Pay special attention to error handling and null/undefined checks
