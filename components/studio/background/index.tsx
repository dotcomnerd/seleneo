import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBackgroundOptions } from '@/store/use-background-options'
import { useEffect } from 'react'
import CustomGradientPicker from './custom-gradient-picker'
import NoiseSlider from './noise-slider'
import NormalGradientPicker from './normal-gradient-picker'
import PatternPicker from './pattern-picker'

export default function BackgroundOptions() {
  const { backgroundType, setIsBackgroundClicked } = useBackgroundOptions()

  useEffect(() => {
    setIsBackgroundClicked(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Tabs
      className="w-full"
      defaultValue={
        backgroundType === 'solid'
          ? 'customTab'
          : backgroundType === 'pattern'
          ? 'patternsTab'
          : 'gradientsTab'
      }
    >
      <TabsList className="mb-4 bg-card border border-primary/30 shadow-sm [&>*]:px-[1rem]">
        <TabsTrigger value="gradientsTab">Gradient</TabsTrigger>
        <TabsTrigger value="patternsTab">Wallpaper</TabsTrigger>
        <TabsTrigger className="hidden sm:flex" value="customTab">
          Pick
        </TabsTrigger>
      </TabsList>
      <NoiseSlider />
      <TabsContent value="gradientsTab">
        <NormalGradientPicker />
      </TabsContent>
      <TabsContent value="patternsTab">
        <PatternPicker />
      </TabsContent>
      <TabsContent value="customTab">
        <CustomGradientPicker />
      </TabsContent>
    </Tabs>
  )
}
