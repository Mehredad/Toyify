import React, { useState, useEffect } from 'react';
import { Trash2, ArrowRight } from 'lucide-react';

interface CartItem {
  id: string;
  orderName: string;
  referenceImage: string;
  price: number;
  type: string;
  quantity: number;
}

interface CartTotalsProps {
  subtotal: number;
  shipping: number;
  discount: number;
  onApplyVoucher?: (code: string) => void;
  onContinue?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  continueButtonText?: string;
  continueButtonDisabled?: boolean;
  termsAccepted?: boolean;
  onTermsChange?: (accepted: boolean) => void;
}

const CartTotals: React.FC<CartTotalsProps> = ({
  subtotal,
  shipping,
  discount,
  onApplyVoucher,
  onContinue,
  onBack,
  showBackButton = true,
  continueButtonText = 'Continue',
  continueButtonDisabled = false,
  termsAccepted: propsTermsAccepted,
  onTermsChange: propsOnTermsChange
}) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [internalTermsAccepted, setInternalTermsAccepted] = useState(false);

  const termsAccepted = typeof propsTermsAccepted !== 'undefined' ? propsTermsAccepted : internalTermsAccepted;

  function setTerms(accepted: boolean) {
    if (propsOnTermsChange) {
      propsOnTermsChange(accepted);
    } else {
      setInternalTermsAccepted(accepted);
    }
  }

  const total = subtotal + shipping - discount;

  const handleApplyVoucher = () => {
    if (onApplyVoucher && voucherCode.trim()) {
      onApplyVoucher(voucherCode);
    }
  };

  const handleContinue = () => {
    if (onContinue && termsAccepted) {
      onContinue();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="bg-[#F9F5FF] rounded-lg shadow-sm p-6 md:p-8">
      <h2 className="text-lg md:text-xl font-semibold text-[#181D27] mb-4 md:mb-6">Cart total</h2>
      
      <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
        <div className="flex justify-between text-sm gap-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">£{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm gap-2">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-[#039855]">
            {shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="pt-2 md:pt-4">
          <label className="block text-sm text-gray-600 mb-2">Discount Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Enter your voucher"
              className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleApplyVoucher}
              className="px-4 md:px-6 py-2 bg-[#42307D] text-white text-sm font-medium rounded-md hover:bg-[#7F56D9] transition-colors flex-shrink-0"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="flex justify-between text-sm pt-2 gap-2">
          <span className="text-gray-600">Discount</span>
          <span className="font-medium text-gray-900">£{discount.toFixed(2)}</span>
        </div>
      </div>

      <div className="pt-4 mt-20 mb-4 md:mb-6">
        <div className="flex justify-between items-center gap-2">
          <span className="text-base md:text-lg font-semibold text-gray-900">Total price</span>
          <span className="text-xl md:text-2xl font-bold text-gray-900">£{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-4 md:mb-6">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 flex-shrink-0"
          />
          <span className="text-xs md:text-sm text-gray-600">
            I've read the <a href="/terms" className="text-indigo-600 hover:underline">terms of service</a> and happy to proceed with the payment
          </span>
        </label>
      </div>

      {showBackButton && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleBack}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors text-sm md:text-base"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Load cart data from sessionStorage on mount
  useEffect(() => {
    const cartData = sessionStorage.getItem('cartData');
    if (cartData) {
      const parsedCart = JSON.parse(cartData);
      setCartItems(parsedCart);
    }
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping - discount;

  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    sessionStorage.setItem('cartData', JSON.stringify(updatedCart));
    const newSelected = new Set(selectedItems);
    newSelected.delete(id);
    setSelectedItems(newSelected);
  };

  const applyVoucher = (code?: string) => {
    const codeToUse = code ?? voucherCode;
    console.log('Applying voucher:', codeToUse);
  };

  const handleBackClick = () => {
    window.location.href = '/result';
  };

  const handleCheckoutClick = () => {
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#42307D] mb-6 md:mb-8">Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <button
                  onClick={handleBackClick}
                  className="mt-4 px-6 py-2 bg-[#7F56D9] text-white font-medium rounded-md hover:bg-[#6941C6] transition-colors"
                >
                  Go back to add items
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 p-4 bg-[#F9F5FF] border-b text-sm font-medium text-[#667085]">
                    <div className="col-span-1 flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="col-span-3">Order name</div>
                    <div className="col-span-2">Reference image</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-1">Quantity</div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Cart Items */}
                  {cartItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-b items-center hover:bg-gray-50 transition-colors">
                      <div className="col-span-1 flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="col-span-3 text-sm text-gray-900">{item.orderName}</div>
                      <div className="col-span-2 text-sm text-gray-600">{item.referenceImage}</div>
                      <div className="col-span-2 text-sm font-medium text-gray-900">£{item.price.toFixed(2)}</div>
                      <div className="col-span-2 text-sm text-gray-600">{item.type}</div>
                      <div className="col-span-1 text-sm text-center text-gray-900">{item.quantity}</div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {/* Select All for Mobile */}
                  <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Select All Items</span>
                  </div>

                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-4 h-4 mt-1 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 mb-3 break-words">{item.orderName}</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between gap-2">
                              <span className="text-gray-600 flex-shrink-0">Reference:</span>
                              <span className="text-gray-900 text-right break-words">{item.referenceImage}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-gray-600 flex-shrink-0">Type:</span>
                              <span className="text-gray-900 text-right break-words">{item.type}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-gray-600 flex-shrink-0">Quantity:</span>
                              <span className="text-gray-900 text-right">{item.quantity}</span>
                            </div>
                            <div className="flex justify-between gap-2 font-medium pt-2 border-t">
                              <span className="text-gray-900 flex-shrink-0">Price:</span>
                              <span className="text-[#42307D] text-right">£{item.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Cart Totals Section */}
          <div className="lg:col-span-1">
            <CartTotals
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              onApplyVoucher={(code: string) => { setVoucherCode(code); applyVoucher(code); }}
              showBackButton={false}
              termsAccepted={termsAccepted}
              onTermsChange={setTermsAccepted}
            />
          </div>
        </div>

        {/* Bottom Buttons - Full Width Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-6">
          <div className="lg:col-span-2">
            <button
              onClick={handleBackClick}
              className="px-8 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
          
          <div className="lg:col-span-1">
            <button
              onClick={handleCheckoutClick}
              disabled={!termsAccepted || cartItems.length === 0}
              className="px-8 py-2.5 bg-[#7F56D9] text-white font-medium rounded-md hover:bg-[#6941C6] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 ml-auto"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;