
const MenuHintWithArrow: React.FC = () => {


  // Top-center, unobtrusive
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white px-4 py-2 rounded-lg shadow text-xs font-medium select-none pointer-events-none">
      Press <span className="font-semibold">Ctrl+M</span> to open menu
    </div>
  );
};

export default MenuHintWithArrow;
