// src/admin/pages/ProductForm.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import sinisdeath from '../../assets/sinisdeath_logo_dark.svg'

// Turns "Classic T-Shirt" into "classic-t-shirt"
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

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

  const previewSrc = imagePreview || form.image_url

  return (
    <div className="pf-root">
      <style>{styles}</style>

      <header className="pf-wrap pf-topbar">
        <img src={sinisdeath} alt="Sinisdeath" className="pf-logo" />
        <button type="button" className="pf-link" onClick={onCancel}>
          Back to products
        </button>
      </header>

      <main className="pf-wrap">
        <div className="pf-titlerow">
          <h1 className="pf-title">{isEditing ? 'Edit product' : 'New product'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="pf-grid">
          {/* ---------- LEFT: fields ---------- */}
          <div className="pf-left">
            <section className="pf-section">
              <h2 className="pf-section-title">Details</h2>
              <div className="pf-fields">
                <Field label="Name">
                  <input
                    className="pf-input"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </Field>

                <Field
                  label="Slug (URL)"
                  hint={
                    isEditing
                      ? 'Changing this will break existing links to this product.'
                      : 'Filled in from the name. It becomes the product’s link.'
                  }
                >
                  <input
                    className="pf-input"
                    value={form.slug}
                    onChange={(e) => setField('slug', e.target.value)}
                    required
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    className="pf-input"
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                    rows={4}
                  />
                </Field>

                <Field label="Category">
                  <select
                    className="pf-input"
                    value={form.category_id}
                    onChange={(e) => setField('category_id', e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </section>

            <section className="pf-section">
              <h2 className="pf-section-title">Pricing and stock</h2>
              <div className="pf-fields">
                <div className="pf-row">
                  <Field label="Price">
                    <span className="pf-money">
                      <span aria-hidden="true">₦</span>
                      <input
                        className="pf-input"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={(e) => setField('price', e.target.value)}
                        required
                      />
                    </span>
                  </Field>
                  <Field label="Compare at (optional)">
                    <span className="pf-money">
                      <span aria-hidden="true">₦</span>
                      <input
                        className="pf-input"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.compare_at_price}
                        onChange={(e) => setField('compare_at_price', e.target.value)}
                      />
                    </span>
                  </Field>
                </div>

                <div className="pf-row">
                  <Field label="Stock (if no variants)">
                    <input
                      className="pf-input"
                      type="number"
                      min="0"
                      value={form.stock_quantity}
                      onChange={(e) => setField('stock_quantity', e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* ---------- Variants ---------- */}
            <section className="pf-section">
              <div className="pf-section-head">
                <h2 className="pf-section-title">Variants (size / color)</h2>
                <button type="button" className="pf-outline" onClick={addVariant}>
                  Add variant
                </button>
              </div>
              <p className="pf-hint pf-hint-block">
                Leave empty if this product has no size/color options. It will use the
                stock number above instead.
              </p>

              {variants.map((variant, i) => (
                <div key={variant.id ?? `new-${i}`} className="pf-variant">
                  <div className="pf-variant-head">
                    <span className="pf-variant-name">Variant {i + 1}</span>
                    <button
                      type="button"
                      className="pf-link is-danger"
                      onClick={() => removeVariant(i)}
                      aria-label={`Remove variant ${i + 1}`}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="pf-variant-grid">
                    <Field label="Size" small>
                      <select
                        className="pf-input is-small"
                        value={variant.size ?? ''}
                        onChange={(e) => updateVariant(i, 'size', e.target.value)}
                      >
                        <option value="">No size</option>
                        {SIZE_OPTIONS.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Color" small>
                      <input
                        className="pf-input is-small"
                        value={variant.color ?? ''}
                        onChange={(e) => updateVariant(i, 'color', e.target.value)}
                        placeholder="Black"
                      />
                    </Field>
                    <Field label="SKU" small>
                      <input
                        className="pf-input is-small"
                        value={variant.sku ?? ''}
                        onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                        placeholder="TSHIRT-M-BLK"
                      />
                    </Field>
                    <Field label="Price override" small>
                      <input
                        className="pf-input is-small"
                        type="number"
                        step="0.01"
                        value={variant.price ?? ''}
                        onChange={(e) => updateVariant(i, 'price', e.target.value)}
                        placeholder="—"
                      />
                    </Field>
                    <Field label="Stock" small>
                      <input
                        className="pf-input is-small"
                        type="number"
                        min="0"
                        value={variant.stock_quantity ?? 0}
                        onChange={(e) => updateVariant(i, 'stock_quantity', e.target.value)}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </section>
          </div>

          {/* ---------- RIGHT: image, visibility, actions ---------- */}
          <aside className="pf-side">
            <h2 className="pf-section-title pf-side-title">Product image</h2>

            <div className="pf-image-row">
              <div className="pf-image">
                {previewSrc ? (
                  <img src={previewSrc} alt="Product preview" />
                ) : (
                  <span className="pf-image-empty">
                    <IconImage />
                    <small>No image</small>
                  </span>
                )}
              </div>

              <div className="pf-image-controls">
                <label className="pf-upload">
                  <input
                    className="pf-file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <span>{previewSrc ? 'Replace image' : 'Choose image'}</span>
                </label>
                {imageFile && <p className="pf-hint pf-filename">{imageFile.name}</p>}
                {uploadingImage && <p className="pf-hint">Uploading…</p>}
              </div>
            </div>

            <div className="pf-visibility">
              <label className="pf-check">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setField('is_active', e.target.checked)}
                />
                <span>Visible on the storefront</span>
              </label>
            </div>

            {error && (
              <div className="pf-error" role="alert">
                <span>{error}</span>
                <button type="button" onClick={() => setError(null)}>
                  Dismiss
                </button>
              </div>
            )}

            <button type="submit" className="pf-cta" disabled={saving || uploadingImage}>
              {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create product'}
            </button>
            <button type="button" className="pf-link pf-cancel" onClick={onCancel}>
              Cancel
            </button>
          </aside>
        </form>
      </main>
    </div>
  )
}

function Field({ label, hint, small = false, children }) {
  return (
    <label className={`pf-field ${small ? 'is-small' : ''}`}>
      <span className="pf-label">{label}</span>
      {children}
      {hint && <span className="pf-hint">{hint}</span>}
    </label>
  )
}

function IconImage() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m21 16-5-5-8 9" />
    </svg>
  )
}

/* ---------- Styles ---------- */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

/* Neutralise global element styles leaking in from index.css / App.css */
:where(.pf-root) :is(main, header, section, aside, form, div, h1, h2, p, span, small, label, input, select, textarea, button) {
  all: revert;
}

.pf-root {
  --ink: #000;
  --muted: #767676;
  --line: #e5e5e5;
  --alert: #D4321F;
  --gutter: clamp(20px, 6vw, 93px);
  min-height: 100vh;
  background: #fff;
  color: var(--ink);
  font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 400;
  padding-bottom: 96px;
}
.pf-root *, .pf-root *::before, .pf-root *::after { box-sizing: border-box; }
.pf-root p, .pf-root h1, .pf-root h2 { margin: 0; padding: 0; }

.pf-wrap { max-width: 1440px; margin: 0 auto; padding-left: var(--gutter); padding-right: var(--gutter); }

/* Top bar + title */
.pf-topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 28px; padding-bottom: 28px; }
.pf-logo { width: 170px; max-width: 55%; height: auto; }
.pf-titlerow { margin: 40px 0 56px; }
.pf-title {
  font-size: 28px; font-weight: 300; letter-spacing: 0.14em; text-transform: uppercase;
  line-height: 1.1; color: var(--ink);
}

/* Layout */
.pf-grid { display: grid; grid-template-columns: minmax(0, 1fr) 416px; gap: clamp(32px, 6vw, 90px); align-items: start; }

/* Sections */
.pf-section { border-top: 1px solid var(--line); padding: 28px 0 44px; }
.pf-section-title { font-size: 11px; font-weight: 400; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink); }
.pf-section > .pf-section-title { margin-bottom: 28px; }
.pf-section-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 10px; }
.pf-section-head .pf-section-title { margin: 0; }
.pf-fields { display: grid; gap: 28px; }
.pf-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }

