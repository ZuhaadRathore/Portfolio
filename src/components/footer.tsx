import { Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-background-light dark:bg-background-dark border-t-3 border-border-light dark:border-border-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4">
            <a
              href="https://twitter.com/zuhaad_rathore"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/zuhaad-rathore"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/ZuhaadRathore"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
          <p className="text-sm font-body text-text-light dark:text-text-dark">
            © 2024 ZUHAAD. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}