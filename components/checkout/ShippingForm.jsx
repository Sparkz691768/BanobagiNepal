'use client'

import Input from '@/components/ui/Input'

export default function ShippingForm({ values, onChange, errors }) {
  const handle = (field) => (e) => onChange(field, e.target.value)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <Input
          label="Full Name"
          value={values.shipping_name}
          onChange={handle('shipping_name')}
          error={errors?.shipping_name}
          placeholder="Your full name"
        />
      </div>
      <Input
        label="Email"
        type="email"
        value={values.shipping_email}
        onChange={handle('shipping_email')}
        error={errors?.shipping_email}
        placeholder="email@example.com"
      />
      <Input
        label="Phone"
        type="tel"
        value={values.shipping_phone}
        onChange={handle('shipping_phone')}
        error={errors?.shipping_phone}
        placeholder="98XXXXXXXX"
      />
      <div className="sm:col-span-2">
        <Input
          label="Delivery Address"
          value={values.shipping_address}
          onChange={handle('shipping_address')}
          error={errors?.shipping_address}
          placeholder="Street, area, landmark"
        />
      </div>
      <Input
        label="City"
        value={values.shipping_city}
        onChange={handle('shipping_city')}
        error={errors?.shipping_city}
        placeholder="Kathmandu"
      />
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase text-body mb-1 block">
          Notes (optional)
        </label>
        <textarea
          value={values.shipping_notes}
          onChange={handle('shipping_notes')}
          rows={2}
          className="input-field resize-none"
          placeholder="Special delivery instructions..."
        />
      </div>
    </div>
  )
}
