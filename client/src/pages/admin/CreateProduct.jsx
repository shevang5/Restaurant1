import { nanoid } from 'nanoid'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { asyncCreateProduct } from '../../store/action/productActions'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Upload,
  DollarSign,
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
  } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [previewImage, setPreviewImage] = useState(null)

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

      // Fix: extract the actual file from the FileList
      if (product.image && product.image.length > 0) {
        product.image = product.image[0];
      }

      await dispatch(asyncCreateProduct(product));
      toast.success('Product created successfully!')
      reset();
      setPreviewImage(null)
      // Optional: navigate back after success or stay to create more
    } catch (error) {
      toast.error("Failed to create product")
      console.error(error)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link to="/admin/products" className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm mb-2 font-medium w-fit">
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
                        <option value="breads">Breads</option>
                        <option value="pastries">Pastries</option>
                        <option value="cakes-cupcakes">Cakes & Cupcakes</option>
                        <option value="cookies">Cookies</option>
                        <option value="pies-tarts">Pies & Tarts</option>
                        <option value="donuts">Donuts & Fried Treats</option>
                        <option value="breakfast-savory">Breakfast & Savory Items</option>
                        <option value="drinks">Drinks</option>
                        <option value="seasonal-specialty">Seasonal & Specialty Items</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
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

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <AlignLeft className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 border focus:bg-white focus:border-red-500 focus:ring-red-500 transition-all py-2.5"
                      placeholder="Describe the product..."
                      rows={4}
                    />
                  </div>
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-red-400 hover:bg-red-50 transition-colors cursor-pointer relative">
                    <div className="space-y-1 text-center">
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        {previewImage ? (
                          <img src={previewImage} alt="Preview" className="h-full w-full object-cover rounded-md" />
                        ) : (
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500">
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            {...register('image', {
                              required: 'Image is required',
                              onChange: handleImageChange
                            })}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
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
                      ${Number(watchedValues.price || 0).toFixed(2)}
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
