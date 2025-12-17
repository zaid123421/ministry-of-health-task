import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { z } from "zod";
import { useEffect } from "react";

const productSchema = z.object({
  title: z.string().min(1, "Product Title is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(10, "Description is too short"),
  category: z.string().min(1, "Category is required"),
  availabilityStatus: z.string().min(1, "Availability Status is required"),
  price: z.number("Required" ).min(0.01),
  stock: z.number("Required" ).min(0),
  rating: z.number("Required" ).min(0).max(5),
  thumbnail: z.string().url("Invalid Image URL"),
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

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    values: initialData || {
      title: "", brand: "", description: "", category: "Beauty", 
      availabilityStatus: "Low Stock", price: 0, stock: 0, rating: 0, thumbnail: ""
    }
  });

  useEffect(() => {
    if (isOpen) reset(initialData || {
      title: "", brand: "", description: "", category: "Beauty", 
      availabilityStatus: "Low Stock", price: 0, stock: 0, rating: 0, thumbnail: ""
    });
  }, [initialData, isOpen, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const url = isEdit ? `https://dummyjson.com/products/${initialData?.id}` : `https://dummyjson.com/products/add`;
      const res = await axios({ method: isEdit ? 'PUT' : 'POST', url, data });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-2 sm:p-4 overflow-y-auto">
      
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative animate-in zoom-in duration-200 border border-gray-100 my-auto max-h-[95vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors z-10">
          <IoMdClose size={22}/>
        </button>

        <div className="p-5 md:p-8 pb-3">
          <h2 className="text-lg md:text-xl font-bold text-[#111827]">{isEdit ? "Edit Product" : "Add Product"}</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Update the product information below.</p>
        </div>

        <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="p-5 md:p-8 pt-2 space-y-4 md:space-y-5">
          
          {/* العنوان والبراند: يتحول لعمود واحد في الموبايل */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[#111827]">Product Title *</label>
              <input {...register("title")} placeholder="Product Title" className={`h-11 px-4 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-purple-100 transition-all ${errors.title ? 'border-red-500' : 'border-gray-200'}`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[#111827]">Brand *</label>
              <input {...register("brand")} placeholder="Brand" className="h-11 px-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#111827]">Description *</label>
            <textarea {...register("description")} rows={3} className="p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100 resize-none h-[80px] md:h-[100px]" />
          </div>

          {/* التصنيف والحالة: يتحول لعمود واحد في الموبايل */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#111827]">Category *</label>
                <select {...register("category")} className="h-11 px-3 border border-gray-200 rounded-xl bg-white outline-none appearance-none cursor-pointer">
                    <option value="beauty">Beauty</option>
                    <option value="fragrances">Fragrances</option>
                    <option value="furniture">Furniture</option>
                </select>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#111827]">Availability Status</label>
                <select {...register("availabilityStatus")} className="h-11 px-3 border border-gray-200 rounded-xl bg-white outline-none appearance-none cursor-pointer">
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>
            </div>
          </div>

          {/* السعر والمخزون والتقييم: عمود واحد في الموبايل، 3 في الشاشات الكبيرة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#111827]">Price ($) *</label>
                <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className="h-11 px-4 border border-gray-200 rounded-xl outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#111827]">Stock Quantity *</label>
                <input type="number" {...register("stock", { valueAsNumber: true })} className="h-11 px-4 border border-gray-200 rounded-xl outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#111827]">Rating (0-5)</label>
                <input type="number" step="0.01" {...register("rating", { valueAsNumber: true })} className="h-11 px-4 border border-gray-200 rounded-xl outline-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#111827]">Product Image URL</label>
            <input {...register("thumbnail")} placeholder="https://example.com/image.jpg" className="h-11 px-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100" />
          </div>

          {/* الأزرار: عرض كامل في الموبايل */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full sm:w-auto px-6 py-2.5 text-[#111827] font-semibold hover:bg-gray-100 rounded-xl transition-all border border-gray-100"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full sm:w-auto px-8 py-2.5 bg-[#6339F9] text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}