/* Fields */
.pf-field { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.pf-label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
.pf-hint { font-size: 12px; color: var(--muted); line-height: 1.6; }
.pf-hint-block { margin-bottom: 28px; }

.pf-input {
  width: 100%; height: 48px; padding: 0 14px;
  border: 1px solid var(--line); border-radius: 0; background: #fff; color: var(--ink);
  font: inherit; font-size: 14px; transition: border-color 0.15s;
}
.pf-input.is-small { height: 44px; font-size: 13px; padding: 0 12px; }
textarea.pf-input { height: auto; min-height: 120px; padding: 12px 14px; line-height: 1.6; resize: vertical; }
.pf-input::placeholder { color: #b5b5b5; }
.pf-input:hover { border-color: #bdbdbd; }
.pf-input:focus { outline: none; border-color: var(--ink); box-shadow: 0 0 0 1px var(--ink); }
select.pf-input {
  appearance: none; -webkit-appearance: none; padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center; cursor: pointer;
}
input[type='number'].pf-input { font-variant-numeric: tabular-nums; }

.pf-money { position: relative; display: block; }
.pf-money > span { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 14px; pointer-events: none; }
.pf-money .pf-input { padding-left: 34px; }

/* Variants */
.pf-variant { border-top: 1px solid var(--line); padding: 24px 0 28px; }
.pf-variant:last-child { border-bottom: 1px solid var(--line); }
.pf-variant-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.pf-variant-name { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; }
.pf-variant-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 16px; }

/* Buttons and links */
.pf-link {
  background: none; border: 0; padding: 0; cursor: pointer;
  font: inherit; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink); text-decoration: underline; text-underline-offset: 3px;
}
.pf-link:hover { text-decoration-thickness: 2px; }
.pf-link.is-danger { color: var(--muted); }
.pf-link.is-danger:hover { color: var(--alert); }

.pf-outline {
  height: 40px; padding: 0 20px; background: #fff; color: var(--ink); cursor: pointer;
  border: 1px solid var(--ink); border-radius: 0;
  font: inherit; font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
  transition: background 0.15s, color 0.15s;
}
.pf-outline:hover { background: var(--ink); color: #fff; }

.pf-cta {
  display: flex; align-items: center; justify-content: center; width: 100%; height: 63px;
  background: var(--ink); color: #fff; border: 0; border-radius: 0; cursor: pointer;
  font: inherit; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
  transition: opacity 0.15s;
}
.pf-cta:hover:not(:disabled) { opacity: 0.85; }
.pf-cta:disabled { opacity: 0.5; cursor: progress; }
.pf-cancel { display: block; margin: 22px auto 0; }

/* Side panel */
.pf-side { position: sticky; top: 24px; }
.pf-side-title { padding-bottom: 22px; border-bottom: 1px solid var(--line); margin-bottom: 24px; }

.pf-image-row { display: flex; align-items: center; gap: 24px; padding-bottom: 28px; }
.pf-image {
  width: 132px; height: 132px; flex: none; background: #fafafa; border: 1px solid var(--line);
  display: grid; place-items: center; overflow: hidden;
}
.pf-image img { width: 100%; height: 100%; object-fit: contain; display: block; }
.pf-image-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--muted); }
.pf-image-empty small { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; }
.pf-image-controls { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; min-width: 0; }
.pf-filename { word-break: break-all; }

