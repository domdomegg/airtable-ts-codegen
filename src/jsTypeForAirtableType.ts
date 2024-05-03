import { FieldSchema } from './getBaseSchema';

export const jsTypeForAirtableType = (field: FieldSchema): string => {
  switch (field.type) {
    case 'url':
    case 'email':
    case 'phoneNumber':
    case 'singleLineText':
    case 'multilineText':
    case 'richText':
    case 'singleSelect':
    case 'externalSyncSource':
      return 'string';
    case 'multipleRecordLinks':
    case 'multipleSelects':
      return 'string[]';
    case 'number':
    case 'rating':
    case 'duration':
    case 'currency':
    case 'percent':
    case 'count':
    case 'autoNumber':
      return 'number';
    case 'date':
    case 'dateTime':
    case 'createdTime':
    case 'lastModifiedTime':
      return 'number'; // Unix timestamp in seconds
    case 'checkbox':
      return 'boolean';
    case 'lookup':
    case 'multipleLookupValues':
    case 'rollup':
    case 'formula':
      if (
        field.options
          && 'result' in field.options
          && typeof field.options.result === 'object'
          && field.options.result != null
      ) {
        return `${jsTypeForAirtableType(field.options.result as FieldSchema)} | null`;
      }
      throw new Error(`Invalid ${field.type} field (no options.result): ${field.id}`);

    // Special cases we don't yet support
    case 'aiText':
      return 'AiTextObject';
    case 'singleCollaborator':
    case 'createdBy':
    case 'lastModifiedBy':
      return 'CollaboratorObject';
    case 'multipleCollaborators':
      return 'CollaboratorObject[]';
    case 'multipleAttachments':
      return 'AttachmentObject[]';
    case 'barcode':
      return 'BarcodeObject';
    case 'button':
      return 'ButtonObject';
    default:
      throw new Error(`Could not convert Airtable type '${field.type}' to a TypeScript type for field ${field.id}`);
  }
};
