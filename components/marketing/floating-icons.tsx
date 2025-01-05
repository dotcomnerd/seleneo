import { AppWindowMacIcon, Frame, PenTool, Scan, Share2, Wallpaper } from 'lucide-react';

export function FloatingElements() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="invisible lg:visible absolute top-32 left-[30%] md:left-[35%] opacity-0 animate-fade-in-1">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur p-3 rounded-2xl shadow-xl animate-float-slow">
                    <PenTool className="w-6 h-6 text-blue-500" />
                </div>
            </div>

            <div className="absolute top-32 md:top-28 right-[7%] md:right-[32%] opacity-0 animate-fade-in-2">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur p-3 rounded-2xl shadow-xl animate-float-delayed">
                    <Share2 className="w-6 h-6 text-blue-400" />
                </div>
            </div>

            <div className="absolute translate-x-24 top-96 md:top-96 right-[10%] md:right-[15%] opacity-0 animate-fade-in-3">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur p-3 rounded-2xl shadow-xl animate-float-slow">
                    <AppWindowMacIcon className="w-6 h-6 text-blue-500" />
                </div>
            </div>

            <div className="absolute top-[23rem] md:top-96 left-[10%] md:left-[20%] opacity-0 animate-fade-in-4">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur p-3 rounded-2xl shadow-xl animate-float-slow">
                    <Frame className="w-6 h-6 text-blue-400" />
                </div>
            </div>

            <div className="absolute top-20 md:top-56 left-[10%] md:left-[15%] opacity-0 animate-fade-in-1">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur p-3 rounded-2xl shadow-xl animate-float-delayed">
                    <Scan className="w-6 h-6 text-blue-400" />
                </div>
            </div>

            <div className="invisible lg:visible absolute top-72 md:top-52 right-[15%] md:right-[17%] opacity-0 animate-fade-in-3">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur p-3 rounded-2xl shadow-xl animate-float-slow">
                    <Wallpaper className="w-6 h-6 text-blue-500" />
                </div>
            </div>


            {/*
        omit - for now since its in the way of the prod screenshot
      <div className="absolute bottom-16 md:bottom-20 left-[20%] md:left-[25%] opacity-0 animate-fade-in-3">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur p-3 rounded-2xl shadow-xl animate-float">
          <Image className="w-6 h-6 text-white dark:text-gray-200" />
        </div>
      </div>

      <div className="absolute bottom-32 md:bottom-40 right-[10%] md:right-[15%] opacity-0 animate-fade-in-4">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur p-3 rounded-2xl shadow-xl animate-float-fast">
          <Zap className="w-6 h-6 text-blue-300" />
        </div>
      </div> */}

            <div className="absolute top-1/4 -left-12 w-36 h-px animate-pulse bg-gradient-to-r from-transparent via-blue-500 to-transparent rotate-12" />
            <div className="absolute top-1/3 -right-12 w-36 h-px animate-pulse delay-300 bg-gradient-to-l from-transparent via-blue-400 to-transparent -rotate-12" />
            <div className="absolute bottom-1/4 -left-12 w-36 h-px animate-pulse delay-700 bg-gradient-to-r from-transparent via-blue-300 to-transparent rotate-6" />

            <div className="absolute top-1/2 left-1/4 w-1 h-1 rounded-full bg-blue-500 animate-ping" />
            <div className="absolute bottom-1/3 right-1/4 w-1 h-1 rounded-full bg-blue-300 animate-ping delay-500" />

        </div>
    );
}