import MainLayout from "@/components/layouts/MainLayout";
import { GallerySection } from "@/components/gallery/GallerySection";

const Gallery = () => {
  return (
    <MainLayout>
      <div className="pt-8 bg-gradient-to-br from-black via-gray-900 to-black min-h-[40vh] flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Our <span className="text-yellow-400">Gallery</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Explore moments of excellence from our past academy sessions.
          </p>
        </div>
      </div>
      <GallerySection />
    </MainLayout>
  );
};

export default Gallery;