.pf-upload {
  display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 0 20px;
  border: 1px solid var(--ink); cursor: pointer; position: relative;
  font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
  transition: background 0.15s, color 0.15s;
}
.pf-upload:hover { background: var(--ink); color: #fff; }
.pf-upload:focus-within { outline: 1px solid var(--ink); outline-offset: 4px; }
.pf-file { position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden; }

.pf-visibility { border-top: 1px solid var(--line); border-bottom: 1px solid var(--ink); padding: 22px 0; margin-bottom: 28px; }
.pf-check { display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 13px; }
.pf-check input { width: 18px; height: 18px; margin: 0; accent-color: #000; cursor: pointer; }

/* Error */
.pf-error {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  border: 1px solid var(--alert); padding: 14px 16px; margin-bottom: 20px; font-size: 13px; line-height: 1.5;
}
.pf-error button {
  font: inherit; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
  cursor: pointer; flex: none; background: none; color: var(--ink); border: 0; padding: 0;
  text-decoration: underline; text-underline-offset: 3px;
}

/* Keyboard focus */
.pf-link:focus-visible, .pf-outline:focus-visible, .pf-cta:focus-visible, .pf-error button:focus-visible, .pf-check input:focus-visible {
  outline: 1px solid var(--ink); outline-offset: 4px;
}

@media (max-width: 1200px) {
  .pf-variant-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 900px) {
  .pf-grid { grid-template-columns: 1fr; }
  .pf-side { position: static; }
  .pf-titlerow { margin: 24px 0 36px; }
  .pf-title { font-size: 24px; }
}

@media (max-width: 600px) {
  .pf-row { grid-template-columns: 1fr; }
  .pf-variant-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pf-image-row { flex-direction: column; align-items: flex-start; }
  .pf-section-head { flex-wrap: wrap; }
}

@media (prefers-reduced-motion: reduce) {
  .pf-input, .pf-outline, .pf-cta, .pf-upload { transition: none; }
}
`