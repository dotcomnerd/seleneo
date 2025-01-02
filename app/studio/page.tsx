import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Canvas } from "@/components/canvas"

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
