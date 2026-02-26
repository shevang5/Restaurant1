import { nanoid } from 'nanoid'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { asyncCreateProduct } from '../../store/action/productActions'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Upload,
  Tag,
  Type,
  AlignLeft,
  Image as ImageIcon,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      foodType: "veg",
    },
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [previewImage, setPreviewImage] = useState(null)
  const [imageType, setImageType] = useState('file') // 'file' or 'url'

  // Watch form values for live preview
  const watchedValues = watch()

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (product) => {
  try {
    product.id = nanoid();

    if (imageType === 'file') {
      if (product.image && product.image.length > 0) {
        product.image = product.image[0];
      }
      delete product.imageUrl;
    } else {
      delete product.image;
    }

    // Convert checkbox to boolean
    product.hasPortionOptions = !!product.hasPortionOptions;
    product.foodType = product.foodType || "veg";
    
    // Only include halfPlatePrice if portion options are enabled
    if (!product.hasPortionOptions) {
      delete product.halfPlatePrice;
    }

    await dispatch(asyncCreateProduct(product));
    toast.success('Product created successfully!');
    reset();
    setPreviewImage(null);
  } catch (error) {
    toast.error("Failed to create product");
    console.error(error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link to="/products" className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm mb-2 font-medium w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-500 mt-1">Create a new item for your bakery menu.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">

              {/* Basic Info Section */}
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Product Details</h2>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Type className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register('name', { required: 'Product name is required' })}
                      className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 border focus:bg-white focus:border-red-500 focus:ring-red-500 transition-all py-2.5"
                      placeholder="e.g. Strawberry Cheesecake"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        {...register('category', { required: 'Category is required' })}
                        className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 border focus:bg-white focus:border-red-500 focus:ring-red-500 transition-all py-2.5 appearance-none"
                      >
                        <option value="">Select Category</option>
                        <option value="seasonal-specialty">seasonal-specialty</option>
                        <option value="gravy-veg">gravy-veg</option>
                        <option value="starter-chinese-veg">starter-chinese-veg</option>
                        <option value="dry-veg">dry-veg</option>
                        <option value="gravy-nonveg">gravy-nonveg</option>
                        <option value="starter-chinese-nonveg">starter-chinese-nonveg</option>
                        <option value="dry-nonveg">dry-nonveg</option>
                      </select>
                    </div>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="h-5 w-5 text-gray-400 font-semibold">₹</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        {...register('price', {
                          required: 'Price is required',
                          valueAsNumber: true,
                          min: { value: 0.01, message: 'Price must be positive' },
                        })}
                        className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 border focus:bg-white focus:border-red-500 focus:ring-red-500 transition-all py-2.5"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Food Type</label>
                  <div className="flex gap-6">
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="radio"
                        value="veg"
                        {...register("foodType", { required: "Food type is required" })}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      Veg
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="radio"
                        value="nonveg"
                        {...register("foodType", { required: "Food type is required" })}
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      Nonveg
                    </label>
                  </div>
                  {errors.foodType && <p className="text-red-500 text-xs mt-1">{errors.foodType.message}</p>}
                </div>

                {/* After the Price field, add this new section: */}

{/* Portion Options */}
<div className="col-span-2">
  <div className="flex items-center gap-2 mb-2">
    <input
      type="checkbox"
      id="hasPortionOptions"
      {...register('hasPortionOptions')}
      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
    />
    <label htmlFor="hasPortionOptions" className="text-sm font-medium text-gray-700">
      Enable Half/Full Plate Options
    </label>
  </div>
  <p className="text-xs text-gray-500 mb-3">Allow customers to choose between half and full portions</p>

  {/* Half Plate Price - only show if checkbox is checked */}
  {watch('hasPortionOptions') && (
    <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <label className="block text-sm font-medium text-gray-700 mb-1">Half Plate Price</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="h-5 w-5 text-gray-400 font-semibold">₹</span>
        </div>
        <input
          type="number"
          step="0.01"
          {...register('halfPlatePrice', {
            required: watch('hasPortionOptions') ? 'Half plate price is required when portion options are enabled' : false,
            valueAsNumber: true,
            validate: (value) => {
              if (!watch('hasPortionOptions')) return true;
              const fullPrice = watch('price');
              if (value >= fullPrice) {
                return 'Half plate price must be less than full plate price';
              }
              return true;
            }
          })}
          className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 border focus:bg-white focus:border-red-500 focus:ring-red-500 transition-all py-2.5"
          placeholder="0.00"
        />
      </div>
      {errors.halfPlatePrice && (
        <p className="text-red-500 text-xs mt-1">{errors.halfPlatePrice.message}</p>
      )}
    </div>
  )}
</div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <AlignLeft className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      {...register('description')}
                      className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 border focus:bg-white focus:border-red-500 focus:ring-red-500 transition-all py-2.5"
                      placeholder="Describe the product..."
                      rows={4}
                    />
                  </div>
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                {/* Image Upload */}
                {/* Image Upload */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>

  {/* Toggle Tabs */}
  <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-3 w-fit">
    <button
      type="button"
      onClick={() => { setImageType('file'); setPreviewImage(null); reset({ ...watchedValues, imageUrl: '' }); }}
      className={`px-4 py-2 text-sm font-medium transition-colors ${imageType === 'file' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
    >
      Upload File
    </button>
    <button
      type="button"
      onClick={() => { setImageType('url'); setPreviewImage(null); }}
      className={`px-4 py-2 text-sm font-medium transition-colors ${imageType === 'url' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
    >
      Image URL
    </button>
  </div>

  {/* File Upload */}
  {imageType === 'file' && (
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-red-400 hover:bg-red-50 transition-colors cursor-pointer">
      <div className="space-y-1 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400">
          {previewImage
            ? <img src={previewImage} alt="Preview" className="h-full w-full object-cover rounded-md" />
            : <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          }
        </div>
        <div className="flex text-sm text-gray-600 justify-center">
          <label htmlFor="file-upload" className="cursor-pointer font-medium text-red-600 hover:text-red-500">
            <span>Upload a file</span>
            <input
              id="file-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              {...register('image', {
                required: imageType === 'file' ? 'Image is required' : false,
                onChange: handleImageChange
              })}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  )}

  {/* URL Input */}
  {imageType === 'url' && (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ImageIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="url"
          {...register('imageUrl', {
            required: imageType === 'url' ? 'Image URL is required' : false,
            pattern: {
  value: /^https?:\/\/.+/i,
  message: 'Please enter a valid URL (must start with http or https)'
},
            onChange: (e) => setPreviewImage(e.target.value)
          })}
          className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 border focus:bg-white focus:border-red-500 focus:ring-red-500 transition-all py-2.5"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
    </div>
  )}

  {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
</div>


                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" /> Creating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Create Product
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Live Preview</h3>

              {/* Preview Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 max-w-sm mx-auto transform transition-all hover:scale-[1.02] duration-300">
                <div className="h-56 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <span className="text-sm">No Image</span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                    {watchedValues.category || "Category"}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                      {watchedValues.name || "Product Name"}
                    </h3>
                    <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded-lg">
                      ₹{Number(watchedValues.price || 0).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-3 mb-4 min-h-[3rem]">
                    {watchedValues.description || "Product description will appear here..."}
                  </p>

                  <button className="w-full bg-black text-white py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors pointer-events-none opacity-50">
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-0.5">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Tip</h4>
                  <p className="text-blue-700 text-xs mt-1">
                    High-quality images make your bakery items look more delicious! Use clear, well-lit photos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-right" autoClose={2000} />
      </div>
    </div>
  )
}

export default CreateProduct
