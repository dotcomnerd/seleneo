import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'
import { toast } from 'sonner'

export default function useScreenSizeWarningToast() {
  const router = useRouter()
  useLayoutEffect(() => {
    if (window.innerWidth <= 768) {
      // TODO: consider what's needed or not
      // blur the entire document
      // document.body.style.filter = 'blur(5px)'
      router.push('/') // TODO: maybe don't push to home page?
      // document.body.style.filter = 'none'
      // if (sessionStorage.getItem('toastShown')) return
      toast.warning("Not optimized for mobile devices!", { description: "The editor is not optimized for mobile devices, hence many feature won't work as expected. Please use a desktop device for the best experience." })
      // sessionStorage.setItem('toastShown', 'true')
    }
  }, [])
}
