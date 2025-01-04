import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import dynamic from "next/dynamic";

const Canvas = dynamic(() => import('@/components/studio/studio-main'), {
    ssr: false,
    loading: () => <div className="flex-1 flex items-center justify-center">Loading...</div>
});

export default function StudioPage() {
    return (
        <div className="flex flex-col h-screen bg-background">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                    <Canvas />
                </div>
            </div>
        </div>
    )
}