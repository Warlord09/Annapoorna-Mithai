import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import Toast from "../Toast"; // Ensure this import is correct
import FilterComponent from "../Filter";

const FoodDisplay = ({ category, searchTerm }) => {
  const { food_list } = useContext(StoreContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState("1/2 KG");
  const [toastMessage, setToastMessage] = useState("");
  const [toastKey, setToastKey] = useState(0);
  const [selectedShell, setSelectedShell] = useState(true);
  const [filterSelected,setFilterSelected] = useState(false);

  const filteredFoodList = food_list.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setSelectedWeight("1/2 KG");
    document.body.classList.add('overflow-hidden');
  };

  const handleCloseOverlay = () => {
    setSelectedItem(null);
    document.body.classList.remove('overflow-hidden');
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const getWeightPrice = () => {
    switch (selectedWeight) {
      case "1/4 KG":
        return selectedItem.price * 0.25;
      case "1/2 KG":
        return selectedItem.price * 0.5;
      case "1 KG":
        return selectedItem.price;
      default:
        return selectedItem.price;
    }
  };

  const handleAddToCart = () => {
    if (!selectedItem) return; // Ensure an item is selected

    const cartItem = {
      name: selectedItem.name,
      quantity,
      weight: selectedWeight,
      price: getWeightPrice() * quantity,
      image: selectedItem.image,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    existingCart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Trigger a custom event to update the cart count in Navbar
    const event = new Event("storage");
    window.dispatchEvent(event);

    // Set the toast message and close the overlay
    setToastMessage("Item added successfully!");
    setToastKey((prevKey) => prevKey + 1); // Update the key to force re-render
    handleCloseOverlay();
  };
  
  

  return (
    <div className="ml-7" id="food-display">
    <h1 onClick={()=>{setFilterSelected(!filterSelected)}}>Filter</h1>
      <div className="grid grid-cols-3">
      {filteredFoodList.length > 0 ? (
        <div className={`${filterSelected?'lg:col-span-2' : 'lg:col-span-3'} w-[328px] md:w-full grid gap-3 md:gap-8 lg:gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-14 mx-auto max-w-screen-xl mb-10`}>
          {filteredFoodList.map((item, index) => (
            <FoodItem
              key={index}
              item={item}
              onClick={() => handleItemClick(item)}                           
            />
          ))} 
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            No Products Found
          </h2>
          <p className="text-gray-500">
            Try adjusting your search or filter to find what you're looking for!
          </p>
        </div>
      )}
      {filterSelected?(<FilterComponent></FilterComponent>):('')}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
          <div
            className={`bg-white rounded-t-3xl md:rounded-xl p-6 w-full md:w-[636px] relative md:translate-y-0 md:h-auto h-11/12 animate-slideUp md:animate-none`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="closeoverlay.svg"
              onClick={handleCloseOverlay}
              className="cursor-pointer absolute top-[-17px] right-4 text-gray-500 hover:text-gray-700"
            ></img>
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-auto md:w-[320px] md:h-[282px] rounded-xl"
              />
              <div className="flex flex-col justify-start">
                <h2 className="text-[16px] font-bold font-Nunito mb-2">
                  {selectedItem.name}
                </h2>
                <p className="text-[#909090] text-[12px] font-Nunito font-[400px] mb-2">
                  {selectedItem.description}
                </p>
                <div
                  className="flex gap-1 cursor-pointer"
                  onClick={() => setSelectedShell(!selectedShell)}
                >
                  <p className="font-Nunito font-bold text-[12px] md:text-[14px] text-[#909090]">
                    SHELL LIFE:
                  </p>
                  {selectedShell ? (
                    <img src="down.svg" className="cursor-pointer"></img>
                  ) : (
                    <img src="up.svg" className="cursor-pointer"></img>
                  )}
                </div>

                {selectedShell ? (
                  <></>
                ) : (
                  <p className="font-extrabold font-Nunito text-[12px] text-[#606060] md:text-[14px]">
                    {selectedItem.life}
                  </p>
                )}

                <hr className="mt-2"></hr>

                <div className="flex gap-2 mt-4">
                  {["1/4 KG", "1/2 KG", "1 KG"].map((weight) => (
                    <button
                      key={weight}
                      onClick={() => setSelectedWeight(weight)}
                      className={`px-[12px] py-[4px] md:px-[14px] md:py-[6px] font-Nunito font-extrabold text-[#606060] text-[12px] rounded ${
                        selectedWeight === weight
                          ? "border-2 border-[#F7AE1C] bg-[#FFFCF4]"
                          : "border-2 border-[#E6E6E6]"
                      }`}
                    >
                      {weight}
                    </button>
                  ))} 
                </div>

                <div className="flex items-center gap-2 mt-4 justify-between mb-4">
                  <p className="text-[14px] font-bold text-[#606060] font-Nunito">
                    ₹{getWeightPrice() * quantity}{" "}
                    <p className="text-[14px] font-bold text-[#26A460] font-Nunito">
                      With Offer ₹{selectedItem.offer * quantity}
                    </p>
                  </p>
                  <div className="bg-[#F8F8F8] border border-[#E6E6E6] px-2 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-2 py-1 rounded"
                    >
                      -
                    </button>
                    <span className="mx-2 font-bold text-[#303030] text-[14px] font-Nunito">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-2 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    className="border border-[#6B4B34] text-[#6B4B34] font-bold py-2 px-2 rounded-xl flex gap-1 font-Nunito hover:bg-[#6B4B3420]"
                    onClick={handleAddToCart}
                  >
                    <span>
                      <img src="Cart.svg" className="mt-[2px]"></img>
                    </span>
                    Add to cart
                  </button>
                  <button className="bg-[#332D21] text-white font-bold py-2 px-4 rounded-xl font-Nunito">
                    Buy now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast key={toastKey} message={toastMessage} duration={1000} />
    </div>
  );
};

export default FoodDisplay;