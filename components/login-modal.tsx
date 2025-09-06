"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Github, Mail } from 'lucide-react'

export function LoginModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Sign Up" : "Sign In"}</DialogTitle>
          <DialogDescription>
            {isSignUp
              ? "Create an account to get started"
              : "Sign in to your account"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" required />
          </div>
          <Button type="submit" className="w-full">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <Button variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" /> Github
          </Button>
          <Button variant="outline" className="w-full">
            <Mail className="mr-2 h-4 w-4" /> Google
          </Button>
        </div>
        <div className="text-center text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <Button
            variant="link"
            className="p-0"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
