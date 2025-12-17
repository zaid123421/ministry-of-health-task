import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar, FaChevronLeft, FaShieldAlt, FaBoxOpen, FaTruck, FaUndo } from "react-icons/fa";

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(`https://dummyjson.com/products/${id}`);
      return res.data;
    },
  });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => {
      const index = i + 1;
      if (index <= rating) return <FaStar key={i} className="text-yellow-400 text-xs md:text-sm" />;
      if (index - 0.5 <= rating) return <FaStarHalfAlt key={i} className="text-yellow-400 text-xs md:text-sm" />;
      return <FaRegStar key={i} className="text-gray-300 text-xs md:text-sm" />;
    });
  };

  if (isLoading) return <div className="p-20 text-center font-bold text-[#6339F9] animate-pulse">Fetching details...</div>;
  if (error || !product) return <div className="p-20 text-center text-red-500">Error loading product.</div>;

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <main className="p-4 md:p-6 lg:p-10 max-w-7xl mx-auto">
        
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs md:text-sm font-bold text-gray-700 mb-6 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
        >
          <FaChevronLeft size={10} /> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Gallery Section */}
            <div className="bg-white p-4 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="w-full max-w-[450px] aspect-square flex items-center justify-center mb-6">
                <img 
                  src={product.images[0] || product.thumbnail} 
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto w-full justify-center pb-2">
                {product.images.map((img, i) => (
                  <div key={i} className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 p-1 cursor-pointer transition-all ${i === 0 ? 'border-[#6339F9]' : 'border-gray-50'}`}>
                    <img src={img} className="w-full h-full object-cover rounded-lg" alt="" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Core Info */}
            <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-50 text-[#6339F9] text-[10px] font-bold uppercase px-2 py-0.5 rounded">Brand: {product.brand}</span>
                    <span className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase px-2 py-0.5 rounded">SKU: {product.sku}</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-[#05070A] leading-tight">{product.title}</h1>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {product.availabilityStatus}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1 font-bold">Stock: {product.stock}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-black text-[#6339F9]">${product.price}</span>
                {product.discountPercentage > 0 && (
                  <span className="text-sm font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">-{product.discountPercentage}% OFF</span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 border-y border-gray-50 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">{renderStars(product.rating)}</div>
                  <span className="text-sm font-black text-gray-700">{product.rating}</span>
                </div>
                <div className="hidden sm:block text-gray-200">|</div>
                <span className="text-sm font-medium text-gray-400">Category: <b className="text-gray-600 capitalize">{product.category}</b></span>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm md:text-base">Description</h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">{product.description}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-8">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            </div>

            {/* Dynamic Reviews Section */}
            <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-8 flex items-center justify-between">
                Customer Reviews 
                <span className="bg-gray-100 text-gray-600 text-[11px] px-3 py-1 rounded-full">{product.reviews.length} total</span>
              </h3>
              <div className="space-y-8">
                {product.reviews.map((rev, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-4 border-b border-gray-50 pb-8 last:border-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6339F9] to-purple-400 flex-shrink-0 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-purple-100">
                      {rev.reviewerName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-gray-900">{rev.reviewerName}</h4>
                        <span className="text-[10px] text-gray-400 font-medium">{new Date(rev.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex mb-3">{renderStars(rev.rating)}</div>
                      <p className="text-gray-500 text-sm italic leading-relaxed">"{rev.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Technical Specs */}
            <div className="bg-white text-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200">
              <h3 className="font-bold text-sm mb-6 flex items-center gap-2 text-black">
                <FaBoxOpen className="text-purple-400" /> Specifications
              </h3>
              <div className="space-y-5">
                {[
                  { label: "Weight", value: `${product.weight}g` },
                  { label: "Width", value: `${product.dimensions.width} cm` },
                  { label: "Height", value: `${product.dimensions.height} cm` },
                  { label: "Depth", value: `${product.dimensions.depth} cm` },
                  { label: "Min. Order", value: `${product.minimumOrderQuantity} units` }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs border-b border-white/10 pb-3 last:border-0">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-bold text-black">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-sm mb-8 text-gray-900 flex items-center gap-2">
                <FaShieldAlt className="text-[#6339F9]" /> Service Policies
              </h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600 h-fit"><FaShieldAlt size={18} /></div>
                  <div>
                    <h4 className="font-bold text-gray-700 text-xs mb-1">Warranty</h4>
                    <p className="text-gray-400 text-[11px] leading-snug">{product.warrantyInformation}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 bg-orange-50 rounded-xl text-orange-600 h-fit"><FaTruck size={18} /></div>
                  <div>
                    <h4 className="font-bold text-gray-700 text-xs mb-1">Shipping</h4>
                    <p className="text-gray-400 text-[11px] leading-snug">{product.shippingInformation}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 bg-red-50 rounded-xl text-red-600 h-fit"><FaUndo size={18} /></div>
                  <div>
                    <h4 className="font-bold text-gray-700 text-xs mb-1">Return Policy</h4>
                    <p className="text-gray-400 text-[11px] leading-snug">{product.returnPolicy}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Meta */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-4 text-center">Scan to Verify Product</p>
              <img src={product.meta.qrCode} className="w-24 h-24 border border-gray-50 p-2 rounded-xl mb-2" alt="QR Code" />
              <p className="text-[9px] text-gray-400 font-mono">{product.meta.barcode}</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}