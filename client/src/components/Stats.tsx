export default function Stats() {
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 py-6 gap-4 text-center">
          <div>
            <p className="text-white text-2xl md:text-3xl font-bold">5,000+</p>
            <p className="text-white text-sm md:text-base">Registered Users</p>
          </div>
          <div>
            <p className="text-white text-2xl md:text-3xl font-bold">3,200+</p>
            <p className="text-white text-sm md:text-base">Successful Deliveries</p>
          </div>
          <div>
            <p className="text-white text-2xl md:text-3xl font-bold">120+</p>
            <p className="text-white text-sm md:text-base">Cities Connected</p>
          </div>
          <div>
            <p className="text-white text-2xl md:text-3xl font-bold">4.8/5</p>
            <p className="text-white text-sm md:text-base">User Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
}
