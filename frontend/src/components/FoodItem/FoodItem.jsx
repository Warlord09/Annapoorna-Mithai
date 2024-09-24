import React, { useState, useEffect } from 'react';

const FoodItem = ({ item, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (item.image && item.image.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.image.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [item.image]);

  const getSmallestWeight = () => {
    if (!item.weights || item.weights.length === 0) return null;
    return item.weights.reduce((smallest, current) => 
      current.price < smallest.price ? current : smallest
    );
  };

  const smallestWeight = getSmallestWeight();

  const discountPercentage = smallestWeight ? 
    calculateDiscountPercentage(smallestWeight.mrp, smallestWeight.price) : 0;

  function calculateDiscountPercentage(mrp, sellingPrice) {
    if (mrp <= 0 || sellingPrice < 0) {
      return 0;
    }
    
    const discount = mrp - sellingPrice;
    const discountPercentage = (discount / mrp) * 100;
    
    return Math.ceil(discountPercentage);
  }

  return (
    <div onClick={onClick} className='bg-white rounded-lg overflow-hidden w-[156px] md:w-[218px] h-auto flex flex-col gap-auto cursor-pointer mb-5'>
      <div className='relative'>
        {item.image && item.image.length > 0 && (
          <img
            className='w-[156px] md:w-[180px] lg:w-[218px] h-[167px] md:h-[217px] object-cover rounded-lg'
            src={item.image[currentImageIndex]}
            alt={`${item.name} - Image ${currentImageIndex + 1}`}
          />
        )}
        {item.image && item.image.length > 1 && (
          <div className="absolute top-2 right-2 flex space-x-1">
            {item.image.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentImageIndex ? 'bg-yellow-400' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}
        <span className='absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded'>
          {discountPercentage}% OFF
        </span>
      </div>
      <div className='mt-3'>
        <p className='font-Nunito font-bold text-[14px] md:text-[14px] lg:text-[16px] truncate'>{item.name}</p>
        <p className='font-Nunito text-[#909090] text-[12px] md:text-[12px] lg:text-sm overflow-hidden line-clamp-1 mb-2'>
          {item.description}
        </p>
        {smallestWeight && (
          <p className='flex flex-col md:flex-row md:gap-2 font-Nunito font-bold text-[11px] md:text-[12px] lg:text-sm text-[#606060] mb-[0px]'>
            <span className='line-through text-gray-500 mr-1'>
              ₹{smallestWeight.mrp} / {smallestWeight.weight}
            </span>
            <span>
              ₹{smallestWeight.price} / {smallestWeight.weight}
            </span>
          </p>
        )}
        <button className='flex gap-2 items-center justify-center font-Nunito mt-2 bg-[#E9DEC6] text-black font-bold text-[12px] md:text-[14px] py-3 px-4 rounded-lg w-[156px] h-[32px] md:w-[198.17px] md:h-[40px]'>
          <span><img src='Cart.svg' loading='lazy' className='h-20px w-20px md:h-[24px] md:w-[24px]' alt="Cart" /></span> Add to cart
        </button>
      </div>
    </div>
  );
};

export default FoodItem;