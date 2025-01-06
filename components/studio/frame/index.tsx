import { Separator } from '@/components/ui/separator'
import RoundnessOption from '../image/roundness-option'
import AdditionalFrameOptions from './additional-frame-options'
import FramePicker from './frame-picker'

export default function FrameOptions() {
    return (
        <>
            <FramePicker />

            <RoundnessOption />

            <Separator className="mt-8 h-[0.1rem] w-full" />

            <AdditionalFrameOptions />
        </>
    )
}
