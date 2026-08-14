import React, { useState } from 'react';
import { ShoppingBag, Star, ArrowRight, ShieldCheck, Truck, Video, Plus, Heart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import '../../styles/shop.css';
import '../../styles/modals.css';

const allProducts = [
  // Beginner / Core Kits
  { 
    id: 1, 
    category: 'popular',
    subCategory: 'mosaic',
    title: 'Mosaic Art Tray Kit', 
    price: '₹899.00', 
    url: 'https://rzp.io/l/B8kcvpZv', 
    img: '/assets/b1.avif',
    tag: '⭐ BESTSELLER',
    tagColor: 'orange',
    tapeColor: 'orange',
    rating: '4.9',
    reviews: 142,
    perk: 'Includes wooden base & colorful tiles'
  },
  { 
    id: 2, 
    category: 'popular',
    subCategory: 'paper',
    title: 'Book Binding DIY Kit', 
    price: '₹799.00', 
    url: 'https://rzp.io/l/MZMgvJT', 
    img: '/assets/b2.avif',
    tag: '📚 CLASSIC CRAFT',
    tagColor: 'blue',
    tapeColor: 'yellow',
    rating: '4.8',
    reviews: 98,
    perk: 'Traditional Japanese stitch binding'
  },
  { 
    id: 3, 
    category: 'popular',
    subCategory: 'traditional',
    title: 'Block Printing DIY Kit', 
    price: '₹1099.00', 
    url: 'https://rzp.io/l/vpyraESL', 
    img: '/assets/b3.avif',
    tag: '🎨 HERITAGE ART',
    tagColor: 'green',
    tapeColor: 'blue',
    rating: '5.0',
    reviews: 215,
    perk: 'Authentic Sheesham wooden blocks'
  },
  { 
    id: 4, 
    category: 'popular',
    subCategory: 'paper',
    title: 'Hand-made Paper Making DIY Kit', 
    price: '₹899.00', 
    url: 'https://rzp.io/l/YP2hIiawf', 
    img: '/assets/b4.avif',
    tag: '🌿 ECO-FRIENDLY',
    tagColor: 'green',
    tapeColor: 'green',
    rating: '4.9',
    reviews: 180,
    perk: 'Make deckle edge seed paper at home'
  },
  { 
    id: 5, 
    category: 'popular',
    subCategory: 'traditional',
    title: 'Weaving Loom DIY Kit', 
    price: '₹899.00', 
    url: 'https://rzp.io/l/sqT408WeA', 
    img: '/assets/b5.avif',
    tag: '🧶 HANDS-ON FUN',
    tagColor: 'orange',
    tapeColor: 'orange',
    rating: '4.8',
    reviews: 110,
    perk: 'Wooden frame & vibrant wool yarn'
  },
  { 
    id: 6, 
    category: 'popular',
    subCategory: 'nature',
    title: 'Dried Press Flower Kit', 
    price: '₹699.00', 
    url: 'https://rzp.io/l/7pvBCVAs', 
    img: '/assets/b6.avif',
    tag: '🌸 BOTANICAL',
    tagColor: 'pink',
    tapeColor: 'yellow',
    rating: '4.9',
    reviews: 87,
    perk: 'Wooden press with straps & blotting sheets'
  },
  { 
    id: 7, 
    category: 'popular',
    subCategory: 'sculpt',
    title: 'Paper Mache Clay DIY Kit', 
    price: '₹699.00', 
    url: 'https://rzp.io/l/7pvBCVAs', 
    img: '/assets/b7.avif',
    tag: '✨ SENSORY PLAY',
    tagColor: 'purple',
    tapeColor: 'blue',
    rating: '4.7',
    reviews: 64,
    perk: 'Air-dry non-toxic clay powder'
  },
  { 
    id: 8, 
    category: 'popular',
    subCategory: 'nature',
    title: 'Natural Soap Making Kit', 
    price: '₹699.00', 
    url: 'https://rzp.io/l/7pvBCVAs', 
    img: '/assets/b8.avif',
    tag: '🧼 100% ORGANIC',
    tagColor: 'green',
    tapeColor: 'green',
    rating: '4.9',
    reviews: 156,
    perk: 'Pure melt & pour base with essential oils'
  },
  { 
    id: 9, 
    category: 'popular',
    subCategory: 'paper',
    title: 'Paper Décor Making Kit', 
    price: '₹699.00', 
    url: 'https://rzp.io/l/7pvBCVAs', 
    img: '/assets/b9.avif',
    tag: '✂️ FESTIVE CRAFT',
    tagColor: 'orange',
    tapeColor: 'orange',
    rating: '4.8',
    reviews: 92,
    perk: 'Pre-cut origami & 3D hanging templates'
  },

  // Intermediate Kits
  { 
    id: 10, 
    category: 'intermediate',
    subCategory: 'traditional',
    title: 'Indigo Shibori Dyeing DIY Kit', 
    price: '₹949.00', 
    url: 'https://rzp.io/l/B8kcvpZv', 
    img: '/assets/b10.jpg',
    tag: '🌊 JAPANESE RESIST',
    tagColor: 'blue',
    tapeColor: 'blue',
    rating: '5.0',
    reviews: 73,
    perk: 'Authentic indigo vat dye & wood clamp blocks'
  },
  { 
    id: 11, 
    category: 'intermediate',
    subCategory: 'traditional',
    title: 'Natural Dye Bag: Manjistha', 
    price: '₹799.00', 
    url: 'https://rzp.io/l/MZMgvJT', 
    img: '/assets/b2.avif',
    tag: '🍁 PLANT DYES',
    tagColor: 'orange',
    tapeColor: 'yellow',
    rating: '4.8',
    reviews: 58,
    perk: 'Pure Indian Madder root herbal dye & tote'
  },
  { 
    id: 12, 
    category: 'intermediate',
    subCategory: 'traditional',
    title: 'Bead Loom DIY Kit', 
    price: '₹899.00', 
    url: 'https://rzp.io/l/sqT408WeA', 
    img: '/assets/b5.avif',
    tag: '💎 PRECISION WEAVE',
    tagColor: 'purple',
    tapeColor: 'green',
    rating: '4.9',
    reviews: 84,
    perk: 'Sturdy loom, glass seed beads & thread'
  },
  { 
    id: 13, 
    category: 'intermediate',
    subCategory: 'paper',
    title: 'Origami Cloth Bags Kit', 
    price: '₹799.00', 
    url: 'https://rzp.io/l/YP2hIiawf', 
    img: '/assets/b4.avif',
    tag: '🎒 SEW & FOLD',
    tagColor: 'green',
    tapeColor: 'orange',
    rating: '4.7',
    reviews: 49,
    perk: 'Fabric origami folding without complex stitching'
  }
];

export default function ShopPage({ onNavigate, onOpenQuickView }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredProducts = allProducts.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'popular') return item.category === 'popular';
    if (activeTab === 'intermediate') return item.category === 'intermediate';
    if (activeTab === 'paper') return item.subCategory === 'paper';
    if (activeTab === 'traditional') return item.subCategory === 'traditional';
    return true;
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <div className="shop-page">
      {/* Decorative Floating Elements */}
      <img src="/assets/star.png" alt="" className="shop-floating-star left-star" />
      <img src="/assets/3.png" alt="" className="shop-floating-plane" />
      <img src="/assets/pencil_doodle.png" alt="" className="shop-floating-pencil" />

      <div className="shop-inner">
        {/* Filter Navigation Tabs */}
        <div className="shop-filter-tabs">
          <button 
            className={`shop-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Kits ({allProducts.length})
          </button>
          <button 
            className={`shop-tab-btn ${activeTab === 'popular' ? 'active' : ''}`}
            onClick={() => setActiveTab('popular')}
          >
            🌟 Popular & Beginner (9)
          </button>
          <button 
            className={`shop-tab-btn ${activeTab === 'intermediate' ? 'active' : ''}`}
            onClick={() => setActiveTab('intermediate')}
          >
            🎯 Intermediate Kits (4)
          </button>
          <button 
            className={`shop-tab-btn ${activeTab === 'traditional' ? 'active' : ''}`}
            onClick={() => setActiveTab('traditional')}
          >
            🎨 Traditional Crafts
          </button>
          <button 
            className={`shop-tab-btn ${activeTab === 'paper' ? 'active' : ''}`}
            onClick={() => setActiveTab('paper')}
          >
            📄 Paper & Origami
          </button>
        </div>

        {/* Main Products Grid */}
        <div className="shop-grid">
          {filteredProducts.map((prod, index) => (
            <div 
              key={prod.id} 
              className={`shop-card shop-card-${prod.tapeColor} ${index % 2 === 0 ? 'shop-card-even' : 'shop-card-odd'}`}
            >
              {/* Decorative Tape Sticker */}
              <div className={`shop-card-tape tape-${prod.tapeColor}`} />

              {/* Badge Tag */}
              <div className={`shop-card-tag tag-${prod.tagColor}`}>
                {prod.tag}
              </div>

              {/* Wishlist Heart Toggle */}
              <button 
                type="button"
                className={`shop-card-wish-btn ${isInWishlist(prod.id) ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(prod);
                }}
                aria-label="Wishlist"
              >
                <Heart size={16} fill={isInWishlist(prod.id) ? '#ED612B' : 'none'} color={isInWishlist(prod.id) ? '#ED612B' : '#718096'} />
              </button>

              {/* Image Frame */}
              <div className="shop-img-box">
                <img src={prod.img} alt={prod.title} className="shop-img" loading="lazy" />
                <button 
                  type="button" 
                  className="shop-card-quick-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQuickView?.(prod);
                  }}
                >
                  Quick View 👁️
                </button>
              </div>

              {/* Rating */}
              <div className="shop-card-rating">
                <div className="shop-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#FFB800" color="#FFB800" />
                  ))}
                </div>
                <span className="shop-rating-num">{prod.rating} ({prod.reviews})</span>
              </div>

              {/* Title and details */}
              <h3 className="shop-prod-title">{prod.title}</h3>
              <p className="shop-prod-perk">{prod.perk}</p>
              
              <div className="shop-card-bottom">
                <span className="shop-prod-price">{prod.price}</span>
                <button 
                  type="button"
                  onClick={() => addToCart(prod)}
                  className="shop-buy-btn"
                  aria-label={`Add ${prod.title} to Bag`}
                >
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Subscription Banner */}
        <div className="shop-sub-banner">
          <img src="/assets/4.png" alt="" className="shop-sub-mascot" />
          <div className="shop-sub-content">
            <h2 className="shop-sub-title">Subscribe for uninterrupted all year round learning!</h2>
            <p className="shop-sub-text">
              Get monthly craft deliveries, early access to new kits, and exclusive step-by-step masterclasses.
            </p>
            
            <form onSubmit={handleSubscribe} className="shop-sub-form">
              <input 
                type="email" 
                placeholder="Enter your email address..."
                className="shop-sub-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="shop-sub-btn">
                <span>Subscribe Now!</span>
                <ArrowRight size={18} />
              </button>
            </form>
            
            {subscribed && (
              <p className="shop-sub-success">
                🎉 Awesome! You're subscribed to the creative makers club!
              </p>
            )}
          </div>
        </div>

        {/* Guarantee & Trust Badges */}
        <div className="shop-trust-grid">
          <div className="shop-trust-card">
            <div className="shop-trust-icon-box">
              <ShieldCheck size={32} color="#00676A" />
            </div>
            <h4>Kid-Safe Materials</h4>
            <p>100% natural, tested, and toxin-free materials suitable for young hands and hobbyists.</p>
          </div>

          <div className="shop-trust-card">
            <div className="shop-trust-icon-box">
              <Video size={32} color="#ED612B" />
            </div>
            <h4>Video Tutorials</h4>
            <p>Scan the QR code inside every box to watch engaging HD video instructions.</p>
          </div>

          <div className="shop-trust-card">
            <div className="shop-trust-icon-box">
              <Truck size={32} color="#2A9D8F" />
            </div>
            <h4>Secure & Fast Delivery</h4>
            <p>Promptly packaged and tracked via trusted express courier partners across India.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
