import Image from "next/image";

const Discount = () => {
  return (
    <div className="relative w-[90%] md:w-[60%] bg-[#2273D1] flex flex-col md:flex-row items-start justify-between gap-4 rounded-xl text-white mx-auto mb-10 p-6 md:p-10 overflow-hidden">
      <div className="flex-1 text-center md:text-left z-10">
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          Join and get amazing discount
        </h2>
        <p className="text-white font-light text-sm md:text-base">
          Subscribe to our newsletter and get 20% off your first course!
        </p>
      </div>

      {/* Absolute image on the right, full height */}
      <div className="absolute top-0 right-0 h-full">
        <Image
          className="rounded-xl h-full object-cover"
          src="/assets/Aare.png"
          alt="Newsletter"
          width={150} // width can be ignored due to h-full
          height={180}
        />
      </div>
    </div>
  );
};

export default Discount;
