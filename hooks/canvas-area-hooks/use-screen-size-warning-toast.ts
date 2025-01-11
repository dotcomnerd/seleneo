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
      toast.error("Not optimized for mobile devices 😔", { description: "The studio is not optimized for mobile devices just yet. In the meantime, check out our about page to learn more about Seleneo." })
      // sessionStorage.setItem('toastShown', 'true')
    }
  }, [])
}
