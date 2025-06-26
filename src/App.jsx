import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { ShoppingCart } from "lucide-react";

const products = [
  {
    id: "1",
    name: "Holographic Hoodie",
    price: 3499,
    image: "https://via.placeholder.com/400x400?text=Hoodie",
  },
  {
    id: "2",
    name: "Neo Tokyo Tee",
    price: 1799,
    image: "https://via.placeholder.com/400x400?text=Tee",
  },
  {
    id: "3",
    name: "Cyber Cargo Pants",
    price: 2999,
    image: "https://via.placeholder.com/400x400?text=Cargo",
  },
];

export default function App() {
  const threeRef = useRef();
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    showToast("Added to cart");
    setCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshStandardMaterial({ color: "#ff0055" });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);
      knot.rotation.x += 0.01;
      knot.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();
    return () => {
      threeRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div ref={threeRef} className="absolute inset-0 -z-10" />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex justify-between items-center px-6 py-4"
      >
        <div className="text-center w-full">
          <h1 className="text-6xl font-bold tracking-tight">ALTER//EGO</h1>
          <p className="text-xl mt-2 opacity-75">Redefine the Street Aesthetic</p>
        </div>
        <button onClick={() => setCartOpen(!cartOpen)} className="absolute right-6 top-6">
          <ShoppingCart className="h-8 w-8 text-white hover:text-pink-400" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-10 text-center px-4"
      >
        <h2 className="text-4xl font-semibold mb-4">Latest Drop</h2>
        <p className="text-md opacity-70 mb-6">
          Bold graphics. Futuristic fits. Timeless vibes.
        </p>
        <button className="text-lg px-8 py-4 rounded-2xl bg-gradient-to-br from-pink-500 to-red-600 hover:scale-105 transition-transform">
          Shop Now
        </button>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8 mt-20 max-w-6xl mx-auto"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.05 }}
            className="bg-zinc-900 p-4 rounded-2xl shadow-xl border border-zinc-700"
          >
            <img
              src={product.image}
              alt={product.name}
              className="rounded-xl w-full h-64 object-cover mb-4"
            />
            <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
            <p className="text-lg text-pink-500 mb-2">₹{product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="w-full mt-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-xl"
            >
              Add to Cart
            </button>
          </motion.div>
        ))}
      </motion.section>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-zinc-800 px-6 py-3 rounded-xl shadow-lg z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-zinc-900 p-6 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Your Cart</h3>
              <button
                onClick={() => setCartOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">{item.name}</p>
                  <div className="flex gap-2 mt-1 items-center">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 bg-zinc-700 rounded"
                    >
                      −
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 bg-zinc-700 rounded"
                    >
                      ＋
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs ml-3 text-red-500 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <span className="text-pink-400">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="text-right text-lg font-semibold text-white mt-2">
              Total: ₹{getCartTotal()}
            </div>
            <button className="w-full mt-4 bg-pink-600 hover:bg-pink-700 py-2 rounded-xl">
              Proceed to Checkout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="text-center p-6 text-sm text-gray-500"
      >
        © 2025 ALTER//EGO. All rights reserved.
      </motion.footer>
    </div>
  );
      }
