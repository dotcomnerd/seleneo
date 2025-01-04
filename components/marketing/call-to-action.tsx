import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./hero/blur-fade";
import { AnimatedGridPattern } from "./grid-pattern";
import { cn } from "@/lib/utils";

export function CallToAction() {
  return (
    <FadeIn delay={0.95}>
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col text-center rounded-md p-4 lg:p-14 gap-8 items-center">
          <div>
            <Badge>Get started</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
              Try out the platform today!
            </h3>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
              From OG images, to social media posts, trust me, I know just how hard it is to create 
              images of your digital products, websites, and services. However, don't be afraid! 
              Try out Seleneo now—I <span className="underline">promise</span>{" "}that you'll design something worthwile ;)
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button className="gap-4" variant="default" disabled>
              Seleneo is coming soon.
            </Button>
          </div>
        </div>
      </div>
        <AnimatedGridPattern
        numSquares={10}
        maxOpacity={0.5}
        duration={1}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
    </div>
      </FadeIn>
  );
}