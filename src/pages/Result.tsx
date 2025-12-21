import React, { useState, useEffect } from 'react';
import { Check, Download, Edit2, X } from 'lucide-react';

interface ImageUpload {
  id: number;
  file: File | null;
  preview: string | null;
  type: 'generated' | 'original';
}

const ToyProductPage: React.FC = () => {
  const [images, setImages] = useState<ImageUpload[]>([
    { id: 1, file: null, preview: null, type: 'generated' },
    { id: 2, file: null, preview: null, type: 'original' }
  ]);

  // Load uploaded image from sessionStorage on component mount
  useEffect(() => {
    const uploadedImage = sessionStorage.getItem('uploadedImage');
    const uploadedImageName = sessionStorage.getItem('uploadedImageName');
    
    if (uploadedImage) {
      setImages(prev => prev.map(img => 
        img.type === 'original' 
          ? { ...img, preview: uploadedImage, file: null }
          : img
      ));
    }
  }, []);

  const handleImageUpload = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => prev.map(img => 
          img.id === id 
            ? { ...img, file, preview: reader.result as string }
            : img
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = (id: number) => {
    const image = images.find(img => img.id === id);
    if (image?.preview) {
      const link = document.createElement('a');
      link.href = image.preview;
      link.download = `image-${id}.png`;
      link.click();
    }
  };

  const handleBackClick = () => {
    window.location.href = '/';
  };

  const handleAddToCart = () => {
    // Get the uploaded image name or use default
    const uploadedImageName = sessionStorage.getItem('uploadedImageName') || 'drawing.jpg';
    
    // Determine which price option is selected
    let price = 0;
    let type = '';
    if (selectedPrice === 39) {
      price = 39.00;
      type = 'Fully crafted toy';
    } else if (selectedPrice === 29) {
      price = 29.00;
      type = 'DIY toy';
    } else {
      // Default to first option if none selected
      price = 39.00;
      type = 'Fully crafted toy';
    }
    
    // Determine which image is selected
    const selectedImageType = images.find(img => img.id === selectedImage)?.type || 'original';
    const referenceImage = selectedImageType === 'generated' ? 'Generated Concept' : 'Original drawing';
    
    // Create cart item
    const cartItem = {
      id: Date.now().toString(),
      orderName: `${title} ${uploadedImageName}`,
      referenceImage: referenceImage,
      price: price,
      type: type,
      quantity: 1
    };
    
    // Get existing cart or create new one
    const existingCart = sessionStorage.getItem('cartData');
    let cartItems = existingCart ? JSON.parse(existingCart) : [];
    
    // Add new item to cart
    cartItems.push(cartItem);
    
    // Save to sessionStorage
    sessionStorage.setItem('cartData', JSON.stringify(cartItems));
    
    // Redirect to cart
    window.location.href = '/cart';
  };

  const [title, setTitle] = useState("Buzzy the cutie Cat");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(1);  
  const [selectedImage, setSelectedImage] = useState<number | null>(1);

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        {isEditingTitle ? (
          <input
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            className="text-2xl md:text-3xl font-bold text-[#42307D] border-b border-purple-400 bg-transparent focus:outline-none"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTitle(tempTitle);
                setIsEditingTitle(false);
              }
              if (e.key === "Escape") {
                setTempTitle(title);
                setIsEditingTitle(false);
              }
            }}
          />
        ) : (
          <h1 className="text-2xl md:text-3xl font-bold text-[#42307D]">
            {title}
          </h1>
        )}

        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <Check
              className="w-5 h-5 text-green-600 cursor-pointer hover:text-green-800"
              onClick={() => {
                setTitle(tempTitle);
                setIsEditingTitle(false);
              }}
            />
            <X
              className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
              onClick={() => {
                setTempTitle(title);
                setIsEditingTitle(false);
              }}
            />
          </div>
        ) : (
          <Edit2
            className="w-5 h-5 text-[#7F56D9] cursor-pointer hover:text-[#42307D]"
            onClick={() => setIsEditingTitle(true)}
          />
        )}
      </div>

      {/* Main Grid - Images and Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
        {/* Left Section: Images and Story */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Upload Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((image) => (
              <div key={image.id} className={`relative rounded-3xl p-4 transition-all ${ selectedImage === image.id ? 'border-2 border-purple-600 shadow-lg bg-[#F9F5FF]' : 'border-2 border-[#F9F5FF] bg-[#F9F5FF]' }`}>
                <div className={`border-2 border-[#D6BBFB] rounded-2xl aspect-square flex items-center justify-center overflow-hidden relative ${image.preview ? 'bg-white' : 'bg-purple-200'}`}>
                  {/* Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedImage === image.id} 
                      onChange={() => setSelectedImage(image.id)}
                      className="w-5 h-5 text-[#7F56D9] border-2 border-[#D5D7DA] rounded focus:ring-[#7F56D9] cursor-pointer"
                    />
                  </div>
                  
                  {image.preview ? (
                    <img 
                      src={image.preview} 
                      alt={`Upload ${image.id}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <label className="w-full h-full flex items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(image.id, e)}
                        className="hidden"
                      />
                      <div className="text-center p-4">
                        <p className="text-xs text-gray-500">Click to upload</p>
                      </div>
                    </label>
                  )}
                </div>
                
                {/* Image Controls */}
                <div className="flex gap-2 mt-3">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(image.id, e)}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2 px-1 py-1 bg-purple-100 rounded-full cursor-pointer hover:bg-purple-200 transition">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-200 text-purple-700 rounded-full text-sm font-medium">
                        <div className="w-2 h-2 rounded-full bg-purple-700"></div>
                        <span>
                          {image.type === 'generated' ? 'Generated Concept' : 'Original drawing'}
                        </span>
                      </div>
                    </div>
                  </label>
                  <button
                    onClick={() => handleDownload(image.id)}
                    className="px-4 py-2 text-purple-700 rounded-full hover:bg-purple-200 transition flex items-center justify-center"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Toy's Story Section */}
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">
              Toy's Story
            </h2>
            <div className="border-2 border-[#D5D7DA] p-4 rounded-2xl">
              <p className="text-sm text-[#717680] leading-relaxed">
                Buzzy was not just any cat toy; he was Buzzy the Cutie Cat, 
                and his favorite thing in the whole wide world was the bright, 
                rainbow-colored sparkle that came from the sun when it hit 
                his shiny plastic nose. One Tuesday morning, Buzzy woke up 
                on the edge of the dresser, stretched his little felt arms, and 
                looked out the window for his morning dose of shine. But 
                something was wrong.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Price Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Price Card 1 - £39 */}
          <div className={`border-2 rounded-2xl p-5 flex flex-col bg-white relative  ${selectedPrice === 39 ? "border-purple-500 shadow-lg" : "border-gray-300"}`}>
            {/* Checkbox */}
            <div className="absolute top-3 left-3">
              <input
                type="checkbox"
                checked={selectedPrice === 39}  
                onChange={() => setSelectedPrice(39)}
                className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
              />
            </div>
            
            <div className="text-5xl font-bold text-gray-900 mb-1 mt-6">£39</div>
            <div className="text-sm font-bold text-gray-900 mb-1">Fully Crafted Toy</div>
            <div className="text-xs text-gray-500 mb-4">VAT included</div>
            
            <div className="space-y-2.5 flex-1">
              <div className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Fully crafted & colored</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Ready in 5-7 working days</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-400">
                <div className="w-4 h-4 flex-shrink-0 mt-0.5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <X className="w-3 h-3" />
                </div>
                <span>Coloring set</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>PLA (Eco-friendly)</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Free shipping</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Up to 30 cm size range</span>
              </div>
            </div>
          </div>

          {/* Price Card 2 - £29 */}
          <div className={`border-2 rounded-2xl p-5 flex flex-col bg-white relative ${selectedPrice === 29 ? "border-purple-500 shadow-lg" : "border-gray-300"}`}>
            {/* Checkbox - unchecked */}
            <div className="absolute top-3 left-3">
              <input
                type="checkbox"
                checked={selectedPrice === 29} 
                onChange={() => setSelectedPrice(29)}
                className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
              />
            </div>
            
            <div className="text-5xl font-bold text-gray-900 mb-1 mt-6">£29</div>
            <div className="text-sm font-bold text-gray-900 mb-1">DIY Toy</div>
            <div className="text-xs text-gray-500 mb-4">VAT included</div>
            
            <div className="space-y-2.5 flex-1">
              <div className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Uncolored</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Ready in 3-5 working days</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Coloring set</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>PLA (Eco-friendly)</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Free shipping</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Up to 30 cm size range</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkbox and Footer */}
      <div className="flex items-start gap-3 mb-6">
        <input
          type="checkbox"
          id="happy-checkbox"
          defaultChecked
          className="mt-0.5 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
        />
        <label htmlFor="happy-checkbox" className="text-sm text-gray-600 cursor-pointer">
          I am happy with the selected name, story, and style to continue
        </label>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <button 
          onClick={handleBackClick}
          className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Back
        </button>
        
        <button 
          onClick={handleAddToCart}
          className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <span>Add to cart</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default ToyProductPage;