import { Canvas as Studio } from "@/components/canvas";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import Canvas from '@/components/studio/studio-main';

export default function StudioPage() {
    const version: number = 1;
    return (
        <div className="flex flex-col h-screen bg-background">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                    {version === 1 && <Canvas />}
                    {version === 0 && <Studio />}
                </div>
            </div>
        </div>
    )
}
