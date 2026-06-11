export const getRequestTypeIcon = (code: string) => {
  const c = code.toUpperCase()
  if (c.includes('LEAVE') || c.includes('NGHI')) return 'event_busy'
  if (c.includes('OT') || c.includes('GIO')) return 'more_time'
  if (c.includes('WFH') || c.includes('HOME')) return 'home_work'
  if (c.includes('EQUIP') || c.includes('THIET')) return 'laptop_mac'
  if (c.includes('REIMB') || c.includes('HOAN')) return 'payments'
  if (c.includes('STATION') || c.includes('PHAM')) return 'history_edu'
  return 'description'
}

export const getRequestTypeColor = (code: string) => {
  const c = code.toUpperCase()
  if (c.includes('LEAVE') || c.includes('NGHI')) return 'bg-rose-500'
  if (c.includes('OT') || c.includes('GIO')) return 'bg-amber-500'
  if (c.includes('WFH') || c.includes('HOME')) return 'bg-sky-500'
  if (c.includes('EQUIP') || c.includes('THIET')) return 'bg-indigo-500'
  if (c.includes('REIMB') || c.includes('HOAN')) return 'bg-emerald-500'
  if (c.includes('STATION') || c.includes('PHAM')) return 'bg-violet-500'
  return 'bg-primary'
}

export const getRequestTypeTextColor = (code: string) => {
  const c = code.toUpperCase()
  if (c.includes('LEAVE') || c.includes('NGHI')) return 'text-rose-600'
  if (c.includes('OT') || c.includes('GIO')) return 'text-amber-600'
  if (c.includes('WFH') || c.includes('HOME')) return 'text-sky-600'
  if (c.includes('EQUIP') || c.includes('THIET')) return 'text-indigo-600'
  if (c.includes('REIMB') || c.includes('HOAN')) return 'text-emerald-600'
  if (c.includes('STATION') || c.includes('PHAM')) return 'text-violet-600'
  return 'text-primary'
}

export const normalizeFormFields = (fields: any[]): any[] => {
  if (!Array.isArray(fields)) return []
  return fields.map(f => ({
    fieldId: f.fieldId || f.FieldId,
    label: f.label || f.Label,
    type: f.type || f.Type,
    required: f.required !== undefined ? f.required : f.Required,
    options: f.options || f.Options,
    validation: f.validation || f.Validation,
    allowMultiple: f.allowMultiple !== undefined ? f.allowMultiple : f.AllowMultiple,
    columns: f.columns ? normalizeFormFields(f.columns) : (f.Columns ? normalizeFormFields(f.Columns) : [])
  }))
}
