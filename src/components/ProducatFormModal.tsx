import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { z } from "zod";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import succes from "../assets/success.gif";
import error from "../assets/error.gif"

const productSchema = z.object({
  title: z.string().min(1, "Product Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number("Price is required").min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  thumbnail: z.string().url("Invalid Image URL").min(1, "Image URL is required"),

  brand: z.string().optional(),
  availabilityStatus: z.string().optional(),
  stock: z.number().optional(),
  rating: z.number().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;
interface Product extends ProductFormData { id: number; }

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Product | null;
}

export default function ProductFormModal({ isOpen, onClose, initialData }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!initialData;

  const [isStatusModelOpen, setIsStatusModelOpen] = useState(false);
  const [statusConfig, setStatusConfig] = useState({ message: "", image: "" });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "", brand: "", description: "", category: "beauty", 
      availabilityStatus: "In Stock", price: 0, stock: 0, rating: 0, thumbnail: ""
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset(initialData || {
        title: "", brand: "", description: "", category: "beauty", 
        availabilityStatus: "In Stock", price: 0, stock: 0, rating: 0, thumbnail: ""
      });
    }
  }, [initialData, isOpen, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const url = isEdit ? `https://dummyjson.com/products/${initialData?.id}` : `https://dummyjson.com/products/add`;
      const res = await axios({ method: isEdit ? 'PUT' : 'POST', url, data });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setStatusConfig({
        message: isEdit ? "Product updated successfully!" : "Product added successfully!",
        image: succes
      });
      setIsStatusModelOpen(true);
      setTimeout(() => {
        setIsStatusModelOpen(false);
        onClose();
      }, 2000);
    },
    onError: () => {
      setStatusConfig({
        message: "Failed to save product. Please try again.",
        image: error // غيرها لمسار صورة الخطأ عندك
      });
      setIsStatusModelOpen(true);
      setTimeout(() => setIsStatusModelOpen(false), 2500);
    }
  });

  if (!isOpen) return null;

  return (
    <>
      {isStatusModelOpen && (
        <Modal
          message={statusConfig.message} 
          imageSrc={statusConfig.image} 
        />
      )}

      <div className="fixed inset-0 z-[30] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-2 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative animate-in zoom-in duration-200 border border-gray-100 my-auto max-h-[95vh] overflow-y-auto">
          
          <button onClick={onClose} type="button" className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors z-10">
            <IoMdClose size={22}/>
          </button>

          <div className="p-5 md:p-8 pb-3">
            <h2 className="text-lg md:text-xl font-bold text-[#111827]">{isEdit ? "Edit Product" : "Add Product"}</h2>
          </div>

          <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="p-5 md:p-8 pt-2 space-y-4 md:space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#111827]">Product Title *</label>
                <input {...register("title")} className={`h-11 px-4 border rounded-xl outline-none transition-all ${errors.title ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.title && <span className="text-[11px] text-red-500 font-medium">{errors.title.message}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#111827]">Brand</label>
                <input {...register("brand")} className="h-11 px-4 border border-gray-200 rounded-xl outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[#111827]">Description *</label>
              <textarea {...register("description")} rows={3} className={`p-4 border rounded-xl outline-none resize-none ${errors.description ? 'border-red-500' : 'border-gray-200'}`} />
              {errors.description && <span className="text-[11px] text-red-500">{errors.description.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#111827]">Category *</label>
                <select {...register("category")} className="h-11 px-3 border border-gray-200 rounded-xl bg-white outline-none">
                  <option value="beauty">Beauty</option>
                  <option value="fragrances">Fragrances</option>
                  <option value="furniture">Furniture</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#111827]">Availability Status</label>
                <select {...register("availabilityStatus")} className="h-11 px-3 border border-gray-200 rounded-xl bg-white outline-none">
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#111827]">Price ($) *</label>
                <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className={`h-11 px-4 border rounded-xl outline-none ${errors.price ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.price && <span className="text-[11px] text-red-500">{errors.price.message}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#111827]">Stock</label>
                <input type="number" {...register("stock", { valueAsNumber: true })} className="h-11 px-4 border border-gray-200 rounded-xl outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#111827]">Rating</label>
                <input type="number" step="0.1" {...register("rating", { valueAsNumber: true })} className="h-11 px-4 border border-gray-200 rounded-xl outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[#111827]">Product Image URL *</label>
              <input {...register("thumbnail")} className={`h-11 px-4 border rounded-xl outline-none ${errors.thumbnail ? 'border-red-500' : 'border-gray-200'}`} />
              {errors.thumbnail && <span className="text-[11px] text-red-500">{errors.thumbnail.message}</span>}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-2.5 text-[#111827] font-semibold hover:bg-gray-100 rounded-xl transition-all border border-gray-100">
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={mutation.isPending}
                className="w-full sm:w-auto px-8 py-2.5 bg-[#6339F9] text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md disabled:bg-gray-400"
              >
                {mutation.isPending ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}