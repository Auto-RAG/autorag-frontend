"use client"

import Link from "next/link"
import { Link as NextUILink } from "@nextui-org/link"
import { button as buttonStyles } from "@nextui-org/theme"
import { ArrowRight, Baby, Briefcase } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { siteConfig } from "@/config/site"
import { title } from "@/components/primitives"
import { GithubIcon } from "@/components/icons"

const versions = [
  {
    title: "Newbie",
    description: "Perfect for beginners just starting out.",
    icon: Baby,
    href: "/service",
  },
  {
    title: "Pro",
    description: "For experienced users who need more advanced features.",
    icon: Briefcase,
    href: "/projectstemp",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title({ color: "violet" })}>AutoRAG</span>
          <br />
          <span className={title()}>AutoML tool for RAG</span>
        </div>

        <div className="flex gap-3">
          <NextUILink
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.docs}
          >
            Documentation
          </NextUILink>
          <NextUILink
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </NextUILink>
        </div>
      </section>

      <section className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {versions.map((version, index) => (
              <Card key={index} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold">
                    <version.icon className="mr-2 h-6 w-6" />
                    {version.title}
                  </CardTitle>
                  <CardDescription>{version.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button asChild className="w-full">
                    <Link href={version.href}>
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

