import MainLayout from "@/components/layouts/MainLayout";
import { GallerySection } from "@/components/gallery/GallerySection";

const Gallery = () => {
  return (
    <MainLayout>
      <div className="pt-8 bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black min-h-[40vh] flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Our <span className="text-yellow-400">Gallery</span>
          </h1>
          <p className="text-slate-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Explore moments of excellence from our past academy sessions.
          </p>
        </div>
      </div>
      <GallerySection />
    </MainLayout>
  );
};

export default Gallery;
