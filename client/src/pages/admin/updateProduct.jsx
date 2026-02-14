import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, DollarSign, FileText, Image as ImageIcon, Save, Tag } from "lucide-react";
import { asyncLoadProducts, asyncUpdateProduct } from "../../store/action/productActions";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageType, setImageType] = useState("file");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      productCode: "",
      price: "",
      category: "",
      description: "",
      hasPortionOptions: false,
      halfPlatePrice: "",
      imageUrl: "",
    },
  });

  const products = useSelector((state) => state.productsReducers.products) || [];

  const product = useMemo(
    () => products.find((p) => String(p._id || p.id) === String(id)),
    [products, id],
  );

  useEffect(() => {
    if (!products.length) {
      dispatch(asyncLoadProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (!product) return;
    reset({
      name: product.name || "",
      productCode: product.productCode || "",
      price: product.price || "",
      category: product.category || "",
      description: product.description || "",
      hasPortionOptions: !!product.hasPortionOptions,
      halfPlatePrice: product.halfPlatePrice || "",
      imageUrl: "",
    });
  }, [product, reset]);

  const onSubmit = async (data) => {
    if (!product) return;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("productCode", data.productCode || "");
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("hasPortionOptions", String(!!data.hasPortionOptions));

    if (data.hasPortionOptions && data.halfPlatePrice !== "") {
      formData.append("halfPlatePrice", data.halfPlatePrice);
    }

    if (imageType === "file" && data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    if (imageType === "url" && data.imageUrl) {
      formData.append("imageUrl", data.imageUrl);
    }

    await dispatch(asyncUpdateProduct(product._id || product.id, formData));
    navigate(`/products/${product._id || product.id}`);
  };

  if (!product && products.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link to={`/products/${id}`} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Product
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Update Product</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    {...register("productCode")}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    placeholder="e.g. PRD-101"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    {...register("price", { required: "Price is required" })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  {...register("category", { required: "Category is required" })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>

              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input type="checkbox" {...register("hasPortionOptions")} className="w-4 h-4" />
                  Enable Half/Full Plate Options
                </label>
              </div>
            </div>

            {watch("hasPortionOptions") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Half Plate Price</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("halfPlatePrice", {
                    required: "Half plate price is required",
                  })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
                {errors.halfPlatePrice && <p className="text-red-500 text-xs mt-1">{errors.halfPlatePrice.message}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows="4"
                {...register("description", { required: "Description is required" })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Image</label>

              <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-3 w-fit">
                <button
                  type="button"
                  onClick={() => setImageType("file")}
                  className={`px-4 py-2 text-sm font-medium ${imageType === "file" ? "bg-red-600 text-white" : "bg-white text-gray-600"}`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageType("url")}
                  className={`px-4 py-2 text-sm font-medium ${imageType === "url" ? "bg-red-600 text-white" : "bg-white text-gray-600"}`}
                >
                  Image URL
                </button>
              </div>

              {imageType === "file" && (
                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              )}

              {imageType === "url" && (
                <div>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      {...register("imageUrl", {
                        pattern: {
                          value: /^https?:\/\/.+/i,
                          message: "Please enter a valid URL",
                        },
                      })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>
                  {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
