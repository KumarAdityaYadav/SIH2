import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Check,
  CreditCard,
  ShieldCheck,
  Truck,
  Leaf,
  Info,
  Sparkles,
  Search,
  Zap,
  Flame,
  Pill,
  HeartHandshake,
  Activity,
  Layers,
  Star,
  Eye,
  X,
  Clock,
  Award,
  CheckCircle2,
  Tag,
  ArrowRight,
  PackageCheck,
  HelpCircle,
  MapPin,
  Bike,
  Radio,
  Store,
  Navigation,
  Play,
  Video,
  Volume2,
} from 'lucide-react';
import { CartItem, LanguageCode, Product, User, DeliveryPartner, VillageDarkStore } from '../types';
import { SEED_PRODUCTS, SEED_DELIVERY_PARTNERS, SEED_VILLAGE_DARK_STORES } from '../data/seedData';
import { getTranslation } from '../services/translations';
import { VillageQuickDeliveryMap } from './VillageQuickDeliveryMap';

interface CareStoreViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onCheckout: () => void;
}

export const CareStoreView: React.FC<CareStoreViewProps> = ({
  currentUser,
  currentLanguage,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
}) => {
  const [products] = useState<Product[]>(SEED_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewTab, setQuickViewTab] = useState<'overview' | 'video_guide' | 'dosage'>('overview');
  const [isPlayingProductVideo, setIsPlayingProductVideo] = useState(false);

  // Delivery Partner State
  const [selectedDeliveryPartner, setSelectedDeliveryPartner] = useState<DeliveryPartner>(SEED_DELIVERY_PARTNERS[0]);
  const [showDeliveryMapModal, setShowDeliveryMapModal] = useState<boolean>(false);

  // Cart Drawer & Checkout State
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'partner' | 'payment' | 'success'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Checkout address & payment
  const [addressForm, setAddressForm] = useState({
    fullName: currentUser?.fullName || 'Sunita Sharma',
    phone: currentUser?.phone || '+91 98765 43210',
    villageOrStreet: 'Ward 4, Govindgarh Road',
    district: currentUser?.location || 'Jaipur Rural',
    state: 'Rajasthan',
    pincode: '303702',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD'>('UPI');
  const [orderTrackingId, setOrderTrackingId] = useState<string>('STR-RUR-9021');

  const t = (key: string) => getTranslation(currentLanguage, key);

  const categories = [
    { id: 'all', label: 'All Products', icon: Sparkles, count: products.length },
    { id: 'nutrition_supplements', label: 'Period Tablets & Nutrition', icon: Pill, count: products.filter(p => p.category === 'nutrition_supplements').length },
    { id: 'pain_relief', label: 'Cramp Comfort & Hot Bags', icon: Flame, count: products.filter(p => p.category === 'pain_relief').length },
    { id: 'smart_devices', label: 'Smart Care Devices', icon: Zap, count: products.filter(p => p.category === 'smart_devices').length },
    { id: 'biodegradable_pads', label: 'Bio-Organic & Anion Pads', icon: Leaf, count: products.filter(p => p.category === 'biodegradable_pads').length },
    { id: 'reusable_cloth_pads', label: 'Reusable Cloth & Underwear', icon: Layers, count: products.filter(p => p.category === 'reusable_cloth_pads').length },
    { id: 'menstrual_cups', label: 'Menstrual Cups', icon: HeartHandshake, count: products.filter(p => p.category === 'menstrual_cups').length },
    { id: 'intimate_hygiene', label: 'Intimate Cleaners & Wipes', icon: ShieldCheck, count: products.filter(p => p.category === 'intimate_hygiene').length },
  ];

  // Filtering & Sorting
  const filteredProducts = products
    .filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.features?.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = a.priceInr || a.price;
      const priceB = b.priceInr || b.price;
      if (sortBy === 'price_low') return priceA - priceB;
      if (sortBy === 'price_high') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.priceInr || item.product.price) * item.quantity, 0);
  const discountAmount = Math.round((cartSubtotal * appliedDiscount) / 100);
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError(null);
    setCouponSuccess(null);
    const code = couponCode.trim().toUpperCase();
    if (code === 'STREESURE20' || code === 'CARE20') {
      setAppliedDiscount(20);
      setCouponSuccess('20% StreeSure Wellness Discount applied!');
    } else if (code === 'RURALCARE' || code === 'ASHA50') {
      setAppliedDiscount(25);
      setCouponSuccess('25% Grassroots Rural Subsidy Coupon applied!');
    } else {
      setCouponError('Invalid coupon code. Try STREESURE20 or RURALCARE');
    }
  };

  const handlePlaceOrder = () => {
    const randomId = 'STR-' + Math.floor(100000 + Math.random() * 900000);
    setOrderTrackingId(randomId);
    setCheckoutStep('success');
    onCheckout();
  };

  const handleCloseCart = () => {
    setShowCartDrawer(false);
    setCheckoutStep('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-rose-800 via-rose-700 to-pink-700 rounded-3xl p-6 sm:p-10 border border-rose-600 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/30 text-rose-100 text-xs font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Community Menstrual Care & Hygiene Store</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            StreeSure Period & Wellness Essentials
          </h1>
          <p className="text-sm font-semibold text-rose-100">
            Find subsidized, clinically verified menstrual-care & PCOS comfort products near you.
          </p>
          <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-normal">
            Explore organic sanitary pads, menstrual cups, herbal cramp relief patches, heating belts, and intimate hygiene kits with discreet rural and doorstep delivery.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-rose-100 pt-1">
            <span className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              AYUSH & FDA Approved
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-lg">
              <Truck className="w-4 h-4 text-teal-300" />
              Free Rural PHC Delivery
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-lg">
              <Leaf className="w-4 h-4 text-emerald-300" />
              100% Rash-Free & Certified
            </span>
          </div>
        </div>

        {/* View Cart Pill */}
        <div className="relative z-10 flex flex-col items-start md:items-end gap-2">
          <button
            type="button"
            id="btn-open-care-cart"
            onClick={() => {
              setShowCartDrawer(true);
              setCheckoutStep('cart');
            }}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-900 text-xs sm:text-sm font-black shadow-2xl hover:scale-105 transition-all"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-rose-700" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </div>
            <span>View Care Cart</span>
            <span className="bg-rose-100 text-rose-900 px-2.5 py-0.5 rounded-lg font-mono font-black">
              ₹{cartTotal}
            </span>
          </button>
          <span className="text-xs text-rose-100 font-medium">
            Cash on Delivery & Instant UPI Available
          </span>
        </div>
      </div>

      {/* 2. Blinkit & Zepto Village Quick-Delivery Network Banner */}
      <div className="p-5 rounded-3xl bg-white border border-rose-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-200 shrink-0">
            <Bike className="w-6 h-6 animate-bounce duration-1000" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-600 animate-ping" />
                Zepto & Blinkit Rural Quick Hubs Active
              </span>
              <span className="text-xs text-emerald-700 font-bold">
                ⚡ 15–25 Mins Doorstep Delivery in Villages
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Rural Micro-Dark Stores Delivering Tablets, Hot Bags, Patches & Pads
            </h3>
            <p className="text-xs text-slate-600 font-normal">
              Discreet, tamper-proof packaging delivered to remote hamlets, farms, and village homes via electric bikes & ASHA Sanginis.
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-open-village-map"
          onClick={() => setShowDeliveryMapModal(true)}
          className="px-5 py-3 rounded-2xl btn-rose-primary text-white text-xs font-bold shadow-md flex items-center gap-2 shrink-0 transition hover:scale-102"
        >
          <Navigation className="w-4 h-4 text-white animate-spin duration-3000" />
          <span>View Village Dark-Stores & Live GPS Route</span>
        </button>
      </div>

      {/* 3. Medical Transparency Notice */}
      <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200 text-xs text-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>
            <strong className="text-slate-900 font-bold">Healthcare & Safety Guidance:</strong> Products available in the StreeSure Care Store include herbal pain supplements, thermal heating aids, smart electrotherapy units, and hygienic disposables designed for cycle comfort. They are not intended to replace formal prescription medical therapies for severe clinical conditions.
          </p>
          <p className="text-[11px] text-slate-600 font-medium">
            For unmanageable pelvic pain or suspected severe endometriosis, please consult our verified gynecologists via the Tele-Consultation tab.
          </p>
        </div>
      </div>

      {/* 4. Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="store-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tablets, hot bags, patches, pads, devices..."
            className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Dropdown & Item Count */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3 text-xs">
          <span className="text-slate-600 whitespace-nowrap font-medium">
            Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> items
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="featured">Featured / Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Category Tabs Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              id={`category-tab-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                isSelected
                  ? 'btn-rose-primary text-white shadow-md scale-102'
                  : 'bg-white border border-rose-200 text-slate-700 hover:bg-rose-50 hover:border-rose-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-rose-600'}`} />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isSelected ? 'bg-white/30 text-white' : 'bg-rose-100 text-rose-800'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 6. Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-rose-200 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-rose-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No products found</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
            Try adjusting your search query or select another category above.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-full btn-rose-primary text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const inCart = cart.find((i) => i.product.id === prod.id);
            const price = prod.priceInr || prod.price;

            return (
              <div
                key={prod.id}
                id={`product-card-${prod.id}`}
                className="bg-white rounded-3xl p-4 border border-rose-200 hover:border-rose-400 transition-all flex flex-col justify-between group hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative mb-3.5 overflow-hidden rounded-2xl bg-rose-50 aspect-4/3">
                    <img
                      src={prod.imageUrl || prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Top-Left Tag / Subsidy Badge */}
                    {prod.tag && (
                      <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md">
                        {prod.tag}
                      </span>
                    )}

                    {/* Top-Right Eco/Medical Badge */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
                      {prod.ecoFriendly && (
                        <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          <Leaf className="w-2.5 h-2.5" /> Eco
                        </span>
                      )}
                    </div>

                    {/* Quick View Button on Hover */}
                    <button
                      type="button"
                      onClick={() => {
                        setQuickViewProduct(prod);
                        setQuickViewTab('overview');
                        setIsPlayingProductVideo(false);
                      }}
                      className="absolute inset-x-3 bottom-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-xs flex items-center justify-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5 text-rose-300" />
                      <span>Quick Details & Video Guide</span>
                    </button>
                  </div>

                  {/* Rating & Review Count */}
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                    <div className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{prod.rating || 4.8}</span>
                      <span className="text-slate-500 font-normal">
                        ({prod.reviewCount || 210})
                      </span>
                    </div>
                    {prod.isSubsidized && (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px] border border-emerald-200">
                        Subsidized Rate
                      </span>
                    )}
                  </div>

                  {/* Product Title & Short Description */}
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-2 leading-snug group-hover:text-rose-700 transition">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed font-medium">
                    {prod.description}
                  </p>

                  {/* Key Feature Pills */}
                  {prod.features && prod.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {prod.features.slice(0, 2).map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 truncate max-w-full font-semibold"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price & Action Row */}
                <div className="pt-3 border-t border-rose-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900 font-mono">
                        ₹{price}
                      </span>
                      {prod.originalPrice && (
                        <span className="text-xs text-slate-400 line-through font-mono">
                          ₹{prod.originalPrice}
                        </span>
                      )}
                    </div>
                    {prod.discountPercent && (
                      <span className="text-[10px] font-bold text-emerald-700 block">
                        {prod.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Cart Action Buttons */}
                  {inCart ? (
                    <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 rounded-2xl p-1">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(prod.id, inCart.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white hover:bg-rose-100 text-rose-800 flex items-center justify-center transition border border-rose-200"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center text-slate-900">
                        {inCart.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(prod.id, inCart.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white hover:bg-rose-100 text-rose-800 flex items-center justify-center transition border border-rose-200"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      id={`btn-add-to-cart-${prod.id}`}
                      onClick={() => onAddToCart(prod)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-2xl btn-rose-primary text-xs font-bold shadow-sm hover:scale-105 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 7. QUICK VIEW / PRODUCT DETAILS & VIDEO GUIDE MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-rose-200 p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900">
            <button
              type="button"
              onClick={() => {
                setQuickViewProduct(null);
                setIsPlayingProductVideo(false);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-full bg-slate-100 hover:bg-rose-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Tabs */}
            <div className="flex gap-2 border-b border-rose-100 pb-3 text-xs">
              <button
                type="button"
                onClick={() => setQuickViewTab('overview')}
                className={`px-4 py-2 rounded-xl font-bold transition ${
                  quickViewTab === 'overview'
                    ? 'btn-rose-primary text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                Product Details
              </button>
              <button
                type="button"
                onClick={() => setQuickViewTab('video_guide')}
                className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  quickViewTab === 'video_guide'
                    ? 'btn-rose-primary text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Demonstration & Usage</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickViewTab('dosage')}
                className={`px-4 py-2 rounded-xl font-bold transition ${
                  quickViewTab === 'dosage'
                    ? 'btn-rose-primary text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                Instructions & Certifications
              </button>
            </div>

            {quickViewTab === 'video_guide' ? (
              /* Video Guide Tab */
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center shadow-lg border border-slate-300">
                  {isPlayingProductVideo ? (
                    <div className="p-6 text-center space-y-3 text-white">
                      <div className="w-14 h-14 rounded-full bg-rose-600/80 mx-auto flex items-center justify-center animate-pulse">
                        <Video className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="text-base font-bold">
                        Demonstrating: {quickViewProduct.name}
                      </h4>
                      <p className="text-xs text-slate-300 max-w-md mx-auto">
                        Safe application, temperature setting, disposal guidelines, and skin comfort best practices.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsPlayingProductVideo(false)}
                        className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-xs font-bold text-white transition"
                      >
                        Pause Video Preview
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white">
                      <img
                        src={quickViewProduct.imageUrl || quickViewProduct.image}
                        alt={quickViewProduct.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-35"
                      />
                      <button
                        type="button"
                        onClick={() => setIsPlayingProductVideo(true)}
                        className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition z-10"
                      >
                        <Play className="w-8 h-8 fill-white ml-1" />
                      </button>
                      <span className="z-10 mt-3 text-sm font-extrabold text-white drop-shadow-md">
                        Play 2-Min Doctor & ASHA Usage Tutorial
                      </span>
                      <span className="z-10 text-xs text-rose-200">
                        HD Audio & Subtitles in Hindi and English
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-xs space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-rose-600" />
                    Doctor & ASHA Certified Video Highlights
                  </h5>
                  <ul className="space-y-1 text-slate-700 list-disc list-inside">
                    <li>How to position comfortably for maximum pain relief.</li>
                    <li>Eco-friendly disposal or sterilization methods.</li>
                    <li>Recommended duration of usage during peak menstrual flow.</li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Overview & Dosage Tab */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="space-y-3">
                  <img
                    src={quickViewProduct.imageUrl || quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full aspect-square rounded-2xl object-cover border border-rose-200 shadow-sm"
                  />
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <Truck className="w-4 h-4 text-teal-600" />
                    <span>Dispatched via PHC / ASHA node within 24–48 hrs</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    {quickViewProduct.tag && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold mb-1.5">
                        {quickViewProduct.tag}
                      </span>
                    )}
                    <h2 className="text-xl font-bold text-slate-900 leading-snug">
                      {quickViewProduct.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{quickViewProduct.rating || 4.8}</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        ({quickViewProduct.reviewCount || 240} verified community reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      ₹{quickViewProduct.priceInr || quickViewProduct.price}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-sm text-slate-400 line-through font-mono">
                        ₹{quickViewProduct.originalPrice}
                      </span>
                    )}
                    {quickViewProduct.discountPercent && (
                      <span className="text-xs font-bold text-emerald-800 px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-200">
                        {quickViewProduct.discountPercent}% OFF Subsidized
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {quickViewProduct.description}
                  </p>

                  {/* Features List */}
                  {quickViewProduct.features && (
                    <div className="space-y-1.5 pt-2 border-t border-rose-100">
                      <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                        Key Highlights
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {quickViewProduct.features.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Usage Instructions */}
                  {quickViewProduct.usageInstructions && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                      <span className="text-[11px] font-bold text-rose-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-rose-600" />
                        How to Use & Dosage
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {quickViewProduct.usageInstructions}
                      </p>
                    </div>
                  )}

                  {/* Safety Certifications */}
                  {quickViewProduct.safetyCertifications && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {quickViewProduct.safetyCertifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1 font-semibold"
                        >
                          <Award className="w-3 h-3 text-teal-600" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Action Buttons */}
            <div className="pt-4 border-t border-rose-100 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(quickViewProduct);
                  setQuickViewProduct(null);
                  setShowCartDrawer(true);
                }}
                className="flex-1 py-3 rounded-2xl btn-rose-primary text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Care Cart</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuickViewProduct(null);
                  setIsPlayingProductVideo(false);
                }}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-200"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. CART DRAWER & CHECKOUT FLOW */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-l border-rose-200 w-full max-w-lg h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 text-slate-900">
            {/* Top Bar */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-rose-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl btn-rose-primary flex items-center justify-center text-white">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Your Care Cart
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {cart.length} unique item{cart.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseCart}
                  className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step Flow Indicators */}
              <div className="flex items-center justify-between py-3 px-1 border-b border-rose-100 text-xs font-bold overflow-x-auto">
                <span className={checkoutStep === 'cart' ? 'text-rose-600 underline underline-offset-4' : 'text-slate-400'}>
                  1. Items
                </span>
                <span className="text-slate-300">→</span>
                <span className={checkoutStep === 'address' ? 'text-rose-600 underline underline-offset-4' : 'text-slate-400'}>
                  2. Address
                </span>
                <span className="text-slate-300">→</span>
                <span className={checkoutStep === 'partner' ? 'text-rose-600 underline underline-offset-4' : 'text-slate-400'}>
                  3. Partner
                </span>
                <span className="text-slate-300">→</span>
                <span className={checkoutStep === 'payment' ? 'text-rose-600 underline underline-offset-4' : 'text-slate-400'}>
                  4. Payment
                </span>
              </div>

              {/* STEP 1: CART ITEMS */}
              {checkoutStep === 'cart' && (
                <div className="space-y-4 py-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <ShoppingBag className="w-12 h-12 text-rose-300 mx-auto" />
                      <p className="text-xs text-slate-500 font-medium">
                        Your care cart is currently empty.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowCartDrawer(false)}
                        className="px-4 py-2 rounded-full btn-rose-primary text-xs font-bold"
                      >
                        Explore Essentials
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-rose-100 space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                      {cart.map((item) => (
                        <div key={item.product.id} className="pt-3 flex items-start justify-between gap-3">
                          <img
                            src={item.product.imageUrl || item.product.image}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-rose-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {item.product.name}
                            </h4>
                            <div className="flex items-baseline gap-2 text-xs mt-0.5">
                              <span className="font-bold text-rose-700 font-mono">
                                ₹{item.product.priceInr || item.product.price}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                × {item.quantity} = ₹
                                {(item.product.priceInr || item.product.price) * item.quantity}
                              </span>
                            </div>
                            {item.product.tag && (
                              <span className="text-[10px] text-emerald-700 font-semibold block">
                                {item.product.tag}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 shrink-0 bg-rose-50 border border-rose-200 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 rounded-md text-slate-700 hover:text-rose-700 hover:bg-white transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 rounded-md text-slate-700 hover:text-rose-700 hover:bg-white transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onRemoveFromCart(item.product.id)}
                              className="p-1 rounded-md text-rose-600 hover:text-rose-800 hover:bg-rose-100 ml-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Coupon Code Box */}
                  {cart.length > 0 && (
                    <div className="pt-3 border-t border-rose-100 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Coupon: STREESURE20 or RURALCARE"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:bg-white focus:border-rose-500 font-mono uppercase font-semibold"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-bold border border-rose-300 transition"
                        >
                          Apply
                        </button>
                      </div>
                      {couponSuccess && (
                        <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> {couponSuccess}
                        </p>
                      )}
                      {couponError && (
                        <p className="text-xs text-rose-600 font-semibold">
                          {couponError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: ADDRESS */}
              {checkoutStep === 'address' && (
                <div className="space-y-3.5 py-4">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                    Rural / Village Delivery Address
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="text-xs text-slate-700 font-bold block mb-1">
                        Recipient Full Name
                      </label>
                      <input
                        type="text"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-rose-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-700 font-bold block mb-1">
                        Mobile Phone (For ASHA / Delivery Updates)
                      </label>
                      <input
                        type="text"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-rose-500 font-mono font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-700 font-bold block mb-1">
                        Village / Ward / Street Address
                      </label>
                      <input
                        type="text"
                        value={addressForm.villageOrStreet}
                        onChange={(e) => setAddressForm({ ...addressForm, villageOrStreet: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-rose-500 font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-700 font-bold block mb-1">
                          District / City
                        </label>
                        <input
                          type="text"
                          value={addressForm.district}
                          onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-rose-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-700 font-bold block mb-1">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-rose-500 font-mono font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: DELIVERY PARTNER SELECTION */}
              {checkoutStep === 'partner' && (
                <div className="space-y-3.5 py-4">
                  <div>
                    <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center justify-between">
                      <span>Select Village Delivery Partner</span>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        ⚡ Quick Village Commerce
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      Choose your preferred rural delivery fleet or community healthcare runner.
                    </p>
                  </div>

                  <div className="space-y-2.5 max-h-[48vh] overflow-y-auto pr-1 text-xs">
                    {SEED_DELIVERY_PARTNERS.map((partner) => {
                      const isSelected = selectedDeliveryPartner.id === partner.id;
                      return (
                        <div
                          key={partner.id}
                          onClick={() => setSelectedDeliveryPartner(partner)}
                          className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-2.5 ${
                            isSelected
                              ? 'bg-rose-50 border-rose-500 shadow-sm ring-1 ring-rose-300'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={partner.riderPhoto}
                                alt={partner.riderName}
                                className="w-11 h-11 rounded-xl object-cover border border-rose-200 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-900">
                                    {partner.partnerLabel}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                    {partner.logoBadge}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 font-medium">
                                  Rider: <strong className="text-slate-900">{partner.riderName}</strong> ({partner.vehicleType})
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 block">
                                ⚡ {partner.estimatedTime || `${partner.estimatedMinutes} Mins`}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block font-semibold">
                                {partner.distanceKm} km away
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1 border-t border-rose-100 text-slate-600 font-medium">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              {partner.discreetPackaging !== false ? 'Discreet Tamper-Proof' : 'Eco-Bag'}
                            </span>
                            <span className="text-amber-700 font-bold">
                              ★ {partner.rating} ({partner.totalDeliveries}+)
                            </span>
                            <span className="text-emerald-700 font-bold">
                              {(partner.deliveryFeeInr ?? partner.deliveryFee) === 0 ? 'FREE' : `₹${partner.deliveryFeeInr ?? partner.deliveryFee}`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: PAYMENT METHOD */}
              {checkoutStep === 'payment' && (
                <div className="space-y-4 py-4">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                    Select Payment Mode
                  </h4>
                  <div className="space-y-2 text-xs">
                    <label
                      onClick={() => setPaymentMethod('UPI')}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                        paymentMethod === 'UPI'
                          ? 'bg-rose-50 border-rose-500 text-slate-900 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <div>
                          <span className="font-bold block">Instant UPI (GPay / PhonePe / Paytm)</span>
                          <span className="text-[10px] text-slate-500">Fast simulated QR Code & instant confirmation</span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'UPI'}
                        onChange={() => setPaymentMethod('UPI')}
                      />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('COD')}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                        paymentMethod === 'COD'
                          ? 'bg-rose-50 border-rose-500 text-slate-900 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-bold block">Cash on Delivery (COD)</span>
                          <span className="text-[10px] text-slate-500">Pay at doorstep or to ASHA Facilitator</span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                      />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('CARD')}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                        paymentMethod === 'CARD'
                          ? 'bg-rose-50 border-rose-500 text-slate-900 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                        <div>
                          <span className="font-bold block">RuPay / Debit / Credit Card</span>
                          <span className="text-[10px] text-slate-500">100% Encrypted & Subsidized Portal</span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'CARD'}
                        onChange={() => setPaymentMethod('CARD')}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 5: ORDER SUCCESS */}
              {checkoutStep === 'success' && (
                <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                    <PackageCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-emerald-700 font-bold tracking-wider uppercase">
                      Order Confirmed #{orderTrackingId}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      Dispatched to {selectedDeliveryPartner.partnerLabel}!
                    </h3>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto font-medium">
                      Your period care package is packed and out for delivery. Rider {selectedDeliveryPartner.riderName} is en route.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-left space-y-2">
                    <div className="flex justify-between text-slate-700 font-medium">
                      <span>Delivery Partner:</span>
                      <strong className="text-slate-900 flex items-center gap-1.5">
                        <span>{selectedDeliveryPartner.partnerLabel}</span>
                        <span className="text-[10px] text-rose-700 font-bold">({selectedDeliveryPartner.riderName})</span>
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-700 font-medium">
                      <span>Expected ETA:</span>
                      <span className="text-emerald-700 font-bold font-mono">⚡ {selectedDeliveryPartner.estimatedTime || `${selectedDeliveryPartner.estimatedMinutes} Mins`}</span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-medium">
                      <span>Destination:</span>
                      <span className="text-slate-900 font-bold text-right">{addressForm.villageOrStreet}, {addressForm.district}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowCartDrawer(false);
                      setShowDeliveryMapModal(true);
                    }}
                    className="w-full py-3.5 rounded-2xl btn-rose-primary text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 hover:scale-102 transition"
                  >
                    <Navigation className="w-4 h-4 text-white animate-spin duration-3000" />
                    <span>Track Live Village Delivery Partner on Map</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseCart}
                    className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    Return to Store
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Summary & Actions (When not in success state) */}
            {checkoutStep !== 'success' && cart.length > 0 && (
              <div className="pt-4 border-t border-rose-100 space-y-3">
                <div className="space-y-1 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono text-slate-900 font-bold">₹{cartSubtotal}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Subsidy Discount ({appliedDiscount}%):</span>
                      <span className="font-mono">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Village Delivery ({selectedDeliveryPartner.partnerLabel}):</span>
                    <span className="text-emerald-700 font-bold">
                      {(selectedDeliveryPartner.deliveryFeeInr ?? selectedDeliveryPartner.deliveryFee ?? 0) === 0 ? 'FREE' : `₹${selectedDeliveryPartner.deliveryFeeInr ?? selectedDeliveryPartner.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-rose-100">
                    <span>Total Amount:</span>
                    <span className="font-mono text-lg text-rose-700">₹{cartTotal + (selectedDeliveryPartner.deliveryFeeInr ?? selectedDeliveryPartner.deliveryFee ?? 0)}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' && (
                  <button
                    type="button"
                    id="btn-proceed-to-address"
                    onClick={() => setCheckoutStep('address')}
                    className="w-full py-3.5 rounded-2xl btn-rose-primary text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 hover:scale-102 transition"
                  >
                    <span>Proceed to Delivery Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {checkoutStep === 'address' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      id="btn-proceed-to-partner"
                      onClick={() => setCheckoutStep('partner')}
                      className="flex-1 py-3 rounded-2xl btn-rose-primary text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Select Delivery Partner</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {checkoutStep === 'partner' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('address')}
                      className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      id="btn-proceed-to-payment"
                      onClick={() => setCheckoutStep('payment')}
                      className="flex-1 py-3 rounded-2xl btn-rose-primary text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {checkoutStep === 'payment' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('partner')}
                      className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      id="btn-confirm-order"
                      onClick={handlePlaceOrder}
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-sm font-black shadow-md flex items-center justify-center gap-2 hover:scale-102 transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm Order (₹{cartTotal + (selectedDeliveryPartner.deliveryFeeInr ?? selectedDeliveryPartner.deliveryFee ?? 0)})</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. FULL-SCREEN VILLAGE QUICK-DELIVERY & GPS ROUTE MODAL */}
      {showDeliveryMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto">
            <VillageQuickDeliveryMap
              orderId={orderTrackingId}
              selectedPartner={selectedDeliveryPartner}
              orderedItems={cart}
              deliveryAddress={{
                fullName: addressForm.fullName,
                phone: addressForm.phone,
                villageOrStreet: addressForm.villageOrStreet,
                district: addressForm.district,
                pincode: addressForm.pincode,
              }}
              totalAmount={cartTotal + (selectedDeliveryPartner.deliveryFeeInr ?? selectedDeliveryPartner.deliveryFee ?? 0)}
              onClose={() => setShowDeliveryMapModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
