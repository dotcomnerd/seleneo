import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Image, Layout, Type, CuboidIcon as Cube, Zap } from 'lucide-react'

const features = [
  {
    title: "Advanced Color Tools",
    description: "Create stunning color palettes and gradients with ease.",
    icon: Palette,
  },
  {
    title: "Image Manipulation",
    description: "Edit and enhance images directly within the app.",
    icon: Image,
  },
  {
    title: "Responsive Layouts",
    description: "Design layouts that look great on any device.",
    icon: Layout,
  },
  {
    title: "Typography Control",
    description: "Fine-tune your typography with advanced controls.",
    icon: Type,
  },
  {
    title: "3D Elements",
    description: "Add depth to your designs with 3D elements and effects.",
    icon: Cube,
  },
  {
    title: "Performance Optimized",
    description: "Create beautiful designs without sacrificing performance.",
    icon: Zap,
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

