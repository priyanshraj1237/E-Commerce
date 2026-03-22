import { motion } from "framer-motion";
import { User, Mail, ShoppingBag, Calendar } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProfilePage = () => {
  const { user } = useUserStore();
  const { cart } = useCartStore();

  const userInfo = [
    {
      icon: User,
      label: "Name",
      value: user?.name || "N/A",
    },
    {
      icon: Mail,
      label: "Email",
      value: user?.email || "N/A",
    },
    {
      icon: ShoppingBag,
      label: "Cart Items",
      value: cart?.length || 0,
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: user?._id ? new Date(parseInt(user._id.substring(0, 8), 16) * 1000).toLocaleDateString() : "N/A",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-emerald-600 font-bold text-4xl shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {user?.name || "User Profile"}
                  </h1>
                  <p className="text-emerald-100">
                    {user?.role === "admin" ? "Administrator" : "Customer"}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-700 rounded-lg p-4 flex items-center gap-4"
                  >
                    <div className="bg-emerald-600 p-3 rounded-full">
                      <info.icon className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{info.label}</p>
                      <p className="text-white font-semibold text-lg">{info.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Cart Preview Section */}
            {cart && cart.length > 0 && (
              <div className="p-6 border-t border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-4">Cart Preview</h2>
                <div className="space-y-3">
                  {cart.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-emerald-400 font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <p className="text-gray-400 text-center text-sm">
                      And {cart.length - 3} more items...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
