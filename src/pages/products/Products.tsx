import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaSearch, FaEye, FaEdit, FaTrash, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdOutlineFilterAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ProductFormModal from "../../components/ProducatFormModal";
import Confirm from "../../components/Confirm"; 
import Model from "../../components/Modal";
import ConfirmDelete from "../../assets/deleteConfirm.jpg"
import success from "../../assets/success.gif"
import error from "../../assets/error.gif"

interface Product {
  id: number;
  title: string;
  brand: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  thumbnail: string;
  availabilityStatus: string;
}

interface ProductResponse {
  products: Product[];
  total: number;
}

export default function Products() {
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isStatusModelOpen, setIsStatusModelOpen] = useState(false);
  const [statusConfig, setStatusConfig] = useState({ message: "", image: "" });
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(search);
      setPage(0);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useQuery<ProductResponse>({
    queryKey: ["products", page, searchTerm, limit], 
    queryFn: async () => {
      const url = searchTerm 
        ? `https://dummyjson.com/products/search?q=${searchTerm}&limit=${limit}&skip=${page * limit}`
        : `https://dummyjson.com/products?limit=${limit}&skip=${page * limit}`;
      const res = await axios.get(url);
      return res.data;
    },
  });

  const filteredProducts = data?.products.filter((product) => {
    if (!searchTerm) return true;
    const lowerTerm = searchTerm.toLowerCase();
    return (
      product.title.toLowerCase().includes(lowerTerm) ||
      product.brand?.toLowerCase().includes(lowerTerm) ||
      product.category.toLowerCase().includes(lowerTerm)
    );
  }) || [];

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`https://dummyjson.com/products/${id}`);
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["products", page, searchTerm, limit], (oldData: ProductResponse | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          products: oldData.products.filter(p => p.id !== deletedId),
          total: oldData.total - 1
        };
      });

      setIsConfirmOpen(false);
      setStatusConfig({ message: "Product deleted successfully!", image: success });
      setIsStatusModelOpen(true);
      setTimeout(() => setIsStatusModelOpen(false), 2000);
    },
    onError: () => {
      setIsConfirmOpen(false); 
      setStatusConfig({ message: "Failed to delete the product.", image: error });
      setIsStatusModelOpen(true);
      setTimeout(() => setIsStatusModelOpen(false), 2000);
    }
  });

  const handleDeleteClick = (id: number) => {
    setProductIdToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productIdToDelete) {
      deleteMutation.mutate(productIdToDelete);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-xs" />);
      }
    }
    return stars;
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="p-4"><div className="w-12 h-12 bg-gray-200 rounded-lg"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-3 bg-gray-100 rounded w-1/2"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
      <td className="p-4"><div className="flex gap-1"><div className="w-3 h-3 bg-gray-200 rounded-full"></div><div className="w-3 h-3 bg-gray-200 rounded-full"></div><div className="w-3 h-3 bg-gray-200 rounded-full"></div></div></td>
      <td className="p-4"><div className="h-6 bg-gray-100 rounded-full w-20"></div></td>
      <td className="p-4"><div className="flex justify-center gap-2"><div className="w-6 h-6 bg-gray-100 rounded"></div><div className="w-6 h-6 bg-gray-100 rounded"></div></div></td>
    </tr>
  );

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen font-sans">
      <div className="flex-1 transition-all duration-300 overflow-hidden w-full">
        <main className="p-5 md:p-8">
          
          <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#05070A]">Products</h1>
              <p className="text-gray-500 text-sm">Manage inventory ({data?.total || 0} products)</p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="bg-gradient-to-r from-[#6339F9] to-[#A67EFB] text-white shadow-lg shadow-purple-500/30 rounded-xl px-5 py-2.5 font-medium hover:opacity-90 transition-all active:scale-95"
            >
              + Add Product
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                placeholder="Search products by name, brand..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#6339F9] transition-all" 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            <button className="flex w-[125px] items-center justify-center gap-2 px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-all shadow-sm bg-white">
              <MdOutlineFilterAlt className="text-xl" />
              <span className="text-sm font-bold">Filters</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
  
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
              <table className="w-full text-left border-collapse overflow-auto">
                <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-all group">
                        <td className="p-4">
                          <img src={product.thumbnail} className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-50" alt={product.title} />
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-[#05070A] text-sm truncate max-w-[180px]">{product.title}</div>
                        </td>
                        <td className="p-4 text-gray-500 text-sm">{product.brand || 'N/A'}</td>
                        <td className="p-4 capitalize text-sm text-gray-500">{product.category}</td>
                        <td className="p-4 font-bold text-[#6339F9] text-sm">${product.price}</td>
                        <td className="p-4 text-gray-500 text-sm">{product.stock}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <div className="flex">{renderStars(product.rating)}</div>
                            <span className="text-[11px] font-bold text-gray-400">({product.rating})</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                            product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {product.stock < 10 ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => navigate(`/products/${product.id}`)}
                              className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FaEye size={14} />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="p-2 hover:bg-green-50 text-gray-400 hover:text-green-500 rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(product.id)}
                              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-10 text-center text-gray-400 text-sm">
                        No products found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-6 bg-white">
              <div className="text-sm text-gray-400 font-medium">
                Showing {page * limit + 1} to {Math.min((page + 1) * limit, data?.total || 0)} of {data?.total || 0} results
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 font-medium">Rows per page:</span>
                <select 
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(0);
                  }}
                  className="border border-gray-100 rounded-xl px-3 py-1.5 text-sm font-bold text-gray-700 outline-none bg-gray-50/50 focus:border-[#6339F9] transition-all cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-100 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-all"
                >
                  First
                </button>
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-2.5 border border-gray-100 rounded-xl text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"
                >
                  <FaChevronLeft size={12} />
                </button>
                <button className="w-10 h-10 rounded-xl bg-[#6339F9] text-white text-sm font-bold shadow-lg shadow-purple-200 transition-all">
                  {page + 1}
                </button>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  disabled={(page + 1) * limit >= (data?.total || 0)}
                  className="p-2.5 border border-gray-100 rounded-xl text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"
                >
                  <FaChevronRight size={12} />
                </button>
                <button 
                  onClick={() => setPage(Math.ceil((data?.total || 0) / limit) - 1)}
                  disabled={(page + 1) * limit >= (data?.total || 0)}
                  className="px-4 py-2 border border-gray-100 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-all"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
        initialData={selectedProduct} 
      />

      {isConfirmOpen && (
        <Confirm
          img={ConfirmDelete}
          label="Are you sure you want to delete this product?"
          confirmButtonName={deleteMutation.isPending ? "Deleting..." : "Delete"}
          onCancel={() => !deleteMutation.isPending && setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isStatusModelOpen && (
        <Model
          message={statusConfig.message} 
          imageSrc={statusConfig.image} 
        />
      )}
    </div>
  );
}