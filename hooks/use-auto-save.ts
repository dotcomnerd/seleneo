import { useLastSavedTime } from "@/store/use-last-save";
import { useEffect } from "react";

export function useAutoSave(autoSaveFunction: () => Promise<void>) {
    const { lastSavedTime, setLastSavedTime } = useLastSavedTime();

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await autoSaveFunction();
                setLastSavedTime(new Date());
            } catch (error) {
                console.error("Auto-save failed:", error);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [autoSaveFunction, setLastSavedTime]);

    return { lastSavedTime };
}
