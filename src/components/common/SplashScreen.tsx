
const SplashScreen = () => {
   return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center flex justify-center items-center flex-col">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-gray-500 mb-4"></div>
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}

export default SplashScreen