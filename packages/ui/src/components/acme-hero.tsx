'use client';

import { FingerprintIcon, ListIcon, MoonIcon, SunIcon } from '@phosphor-icons/react';
import { Sheet, SheetContent, SheetTrigger } from '@workspace/ui/components/sheet';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { motion } from 'framer-motion';
import * as React from 'react';

export function AcmeHero() {
  return (
    <div className="container max-w-5xl mx-auto px-4 md:px-0">
      <header className="relative pt-6">
        <nav className="flex items-center justify-between rounded-2xl bg-background/80 backdrop-blur-md py-3 px-6 shadow-xl border border-border/40">
          <div className="flex items-center space-x-8">
            <a
              href="#"
              className="text-lg font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              Acme
            </a>
            <div className="hidden lg:flex items-center space-x-8">
              <a
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Docs
              </a>
              <a
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Components
              </a>
              <a
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Templates
              </a>
              <a
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon-sm" className="rounded-full">
              <SunIcon className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex font-medium text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Button>
            <Button
              size="sm"
              className="hidden md:inline-flex rounded-full px-5 font-semibold shadow-lg shadow-primary/20"
            >
              Get access
            </Button>
            <Sheet>
              <SheetTrigger
                render={<Button variant="ghost" size="icon-sm" className="lg:hidden" />}
              >
                <ListIcon className="size-5" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <nav className="flex flex-col space-y-6 pt-12">
                  <a
                    href="#"
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Docs
                  </a>
                  <a
                    href="#"
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Components
                  </a>
                  <a
                    href="#"
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Templates
                  </a>
                  <a
                    href="#"
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                  <Separator />
                  <Button
                    variant="ghost"
                    className="justify-start px-0 text-lg font-medium text-muted-foreground hover:text-foreground"
                  >
                    Sign in
                  </Button>
                  <Button className="w-full rounded-xl py-6 text-lg font-semibold">
                    Get access
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <main className="relative">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <motion.div
            className="flex flex-col items-center space-y-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm"
            >
              <span className="mr-2 flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              New components just landed
            </motion.div>

            <motion.h1
              className="text-5xl font-black tracking-tight sm:text-7xl md:text-8xl bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Websites,
              <br className="sm:hidden" /> Redefined
            </motion.h1>

            <motion.p
              className="mx-auto max-w-2xl text-lg sm:text-2xl text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Ship your projects with{' '}
              <span className="font-bold text-foreground inline-block">beautiful components</span>{' '}
              and <span className="font-bold text-foreground inline-block">modern templates</span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-5 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Button
                size="lg"
                className="rounded-2xl px-8 h-12 text-base font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                Explore Components
                <FingerprintIcon className="ml-2 size-5" weight="bold" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl px-8 h-12 text-base font-bold bg-background/50 backdrop-blur-sm hover:bg-muted/80"
              >
                <div className="mr-3 flex items-center space-x-1.5 opacity-60">
                  <span className="flex size-6 items-center justify-center rounded-lg border bg-background text-[10px] font-bold shadow-sm">
                    ⌘
                  </span>
                  <span className="flex size-6 items-center justify-center rounded-lg border bg-background text-[10px] font-bold shadow-sm">
                    B
                  </span>
                </div>
                Buy Now
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-col items-center space-y-4 pt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              <div className="flex items-center space-x-6 text-sm font-medium">
                <span className="text-primary hover:underline underline-offset-4 cursor-pointer">
                  /w Tailwind CSS
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-muted-foreground/80">300+ UI Blocks</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-primary hover:underline underline-offset-4 cursor-pointer">
                  /w Motion
                </span>
              </div>
              <p className="text-sm text-muted-foreground/50 font-medium italic">
                Crafted for premium developer experiences
              </p>
            </motion.div>

            <motion.div
              className="w-full relative group"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
              <div className="relative w-full border border-border/60 p-3 rounded-[2.5rem] bg-background/40 backdrop-blur-xl shadow-2xl">
                <div className="relative w-full rounded-[2rem] overflow-hidden border border-border shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bbda18256721?q=80&w=2070&auto=format&fit=crop"
                    alt="Dashboard Preview Dark"
                    className="w-full h-auto aspect-video object-cover hidden dark:block"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                    alt="Dashboard Preview Light"
                    className="w-full h-auto aspect-video object-cover dark:hidden block"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
