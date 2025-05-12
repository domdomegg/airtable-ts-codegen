import type {BaseSchema} from '../getBaseSchema';

/**
 * Dump of an airtable table containing all field types.
 */
export const tablesMeta = {
	tables: [{
		id: 'tbluntrYUZ5bTz7YP', name: 'Table 1', primaryFieldId: 'fld7fNzf6ElsnsiXP', fields: [{type: 'singleLineText', id: 'fld7fNzf6ElsnsiXP', name: 'Single Line Text'},
			{type: 'singleCollaborator', id: 'fldzS7AY8z7fnPA2k', name: 'User'},
			{
				type: 'singleSelect', options: {choices: [{id: 'sel8rlr1irDiJymSd', name: 'Todo', color: 'redLight2'}, {id: 'sel7fRrgENSSM1Kwx', name: 'In progress', color: 'yellowLight2'}, {id: 'selMu3Gxu6YDW89st', name: 'Done', color: 'greenLight2'}]}, id: 'fldtZ94euYOEgLIKx', name: 'Single Select',
			},
			{
				type: 'multipleAttachments', options: {isReversed: false}, id: 'fldZXvZHFB1kQ8aO4', name: 'Attachments',
			},
			{
				type: 'aiText', options: {referencedFieldIds: ['fldZXvZHFB1kQ8aO4'], prompt: ['', {field: {fieldId: 'fldZXvZHFB1kQ8aO4'}}]}, id: 'fldIs4nyExgOYguEi', name: 'AI Text', description: '',
			},
			{type: 'multilineText', id: 'fldFtEQouCSxqW6sL', name: 'Long Text'},
			{
				type: 'checkbox', options: {icon: 'check', color: 'greenBright'}, id: 'flddE4RG6Mlugqo8X', name: 'Checkbox',
			},
			{
				type: 'multipleSelects', options: {choices: [{id: 'selcufYWsGwXvoe5K', name: 'A', color: 'blueLight2'}, {id: 'seldJM3V2vfY1MwId', name: 'B', color: 'cyanLight2'}]}, id: 'fldFWelqOO9koF8fM', name: 'Multiple Select',
			},
			{
				type: 'date', options: {dateFormat: {name: 'local', format: 'l'}}, id: 'fldAUPoAJ67TUwaVS', name: 'Date',
			},
			{
				type: 'dateTime', options: {dateFormat: {name: 'local', format: 'l'}, timeFormat: {name: '12hour', format: 'h:mma'}, timeZone: 'client'}, id: 'fldXCnBVRZ4HO4KIh', name: 'Datetime',
			},
			{type: 'phoneNumber', id: 'fldo5kOL07o835nyt', name: 'Phone Number'},
			{type: 'email', id: 'fldkmeNd7ZAGTS0nA', name: 'Email'},
			{type: 'url', id: 'fldAyWIcU6mOwCZl2', name: 'URL'},
			{
				type: 'number', options: {precision: 1}, id: 'fldN9DNkpCQ6IXH5C', name: 'Number',
			},
			{
				type: 'currency', options: {precision: 2, symbol: '$'}, id: 'fldcaKq3Hq6Rr1R53', name: 'Currency',
			},
			{
				type: 'percent', options: {precision: 0}, id: 'fldsKAqUJjKv5hlH1', name: 'Percent',
			},
			{
				type: 'duration', options: {durationFormat: 'h:mm'}, id: 'fldMH1inCgmp6KD8q', name: 'Duration',
			},
			{
				type: 'rating', options: {icon: 'star', max: 5, color: 'yellowBright'}, id: 'fldFZtTmcTm1Fxu4B', name: 'Rating',
			},
			{
				type: 'formula', options: {
					isValid: true, formula: '{fld7fNzf6ElsnsiXP}', referencedFieldIds: ['fld7fNzf6ElsnsiXP'], result: {type: 'singleLineText'},
				}, id: 'fldmYyrXlqiUpBu0C', name: 'Formula',
			},
			{
				type: 'createdTime', options: {result: {type: 'dateTime', options: {dateFormat: {name: 'local', format: 'l'}, timeFormat: {name: '12hour', format: 'h:mma'}, timeZone: 'client'}}}, id: 'fldOJHvKq8rrIYV90', name: 'Created',
			},
			{
				type: 'lastModifiedTime', options: {isValid: true, referencedFieldIds: [], result: {type: 'dateTime', options: {dateFormat: {name: 'local', format: 'l'}, timeFormat: {name: '12hour', format: 'h:mma'}, timeZone: 'client'}}}, id: 'fldH5xY5CV0Q4g5fY', name: 'Last Modified',
			},
			{type: 'lastModifiedBy', id: 'fld6W3h7dnVJhIni9', name: 'Last Modified By'},
			{type: 'createdBy', id: 'fldDcRoVGJXIhVSAi', name: 'Created By'},
			{type: 'autoNumber', id: 'fldGM8wIYk3G8WMiE', name: 'ID'},
			{type: 'barcode', id: 'fldMPs1eLH8X5bWeS', name: 'Barcode'},
			{type: 'button', id: 'fldAG3LTbJRwQVEvS', name: 'Button'}],
	}],
} satisfies {tables: BaseSchema};

