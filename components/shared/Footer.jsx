export default function Card({ listing }) {
  return (
    <footer className="bg-[#ebebeb] h-32 text-center flex flex-wrap justify-center items-center mt-12">
    <div className="w-full flex justify-center items-center space-x-4 text-[#222222]">
        <a href="#" className="hover:underline">Privacy</a>
        <a href="#" className="hover:underline">Terms</a>
        <a href="#" className="hover:underline">Support</a>
    </div>
    <div className="w-full flex justify-center items-center space-x-4 mt-2">
        <i className="fab fa-facebook-f text-xl" />
        <i className="fab fa-twitter text-xl" />
        <i className="fab fa-instagram text-xl" />
    </div>
    <div className="w-full mt-2 text-[#222222]">© 2025 Wanderlust, Inc.</div>
    </footer>
  );
}