// src/admin/pages/ProductForm.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import sinisdeath from '../../assets/sinisdeath_logo.svg'

// Turns "Classic T-Shirt" into "classic-t-shirt"
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')

export default function ProductForm({ product, onDone, onCancel }) {
  const isEditing = Boolean(product?.id)

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    compare_at_price: '',
    category_id: '',
    stock_quantity: 0,
    slug: '',
    is_active: true,
    image_url: '',
  })
  const [variants, setVariants] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Image upload state
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Load categories, plus the full product + variants if editing
  useEffect(() => {
    const load = async () => {
      const { data: cats } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')
      setCategories(cats ?? [])

      if (isEditing) {
        const { data: full } = await supabase
          .from('products')
          .select('*, product_variants(*)')
          .eq('id', product.id)
          .single()

        if (full) {
          setForm({
            name: full.name ?? '',
            description: full.description ?? '',
            price: full.price ?? '',
            compare_at_price: full.compare_at_price ?? '',
            category_id: full.category_id ?? '',
            stock_quantity: full.stock_quantity ?? 0,
            slug: full.slug ?? '',
            is_active: full.is_active ?? true,
            image_url: full.image_url ?? '',
          })
          setVariants(full.product_variants ?? [])
        }
      } else if (cats?.length) {
        // Default to the first category for a new product
        setForm((f) => ({ ...f, category_id: cats[0].id }))
      }
    }
    load()
  }, [isEditing, product?.id])

  const setField = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }))

  // Auto-fill the slug from the name, but only for new products
  // (changing a live product's slug would break existing links)
  const handleNameChange = (value) => {
    setForm((f) => ({
      ...f,
      name: value,
      slug: isEditing ? f.slug : slugify(value),
    }))
  }

  // --- Image handling ---

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file)) // instant local preview
  }

  const uploadImage = async (productId) => {
    if (!imageFile) return null

    setUploadingImage(true)
    const fileExt = imageFile.name.split('.').pop()
    const filePath = `${productId}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile, { upsert: true })

    if (uploadError) {
      setError(`Image upload failed: ${uploadError.message}`)
      setUploadingImage(false)
      return null
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    setUploadingImage(false)
    return data.publicUrl
  }

  // --- Variants ---

  const addVariant = () =>
    setVariants((v) => [
      ...v,
      { _isNew: true, size: '', color: '', sku: '', price: '', stock_quantity: 0 },
    ])

  const updateVariant = (index, field, value) =>
    setVariants((v) =>
      v.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant))
    )

  const removeVariant = async (index) => {
    const variant = variants[index]
    // Existing variants need deleting from the DB; new ones just drop from state
    if (variant.id) {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variant.id)
      if (error) {
        setError(error.message)
        return
      }
    }
    setVariants((v) => v.filter((_, i) => i !== index))
  }

  // --- Submit ---

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    let productId = product?.id

    // Save the product first (without a new image_url) so we have an ID
    // to name the uploaded file after.
    const basePayload = {
      name: form.name,
      description: form.description || null,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      category_id: form.category_id,
      stock_quantity: Number(form.stock_quantity),
      slug: form.slug,
      is_active: form.is_active,
    }

    if (isEditing) {
      const { error } = await supabase
        .from('products')
        .update(basePayload)
        .eq('id', productId)
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert(basePayload)
        .select('id')
        .single()
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
      productId = data.id
    }

    // If a new image was picked, upload it now and save its URL
    if (imageFile) {
      const uploadedUrl = await uploadImage(productId)
      if (!uploadedUrl) {
        setSaving(false)
        return // upload failed, error already set by uploadImage
      }
      const { error: imgError } = await supabase
        .from('products')
        .update({ image_url: uploadedUrl })
        .eq('id', productId)
      if (imgError) {
        setError(imgError.message)
        setSaving(false)
        return
      }
    }

    // Save variants: update existing, insert new
    for (const variant of variants) {
      const variantPayload = {
        product_id: productId,
        size: variant.size || null,
        color: variant.color || null,
        sku: variant.sku || null,
        price: variant.price ? Number(variant.price) : null,
        stock_quantity: Number(variant.stock_quantity) || 0,
      }

      if (variant.id) {
        const { error } = await supabase
          .from('product_variants')
          .update(variantPayload)
          .eq('id', variant.id)
        if (error) {
          setError(`Variant error: ${error.message}`)
          setSaving(false)
          return
        }
      } else {
        const { error } = await supabase
          .from('product_variants')
          .insert(variantPayload)
        if (error) {
          setError(`Variant error: ${error.message}`)
          setSaving(false)
          return
        }
      }
    }

    setSaving(false)
    onDone()
  }

  return (
    <div style={{ paddingRight: '450px', paddingLeft: '450px' }}>
      <nav style={{ display: 'flex', justifyContent: 'center' }}>
        <img src={sinisdeath} alt="Logo" style={{ width: '340px', height: 'auto', textAlign: 'center' }} />
      </nav>
      <h2 style={{ marginBottom: 24, fontSize: '40px' }}>
        {isEditing ? 'Edit product' : 'New product'}
      </h2>

      {error && (
        <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 16 }}>{error}</p>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 640, color: '#fff', paddingBottom: '60px' }}>
        <Field label="Name">
          <input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            style={input}
          />
        </Field>

        <Field label="Slug (URL)">
          <input
            value={form.slug}
            onChange={(e) => setField('slug', e.target.value)}
            required
            style={input}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            rows={4}
            style={{ ...input, resize: 'vertical' }}
          />
        </Field>

        <div style={{ display: 'flex', gap: 12 }}>
          <Field label="Price">
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setField('price', e.target.value)}
              required
              style={input}
            />
          </Field>
          <Field label="Compare at (optional)">
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.compare_at_price}
              onChange={(e) => setField('compare_at_price', e.target.value)}
              style={input}
            />
          </Field>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Field label="Category">
            <select
              value={form.category_id}
              onChange={(e) => setField('category_id', e.target.value)}
              required
              style={input}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Stock (if no variants)">
            <input
              type="number"
              min="0"
              value={form.stock_quantity}
              onChange={(e) => setField('stock_quantity', e.target.value)}
              style={input}
            />
          </Field>
        </div>

        <Field label="Product image">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ ...input, padding: '6px 0' }}
          />
          {(imagePreview || form.image_url) && (
            <img
              src={imagePreview || form.image_url}
              alt="Preview"
              style={{
                width: 120,
                height: 120,
                objectFit: 'cover',
                marginTop: 8,
                borderRadius: 6,
                border: '1px solid #333',
              }}
            />
          )}
          {uploadingImage && (
            <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Uploading...</p>
          )}
        </Field>

        <Field label="">
          <label style={{ fontSize: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setField('is_active', e.target.checked)}
            />
            Visible on the storefront
          </label>
        </Field>

        {/* ---------- Variants ---------- */}
        <div style={{ marginTop: 32, marginBottom: 8 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ fontSize: 15, margin: 0 }}>Variants (size / color)</h3>
            <button type="button" onClick={addVariant} style={smallBtn}>
              + Add variant
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#888', margin: '4px 0 12px' }}>
            Leave empty if this product has no size/color options — it'll use the
            stock number above instead.
          </p>
        </div>

        {variants.map((variant, i) => (
          <div
            key={variant.id ?? `new-${i}`}
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'flex-end',
              marginBottom: 8,
              padding: 12,
              background: '#fafafa',
              borderRadius: 6,
            }}
          >
            <MiniField label="Size">
              <input
                value={variant.size ?? ''}
                onChange={(e) => updateVariant(i, 'size', e.target.value)}
                placeholder="M"
                style={miniInput}
              />
            </MiniField>
            <MiniField label="Color">
              <input
                value={variant.color ?? ''}
                onChange={(e) => updateVariant(i, 'color', e.target.value)}
                placeholder="Black"
                style={miniInput}
              />
            </MiniField>
            <MiniField label="SKU">
              <input
                value={variant.sku ?? ''}
                onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                placeholder="TSHIRT-M-BLK"
                style={miniInput}
              />
            </MiniField>
            <MiniField label="Price override">
              <input
                type="number"
                step="0.01"
                value={variant.price ?? ''}
                onChange={(e) => updateVariant(i, 'price', e.target.value)}
                placeholder="—"
                style={miniInput}
              />
            </MiniField>
            <MiniField label="Stock">
              <input
                type="number"
                min="0"
                value={variant.stock_quantity ?? 0}
                onChange={(e) => updateVariant(i, 'stock_quantity', e.target.value)}
                style={{ ...miniInput, width: 70 }}
              />
            </MiniField>
            <button
              type="button"
              onClick={() => removeVariant(i)}
              style={{ ...smallBtn, color: '#c0392b', borderColor: '#e0b4ad' }}
            >
              Remove
            </button>
          </div>
        ))}

        {/* ---------- Actions ---------- */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '10px 18px',
              fontSize: 14,
              cursor: 'pointer',
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
            }}
          >
            {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Create product'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 18px',
              fontSize: 14,
              cursor: 'pointer',
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: 6,
              color: '#fff',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16, flex: 1 }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 13,
            color: '#fff',
            marginBottom: 4,
          }}
        >
          {label}
        </label>
      )}
      {children}
    </div>
  )
}

function MiniField({ label, children }) {
  return (
    <div>
      <label
        style={{ display: 'block', fontSize: 11, color: '#888', marginBottom: 2 }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

const input = {
  width: '100%',
  padding: '8px 10px',
  fontSize: 14,
  border: '1px solid #fff',
  borderRadius: 4,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  color: '#ffff',
}

const miniInput = {
  width: 100,
  padding: '6px 8px',
  fontSize: 13,
  border: '1px solid #fff',
  borderRadius: 4,
  boxSizing: 'border-box',
  color: '#ffff',
}

const smallBtn = {
  padding: '6px 10px',
  fontSize: 12,
  cursor: 'pointer',
  background: 'none',
  border: '1px solid #fff',
  borderRadius: 4,
  color: '#fff',
}